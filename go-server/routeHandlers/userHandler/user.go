package userHandler

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"phonebookProject/models/usermodel"
	"phonebookProject/services/users"

	"go.mongodb.org/mongo-driver/mongo"
)



func LoginHandler(w http.ResponseWriter, r *http.Request,client *mongo.Client){
	if r.Method!="POST"{
		fmt.Println("method not supported in login")
		return
	}
	var loginRequest usermodel.LoginRequest
	body,err:=io.ReadAll(r.Body)
	if err!=nil{
		fmt.Println("can get body from request")
		return
	}
	err1:=json.Unmarshal(body,&loginRequest)
	if err1!=nil{
		fmt.Println("cant decode json to go bson")
		return
	}
	userfound,err2:= users.GetAUser(client,loginRequest.Username,loginRequest.Password)
	var Message usermodel.ErrorMessage
	if err2!=nil{
		Message=usermodel.ErrorMessage{Message:"error in username or password"}
		jsonData,err:=json.Marshal(Message)
		if err!=nil{log.Fatal(err)}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound) 
		_, err = w.Write(jsonData)
		if err != nil {
            http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        }
		return
	}
	id:=userfound.ID.Hex()
	token,err3:=users.SignToken(id)
	if err3!=nil{
		log.Fatal(err3)
	}
	w.Header().Set("Content-Type", "application/json")
	response:=usermodel.LoginResponse{
		Token: token,
		ID: id,
		Firstname: userfound.Firstname,
		IsAdmin: userfound.IsAdmin,
	}
    jsonData, err := json.Marshal(response)
	if err!=nil{log.Fatal(err)}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	// fmt.Println("json data ",string(jsonData)) 
	_, err = w.Write(jsonData)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
	return
}

func LogUsersHandler(w http.ResponseWriter, r *http.Request,client *mongo.Client){
	if r.Method!="GET"{
		fmt.Println("method not supported")
		return
	}
	gottenUsers,err:=users.GetNonDeletedUsers(client)
	if err!=nil{
		fmt.Println("cant get users")
		return
	}
	var usersWithoutPassword []usermodel.User
	for _,user:=range gottenUsers{
		user.Password=""
		usersWithoutPassword=append(usersWithoutPassword, user)
	}
	
	response := map[string]interface{}{
        "users": usersWithoutPassword,
    }
	jsonData, err := json.Marshal(response)
    if err != nil {
        log.Fatal(err)
    }
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) 
	_, err = w.Write(jsonData)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
	return
}

func CreateUserHandler(w http.ResponseWriter, r *http.Request, client *mongo.Client){
	if r.Method!="POST"{
		log.Fatal("mehod not supported")
	}
	var createUserBody usermodel.CreatedUserBody
	body,err:=io.ReadAll(r.Body)
	if err!=nil{
		fmt.Println("cant get body of create user form")
		return
	}
	err1:=json.Unmarshal(body,&createUserBody)
	if err1!=nil{
		fmt.Println("cant unmarshal json to createUserBody")
		return
	}
	err2:= users.CreateAUser(client,createUserBody)
	if err2!=nil{
		fmt.Println("cant create user",err2)
		response := map[string]interface{}{
       		"message": "cant create user",
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
	
	response2 := map[string]interface{}{
		"created": true,
 	}
 	jsonData2,err4:=json.Marshal(response2)
 	if err4!=nil{
	 	fmt.Println("error in getting json data")
	 	return
 	}
 	w.Header().Set("Content-Type", "application/json")
 	w.WriteHeader(http.StatusOK) 
	w.Write(jsonData2)
}

func DeleteUserHandler(w http.ResponseWriter, r *http.Request,client *mongo.Client,id string){
	if r.Method!="GET"{
		fmt.Println("method not supported")
		return
	}
	err:=users.SoftDeleteUser(client,id)
	if err!=nil{
		fmt.Println("cant soft delete user")
		return
	}
	response := map[string]interface{}{
        "deleted": true,
    }
	jsonData,err2:=json.Marshal(response)
	if err2!=nil{
		fmt.Println("error in getting json data")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNotFound) 
	w.Write(jsonData)
}

func EditUserHandler(w http.ResponseWriter, r *http.Request, client *mongo.Client, id string){
	if r.Method!="POST"{
		log.Fatal("method not supported")
	}
	var editUserBody usermodel.EditedUserBody
	body,err:=io.ReadAll(r.Body)
	if err!=nil{
		fmt.Println("cant get body of edit user form")
		return
	}
	err1:=json.Unmarshal(body,&editUserBody)
	if err1!=nil{
		fmt.Println("cant unmarshal json to editUserBody")
		return
	}
	err2:= users.UpdateUser(client,id,editUserBody)
	if err2!=nil{
		fmt.Println("no updated user")
		response := map[string]interface{}{
       		"message": "cant update user",
		}
		jsonData,err3:=json.Marshal(response)
		if err3!=nil{
			fmt.Println("error in getting json data")
			return
		}
		// fmt.Println("json data",string(jsonData))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotModified) 
		w.Write(jsonData)
	}
	response2 := map[string]interface{}{
		"isUpdated": true,
 	}
 	jsonData2,err4:=json.Marshal(response2)
 	if err4!=nil{
	 	fmt.Println("error in getting json data")
	 	return
 	}
 	w.Header().Set("Content-Type", "application/json")
 	w.WriteHeader(http.StatusOK) 
	w.Write(jsonData2)
	
}

