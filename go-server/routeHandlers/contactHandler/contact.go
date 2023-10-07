package contactHandler

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"phonebookProject/models/contactmodel"
	"phonebookProject/services/auth"
	"phonebookProject/services/contacts"
	"strconv"

	"go.mongodb.org/mongo-driver/mongo"
)
func CreateContactHandler(w http.ResponseWriter, r *http.Request, client *mongo.Client){
	if r.Method!="POST"{
		log.Fatal("mehod not supported")
	}
	var createContactBody contactmodel.Cr_Up_ContactBody
	body,err:=io.ReadAll(r.Body)
	if err!=nil{
		fmt.Println("cant get body of create contact form")
		return
	}
	err1:=json.Unmarshal(body,&createContactBody)
	if err1!=nil{
		fmt.Println("cant unmarshal json to createContactBody")
		return
	}
	for _,phoneNumber:=range createContactBody.PhoneNumbers{
		if !phoneNumber.Validate(){
			response := createContactBody
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
	}
	for _,email:=range createContactBody.Emails{
		if !email.Validate(){
			response := createContactBody
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
	}
	if !contactmodel.Validatename(createContactBody.Firstname)|| !contactmodel.Validatename(createContactBody.Lastname) {
		response := createContactBody
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

	userId,_,err6:=auth.GetLoggedUserInfo(w,r,client)
	if err6!=nil{
		log.Fatal(err6)
	}
	err2:=contacts.InsertContact(client,createContactBody,userId)
	if err2!=nil{
		fmt.Println("cant create contact",err2)
		response := map[string]interface{}{
       		"message": "cant create contact",
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
	 jsonData,err4:=json.Marshal(response2)
		if err4!=nil{
			fmt.Println("error in getting json data")
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated) 
		w.Write(jsonData)
		return
}


func EditContactHandler(w http.ResponseWriter, r *http.Request, client *mongo.Client, id string){
	if r.Method!="POST"{
		log.Fatal("method not supported")
	}
	var editContactBody contactmodel.Cr_Up_ContactBody
	body,err:=io.ReadAll(r.Body)
	if err!=nil{
		fmt.Println("cant get body of edit user form")
		return
	}
	
	err1:=json.Unmarshal(body,&editContactBody)
	if err1!=nil{
		fmt.Println("cant unmarshal json to editUserBody")
		return
	}
	userId,_,err6:=auth.GetLoggedUserInfo(w,r,client)
	if err6!=nil{
		log.Fatal(err6)
	}
	err2:=contacts.UpdateContact(client,id,editContactBody,userId)
	if err2!=nil{
		fmt.Println("no updated contact")
		response := map[string]interface{}{
       		"message": "cant update contact",
		}
		jsonData,err3:=json.Marshal(response)
		if err3!=nil{
			fmt.Println("error in getting json data")
			return
		}
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

func DeleteContactHandler(w http.ResponseWriter, r *http.Request, client *mongo.Client, id string){
	createdById,err:=contacts.GetCreatedByIdContact(client,id)
	if err!=nil{
		log.Fatal(err)
	}
 	userId,_,error:=auth.GetLoggedUserInfo(w,r,client)
	if error!=nil{
		fmt.Println("cant get user logged info")
		return
	}
	// fmt.Println("inside delete",createdById,userId)

	if createdById!=userId{
		// fmt.Println("not equal ",createdById,userId)
		response:=map[string]string{
			"message":"only creators of contacts can delete them",
		}
		jsonData,err:=json.Marshal(response)
		if err!=nil{log.Fatal(err)}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound) 
		_, err = w.Write(jsonData)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		}
		return
	}
	// fmt.Println("equal ",createdById,userId)

	err2:=contacts.DeleteContact(client,id)
	if err2!=nil{
		response:=map[string]string{
			"message":"cant delete contact",
		}
		jsonData,err:=json.Marshal(response)
		if err!=nil{log.Fatal(err)}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound) 
		_, err = w.Write(jsonData)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	}

	response:=map[string]bool{
		"isDeleted":true,
	}
	jsonData,err:=json.Marshal(response)
	if err!=nil{log.Fatal(err)}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted) 
	_, err = w.Write(jsonData)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}	
}

// export const searchContactHandler = async (req: Request, res: Response) => {
// 	let startAtContact = parseInt(req.query.startAtContact as string);
// 	let perPage = parseInt(req.query.perPageContacts as string);
// 	let scopeSearch = req.query.scope;
// 	let text = req.query.text as string;
// 	let isMe = req.query.checkByMe;
// 	let insensitiveSearch = { $regex: text, $options: "i" };
  
	// let doSearchText = false;
	// let doSearchScope =
	//   scopeSearch !== "private" && scopeSearch !== "public" ? false : true;
	// let mySearch = {};
	// let query = [];
	// if (text !== (null || undefined) && text !== "") {
	//   doSearchText = true;
	// }
	// if (doSearchText) {
	//   if (isEmail(text)) {
	// 	mySearch = { "emails.email": insensitiveSearch };
	//   } else if (isNumber(text)) {
	// 	mySearch = { "phoneNumbers.phone": { $regex: text } };
	//   } else {
	// 	mySearch = {
	// 	  $or: [
	// 		{ firstname: insensitiveSearch },
	// 		{ lastname: insensitiveSearch },
	// 		{ "emails.email": insensitiveSearch },
	// 	  ],
	// 	};
	//   }
	// }
	// if (doSearchText) {
	//   query.push(mySearch);
	// }
	// if (doSearchScope) {
	//   query.push({ scope: scopeSearch });
	// }
	// if (isMe === "true" || scopeSearch === "private") {
	//   const { _id } = res.locals.user;
	//   query.push({ createdBy: _id });
	// }
	// const filteredQuery = query.reduce((result, item) => {
	//   return { ...result, ...item };
// 	}, {});
// 	const filteredContacts = db.collection("contacts").find(filteredQuery);
// 	const countFilteredContacts = await filteredContacts.count();
// 	let tableFilteredContacts = await db
// 	  .collection("contacts")
// 	  .find(filteredQuery)
// 	  .toArray();
// 	if (filteredContacts) {
// 	  res.json({
// 		filteredContacts: await filteredContacts
// 		  .skip(startAtContact)
// 		  .limit(perPage)
// 		  .toArray(),
// 		count: countFilteredContacts,
// 		tableFilteredContacts,
// 	  });
// 	} else {
// 	  res.json({ message: "cant get contacts" });
// 	}
//   };
  
func SearchContactsHandler(w http.ResponseWriter, r *http.Request, client *mongo.Client){
	if r.Method!="GET"{
		log.Fatal("mehod not supportedd")
	}

// 	let isMe = req.query.checkByMe;
// 	let insensitiveSearch = { $regex: text, $options: "i" };


	queryParams:=r.URL.Query()
	startAt := queryParams.Get("startAtContact")
	perPage := queryParams.Get("perPageContacts")
	scope := queryParams.Get("scope")
	text := queryParams.Get("text")
	isMe:=queryParams.Get("checkByMe")
	// fmt.Println("isssssssssme ",isMe, reflect.TypeOf(isMe))
	startAtContact, err := strconv.Atoi(startAt)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	perPageContacts, err := strconv.Atoi(perPage)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	id,_,err4:=auth.GetLoggedUserInfo(w,r,client)
	if err4!=nil{
		log.Fatal(err4)
	}
	filteredContacts,tableContacts,count,err:=contacts.SearchContact(client, startAtContact, perPageContacts, scope, text, isMe,id)
	if err!=nil{
		response :=map[string]string{
			"message":"cant get contacts",
		}
		jsonData,err:=json.Marshal(response)
		if err!=nil{log.Fatal(err)}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound) 
		_, err = w.Write(jsonData)
		if err != nil {
            http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        }
		return
	}
	response :=map[string]interface{}{
		"filteredContacts":filteredContacts,
		"tableFilteredContacts": tableContacts,
		"count":count,
	}
	jsonData,err:=json.Marshal(response)
	if err!=nil{log.Fatal(err)}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) 
	_, err = w.Write(jsonData)
	if err != nil {
           http.Error(w, "Internal Server Error", http.StatusInternalServerError)
    }
	return
}