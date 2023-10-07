package contacts

import (
	"context"
	"fmt"
	"log"
	"phonebookProject/models/contactmodel"
	"phonebookProject/variables"
	"regexp"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func IsEmail(text string)bool{
	trimmedText:=strings.TrimSpace(text)
	regex,err:=regexp.Compile(`.*@.*`)
	if err!=nil{
		fmt.Println("error in compiling email")
		return false
	}
	checkedString:=regex.MatchString(trimmedText)
	return checkedString
}
func IsPhone(text string)bool{
	trimmedText:=strings.TrimSpace(text)
	regex,err:=regexp.Compile(`[0-9]+`)
	if err!=nil{
		fmt.Println("error in compiling phone")
		return false
	}
	checkedString:=regex.MatchString(trimmedText)
	return checkedString
}

func InsertContact(client *mongo.Client,body contactmodel.Cr_Up_ContactBody, userId string)(error){
	database:= client.Database(variables.MongodbDatabase)
	contacts:=database.Collection(variables.ContactCollection)
	createdContact:= contactmodel.Contact{
		Firstname: body.Firstname,
		Lastname: body.Lastname,
		Emails: body.Emails,
		PhoneNumbers: body.PhoneNumbers,
		Scope: body.Scope,
		CreatedAt: time.Now(),
		CreatedBy: userId,
	}
	
	_,err:=contacts.InsertOne(context.TODO(),createdContact)
	if err!=nil{
		fmt.Println("errrr",err)
		return err
	}
	return nil
}
func UpdateContact(client *mongo.Client, id string, editContactBody contactmodel.Cr_Up_ContactBody,userId string )(error){
	database:=client.Database(variables.MongodbDatabase)
	contacts:=database.Collection(variables.ContactCollection)
	objectId,err:=primitive.ObjectIDFromHex(id)
	if err!=nil{
		return err
	}
	
	filter:=bson.M{"_id":objectId}
	update:=bson.M{"$set":bson.M{"firstname": editContactBody.Firstname,"lastname": editContactBody.Lastname,"scope": editContactBody.Scope, "emails":editContactBody.Emails,"phoneNumbers":editContactBody.PhoneNumbers,"updatedAt":time.Now(), "updatedBy":userId}}
	result:=contacts.FindOneAndUpdate(context.Background(),filter,update)
	if result.Err()!=nil{
		return result.Err()
	}
	return nil
}
func GetCreatedByIdContact(client *mongo.Client, id string)(string,error){
	database:=client.Database(variables.MongodbDatabase)
	contacts:=database.Collection(variables.ContactCollection)
	objectId,err:=primitive.ObjectIDFromHex(id)
	if err!=nil{
		fmt.Println( "error in object id")

		log.Fatal(err)
	}
	var foundContact contactmodel.Contact
	filter:=bson.M{"_id":objectId}
	result:=contacts.FindOne(context.TODO(),filter)
	err2:=result.Decode(&foundContact)
	if err2!=nil{
		log.Fatal(err)
	}
	return foundContact.CreatedBy,nil

}
func DeleteContact(client *mongo.Client, id string )(error){
	database:=client.Database(variables.MongodbDatabase)
	contacts:=database.Collection(variables.ContactCollection)
	objectId,err:=primitive.ObjectIDFromHex(id)
	if err!=nil{
		return err
	}
	filter:=bson.M{"_id":objectId}
	result:= contacts.FindOneAndDelete(context.TODO(),filter)
	if result.Err()!=nil{
		return result.Err()
	}
	return nil
}

func SearchContact(client *mongo.Client, startAtContact , perPage int, scopeSearch , text, isMe , id  string)([]contactmodel.Contact,[]contactmodel.Contact,int,error){
	 insensitiveSearch :=bson.M { "$regex": text, "$options": "i" }
	 doSearchText := false
	 var doSearchScope bool
	 if scopeSearch != "private" && scopeSearch != "public"{
		doSearchScope=false
	 }else{
		doSearchScope=true
	 }
	  mySearch :=bson.M{};
	var query []map[string]interface{}
	if text!=""{
		doSearchText=true
	}
	if doSearchText==true{
		if IsEmail(text){
			mySearch=bson.M{"emails.email":insensitiveSearch}
		}else if (IsPhone(text)) {
			mySearch=bson.M{"phoneNumbers.phone":insensitiveSearch}
		}else{
			mySearch=bson.M{
					"$or":bson.A{
					bson.M{"firstname": insensitiveSearch},
					bson.M{"lastname": insensitiveSearch},
					bson.M{"emails.email": insensitiveSearch},
				},
			}
		
		}
	}
	if (doSearchText) {
		query = append(query,mySearch)
	}
	if(doSearchScope){
		query=append(query, bson.M{"scope":scopeSearch})
	}
	if(!doSearchScope){
		query=append(query, bson.M{"$or":bson.A{
			bson.M{"scope":"private","createdBy":id},
			bson.M{"scope":"public"},
		}})
	}

	if isMe == "true" || scopeSearch == "private" {
		query=append(query, bson.M{"createdBy":id})
	}
	filteredQuery:=make(map[string]interface{}) 
	for _,queryItem:=range query{
		for key,value:=range queryItem{
			filteredQuery[key]=value
		}

	}
	database:= client.Database(variables.MongodbDatabase)
	contacts:=database.Collection(variables.ContactCollection)
	var emptyContacts []contactmodel.Contact
	opts := options.Find().SetSkip(int64(startAtContact)).SetLimit(int64(perPage))

	cursor,err1:=contacts.Find(context.TODO(),filteredQuery,opts)
	if err1!=nil{
		return emptyContacts,emptyContacts,0,err1
	}
	cursor1,err2:=contacts.Find(context.TODO(),filteredQuery)
	if err2!=nil{
		return emptyContacts,emptyContacts,0,err2
	}
	 filteredContacts :=[]contactmodel.Contact{} 
	
	err3:= cursor.All(context.TODO(),&filteredContacts)
	defer cursor.Close(context.TODO())
	if err3!=nil{
		return emptyContacts,emptyContacts,0,err3
	}
	var tableContacts []contactmodel.Contact
	err4:= cursor1.All(context.TODO(),&tableContacts)
	defer cursor1.Close(context.TODO())
	if err4!=nil{
		return emptyContacts,emptyContacts,0,err3
	}
	return filteredContacts,tableContacts,len(tableContacts),nil
}
