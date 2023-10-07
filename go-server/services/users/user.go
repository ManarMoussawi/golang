package users

import (
	"context"
	"fmt"
	"log"
	"os"
	"phonebookProject/models/usermodel"
	"phonebookProject/variables"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// router.get("/fullname/:id", isUser, async (req, res) => {
// 	const { id } = req.params;
// 	const user = await getUserById(id);
// 	if (user) {
// 	  const fullname = `${user.firstname} ${user.lastname}`;
// 	  res.json({ fullname });
// 	} else res.json({ message: "cant find user" });
//   });



func SignToken(id string)(string, error){
	err:=godotenv.Load()
	if err!=nil{
		log.Fatal("can open dotenv")
		
	}
	secretKey := os.Getenv("JSON_SECRET")
	if secretKey == "" {
        return "", fmt.Errorf("JSON_SECRET is empty")
    }
	claims := jwt.MapClaims{
        "id": id,
        "exp": time.Now().Add(2 * 24 * time.Hour).Unix(),
    }
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err2 := token.SignedString([]byte(secretKey))
    if err != nil {
        return "", err2
    }
	return tokenString,nil
}



func GetAUser(client *mongo.Client , username , password string)(usermodel.User, error ) {
	var database = client.Database(variables.MongodbDatabase)
	users := database.Collection(variables.UserCollection)
	filter := bson.M{"username": username, "password": password}
	var foundUser usermodel.User

    result := users.FindOne(context.TODO(), filter)
	if result.Err()!=nil{
		return foundUser, result.Err()
	}
	err2:=result.Decode(&foundUser)

	if err2 != nil {
		return foundUser, err2
	}

	return foundUser,nil
}

func GetUserById(client *mongo.Client,id string)(usermodel.User, error ){
	var database = client.Database(variables.MongodbDatabase)
	users := database.Collection(variables.UserCollection)
	objectID,err:=primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Fatal(err)
	}
	filter := bson.M{"_id": objectID}
	var foundUser usermodel.User
    result := users.FindOne(context.TODO(), filter)
	if result.Err()!=nil{
		return foundUser, result.Err()
	}
	err2:=result.Decode(&foundUser)
	if err2 != nil {
		return foundUser, err2
	}
	return foundUser,nil
}
 func GetNonDeletedUsers(client *mongo.Client)([]usermodel.User,error){
	var database = client.Database(variables.MongodbDatabase)
	users := database.Collection(variables.UserCollection)
	filter := bson.M{"isDeleted":false,"isAdmin":false}
	var foundUsers []usermodel.User
	cursor,err:=users.Find(context.TODO(),filter)

	if err!=nil{
		return foundUsers,err
	}
	defer cursor.Close(context.TODO()) 
	err = cursor.All(context.TODO(), &foundUsers)
	if err != nil {
		log.Fatal(err)
	}

	return foundUsers,nil
}

func UpdateUser(client *mongo.Client, id string, editUserBody usermodel.EditedUserBody )(error){
	database:=client.Database(variables.MongodbDatabase)
	users:=database.Collection(variables.UserCollection)
	objectId,err:=primitive.ObjectIDFromHex(id)
	if err!=nil{
		return err
	}
	parsedTime, err3 := time.Parse("2006-01-02", editUserBody.DateOfBirth)
	if err3!=nil{
		return err3
	}
	filter:=bson.M{"_id":objectId}
	update:=bson.M{"$set":bson.M{"firstname": editUserBody.Firstname, "lastname":editUserBody.Lastname,"username":editUserBody.Username,"dateOfBirth":parsedTime,"editedAt":time.Now() }}
	result:=users.FindOneAndUpdate(context.Background(),filter,update)
	if result.Err()!=nil{
		return result.Err()
	}
	return nil
}
func SoftDeleteUser(client *mongo.Client ,id string)(error){
	var database = client.Database(variables.MongodbDatabase)
	users := database.Collection(variables.UserCollection)
	objectId,err:=primitive.ObjectIDFromHex(id)
	if err != nil {
		return  err
	}
	filter := bson.M{"_id":objectId}
	update:=bson.M{"$set":bson.M{"isDeleted":true}}
	result:= users.FindOneAndUpdate(context.Background(),filter,update)
	if result.Err()!=nil{
		return result.Err()
	}
	return nil
}

func CreateAUser(client *mongo.Client, createUserBody usermodel.CreatedUserBody)(error){
	var database = client.Database(variables.MongodbDatabase)
	users := database.Collection(variables.UserCollection)
	var createUser usermodel.User
	parsedDateOfBirth, err3 := time.Parse(time.RFC3339, createUserBody.DateOfBirth)
	if err3!=nil{
		return err3
	}

	createUser.Firstname=createUserBody.Firstname
	createUser.Lastname=createUserBody.Lastname
	createUser.Username=createUserBody.Username
	createUser.Password=createUserBody.Password
	createUser.DateOfBirth=parsedDateOfBirth
	createUser.CreatedAt=time.Now()
	createUser.IsAdmin=false
	createUser.IsDeleted=false
		
	created,err2:=users.InsertOne(context.TODO(),createUser)
	if err2!=nil{
		fmt.Println("err22222222222",err2)
		return err2
	}
	fmt.Println("created",created)
	return nil
}
