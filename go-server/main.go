package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"phonebookProject/routeHandlers/contactHandler"
	"phonebookProject/routeHandlers/userHandler"

	"phonebookProject/services/auth"
	"phonebookProject/variables"
	"strings"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// func handlerWithClient(client *mongo.Client) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		switch r.URL.Path{
// 		case "/":
// 				 Welcome(w,r)
// 		case "/users/login":
// 			Login(w,r,client)
// 		default:
// 			http.NotFound(w,r)
// 		}
// 	}
// }

//		id := r.URL.Query().Get("id")

func handlerWithClient(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		urlPath:=r.URL.Path
		if strings.HasPrefix(urlPath,"/users/delete/"){
			id:=strings.TrimPrefix(urlPath,"/users/delete/")
			auth.IsAdmin(client,http.HandlerFunc(func(w http.ResponseWriter, r *http.Request){userHandler.DeleteUserHandler(w,r,client,id)})).ServeHTTP(w,r)
			return
		}
		if strings.HasPrefix(urlPath,"/users/edit/"){
			id:=strings.TrimPrefix(urlPath,"/users/edit/")
			auth.IsAdmin(client,http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {userHandler.EditUserHandler(w,r,client,id)})).ServeHTTP(w,r)
			return
		}
		if strings.HasPrefix(urlPath,"/contacts/edit/"){
			id:=strings.TrimPrefix(urlPath,"/contacts/edit/")
			
			auth.IsUser(client,http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {contactHandler.EditContactHandler(w,r,client,id)})).ServeHTTP(w,r)
			return
		}		
		if strings.HasPrefix(urlPath,"/contacts/delete/"){
			id:=strings.TrimPrefix(urlPath,"/contacts/delete/")
			auth.IsUser(client,http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {contactHandler.DeleteContactHandler(w,r,client,id)})).ServeHTTP(w,r)
			return
		}
		switch urlPath{
		case "/users/login":
			userHandler.LoginHandler(w,r,client)
		case "/users/create":
			auth.IsAdmin(client,http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { userHandler.CreateUserHandler(w,r,client)})).ServeHTTP(w,r)
		case "/users":
			// LogUsers(w,r,client)
			auth.IsAdmin(client,http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { userHandler.LogUsersHandler(w,r,client)})).ServeHTTP(w,r)
		case "/contacts/create":
			auth.IsUser(client,http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {contactHandler.CreateContactHandler(w,r,client)})).ServeHTTP(w,r)
		case "/contacts/search":
			auth.IsUser(client,http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {contactHandler.SearchContactsHandler(w,r,client)})).ServeHTTP(w,r)
		
		// case "/":
		// 	Welcome(w,r)
				// auth.IsUser(http.HandlerFunc(Welcome)).ServeHTTP(w,r) 
		default:
			http.NotFound(w,r)
		}
	}
}
// router.get("/search", isUser, searchContactHandler);
// router.post("/create", isUser, createContactHandler);
// router.post("/edit/:id", isUser, editContactHandler);
// router.get("/delete/:id", isUser, deleteContactHandler);


func Welcome(w http.ResponseWriter, r *http.Request){
	fmt.Println("hello")
}

func CorsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173") // Replace with your React app's origin
		w.Header().Set("Access-Control-Allow-Origin", "*") // Replace with your React app's origin

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	}
}


func main() {
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(variables.MongodbURL).SetServerAPIOptions(serverAPI)
	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			log.Fatal(err)
		}
	}()
		
	fmt.Printf("mongo db connected\n ")
	httpHandler := CorsMiddleware(handlerWithClient(client))

	err1 := http.ListenAndServe(":5000",httpHandler)
	if err1!=nil{
		fmt.Println("error: ",err1)
	}

}