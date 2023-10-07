package auth

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"phonebookProject/services/users"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
)

type Role struct {
	Role string
}


func verifyToken(tokenString, secretKey string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Invalid signing method")
		}
		return []byte(secretKey), nil
	})
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, fmt.Errorf("Invalid token")
	}

	return token, nil
}
func GetLoggedUserInfo(w http.ResponseWriter, r *http.Request,client *mongo.Client)( string,Role,error){
	authorization := r.Header.Get("Authorization")
	value := strings.Split(authorization, " ")
	if len(value)>1{
		tokenString:=value[1]
		err:=godotenv.Load()
		if err!=nil{
			log.Fatal("can open dotenv")
		}
		secretKey :=os.Getenv("JSON_SECRET")
		token, err := verifyToken(tokenString, secretKey)
		if err != nil {
			 return "",Role{Role: ""}, err
		}
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
 			 return "",Role{Role: ""}, errors.New("")
		}
		id := claims["id"].(string)

		foundUser,err2:=users.GetUserById(client,id)
		if err2!=nil{
			fmt.Println("cant found user")
			return "",Role{Role: ""},err2
		}
		var role Role
		if foundUser.IsAdmin==true {
			role=Role{Role: "admin"}
		}else{
			role=Role{Role: "user"}

		}
		return foundUser.ID.Hex(),role,err2
	}
	return "",Role{Role: ""}, errors.New("")
}			

func IsUser(client *mongo.Client,next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_,role,err:=GetLoggedUserInfo(w,r,client)
		if err!=nil{

					response := map[string]interface{}{
					"message": "please login user",
				 }
				 jsonData,err3:=json.Marshal(response)
				 if err3!=nil{
					 fmt.Println("error in getting json data")
					 return
				 }
				 w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusBadRequest) 
				 w.Write(jsonData)

				 return
		}
		if role.Role=="admin"{

			response := map[string]interface{}{
				"message": "only users can access",
			 }
			 jsonData,err3:=json.Marshal(response)
			 if err3!=nil{
				 fmt.Println("error in getting json data")
				 return
			 }
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest) 
			w.Write(jsonData)
			return
		}
		next.ServeHTTP(w, r)

	})
}

func IsAdmin(client *mongo.Client,next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_,role,err:=GetLoggedUserInfo(w,r,client)
		if err!=nil{

					response := map[string]interface{}{
					"message": "please login admin",
				 }
				 jsonData,err3:=json.Marshal(response)
				 if err3!=nil{
					 fmt.Println("error in getting json data")
					 return
				 }
				 w.Header().Set("Content-Type", "application/json")
				 w.WriteHeader(http.StatusBadRequest) 
				 w.Write(jsonData)
				 return
		}
		if role.Role=="user"{

			response := map[string]interface{}{
				"message": "only users can access",
			 }
			 jsonData,err3:=json.Marshal(response)
			 if err3!=nil{
				 fmt.Println("error in getting json data")
				 return
			 }
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest) 
			w.Write(jsonData)

			return
		}
		next.ServeHTTP(w, r)

	})
}
// func IsAdmin(next http.Handler) http.Handler {
//     return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		fmt.Println("execute middlewarwe before")
// 		authorization := r.Header.Get("Authorization")
// 		value := strings.Split(authorization, " ")
// 		if len(value)>1{
// 			tokenString:=value[1]
// 			err:=godotenv.Load()
// 			if err!=nil{
// 				log.Fatal("can open dotenv")
				
// 			}
// 			secretKey :=os.Getenv("JSON_SECRET")
// 			fmt.Println(tokenString,secretKey)
// 			token, err := verifyToken(tokenString, secretKey)
// 			if err != nil {
// 				fmt.Println("Token verification failed:", err)
// 				return
// 			}
// 			claims, ok := token.Claims.(jwt.MapClaims)
// 			if !ok {
// 				fmt.Println("Invalid token claims")
// 				return
// 			}
// 			id := claims["id"].(string)
// 			fmt.Println("User ID:", id)
// 			next.ServeHTTP(w, r)

// 		}else{
// 			response := map[string]interface{}{
// 				"message": "please login",
// 		 	}
// 			 jsonData,err3:=json.Marshal(response)
// 			 if err3!=nil{
// 			 	fmt.Println("error in getting json data")
// 			 	return
// 		 	}
// 			 w.Header().Set("Content-Type", "application/json")
// 		 	 w.WriteHeader(http.StatusBadRequest) 
// 			 w.Write(jsonData)
// 			 return
// 		}
		
//     })
// }
// func IsUser(w http.ResponseWriter, r *http.Request){
// 		fmt.Println("execute middlewarwe before")
// 		authorization := r.Header.Get("Authorization")
// 		value := strings.Split(authorization, " ")
// 		if len(value)>1{
// 			tokenString:=value[1]
// 			err:=godotenv.Load()
// 			if err!=nil{
// 				log.Fatal("can open dotenv")
				
// 			}
// 			secretKey :=os.Getenv("JSON_SECRET")
// 			fmt.Println(tokenString,secretKey)
			
			// token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// 	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			// 		return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			// 	}
			// 	return secretKey, nil
			// })
			// if err != nil {
			// 	fmt.Println("Token parsing failed:", err)
			// 	return
			// }
			// if token.Valid {
			// 	fmt.Println("Token is valid")
		
			// 	// Access claims
			// 	if claims, ok := token.Claims.(jwt.MapClaims); ok {
			// 		id := claims["id"].(string)
			// 		expirationTime := claims["exp"].(float64)
			// 		expiration := time.Unix(int64(expirationTime), 0)
					
			// 		fmt.Printf("id: %s\n", id)
			// 		fmt.Printf("Token expires at: %v\n", expiration)
			// 	}
			// } else {
			// 	fmt.Println("Token is invalid")
			// }
			
	// 	}

	// } 



// export const isUser = (req: Request, res: Response, next: NextFunction) => {
// 	const authorization = req.headers.authorization;
// 	const value = authorization?.split(" ");
// 	if (value != undefined) {
// 	  let token = value?.[1];
// 	  if (!token) {
// 		res.json({ message: "cant access" });
// 	  }
	//   jwt.verify(
	// 	token,
	// 	process.env.JSON_SECRET as string,
	// 	async (err, decoded) => {
	// 	  if (err) {
	// 		res.json({ message: "something went wrong" });
	// 	  } else {
	// 		const { id } = decoded as { id: string };
// 			let foundUser = await getUserById(id);
	// 		if (foundUser?.isAdmin == false) {
	// 		  res.locals.user = {
	// 			_id: foundUser._id.toString(),
	// 			firstname: foundUser.firstname,
	// 		  };
	// 		  next();
	// 		} else {
	// 		  res.json({ message: "only users can access" });
	// 		}
	// 	  }
	// 	}
	//   );
	// } else {
	//   res.json({ message: "cant access" });
	// }