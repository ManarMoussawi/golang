package usermodel

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// type User1 struct {
// 	ID          primitive.ObjectID    `bson:"_id,omitempty"`
// 	Firstname   string    `bson:"firstname"`
// 	Lastname    string    `bson:"lastname"`
// 	Username    string    `bson:"username"`
// 	Password    string    `bson:"password,omitempty"`
// 	DateOfBirth time.Time `bson:"dateOfBirth"`
// 	CreatedBy   string    `bson:"createdBy,omitempty"`
// 	EditedBy    string    `bson:"editedBy,omitempty"`
// 	CreatedAt   time.Time `bson:"createdAt"`
// 	EditedAt    time.Time `bson:"editedAt,omitempty"`
// 	IsDeleted   bool      `bson:"isDeleted"`
// 	IsAdmin     bool      `bson:"isAdmin"`
// }
type User struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Firstname   string             `bson:"firstname" json:"firstname"`
	Lastname    string             `bson:"lastname" json:"lastname"`
	Username    string             `bson:"username" json:"username"`
	Password    string             `bson:"password,omitempty" json:"password,omitempty"`
	DateOfBirth time.Time          `bson:"dateOfBirth" json:"dateOfBirth"`
	CreatedBy   string             `bson:"createdBy,omitempty" json:"createdBy,omitempty"`
	EditedBy    string             `bson:"editedBy,omitempty" json:"editedBy,omitempty"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	EditedAt    time.Time          `bson:"editedAt,omitempty" json:"editedAt,omitempty"`
	IsDeleted   bool               `bson:"isDeleted" json:"isDeleted"`
	IsAdmin     bool               `bson:"isAdmin" json:"isAdmin"`
}
type ErrorMessage struct {
    Message string `json:"message"`
}
type LoginRequest struct{
	Username string `json:"username"`
	Password string `json:"password"`
}
type LoginResponse struct {
    Token     string `json:"token"`
    ID        string `json:"id"`
    Firstname string `json:"firstname"`
    IsAdmin   bool   `json:"isAdmin"`
}
type EditedUserBody struct{
	Firstname   string             `bson:"firstname" json:"firstname"`
	Lastname    string             `bson:"lastname" json:"lastname"`
	Username    string             `bson:"username" json:"username"`
	DateOfBirth string          `bson:"dateOfBirth" json:"dateOfBirth"`
}
type CreatedUserBody struct{
	Firstname   string             `bson:"firstname" json:"firstname"`
	Lastname    string             `bson:"lastname" json:"lastname"`
	Username    string             `bson:"username" json:"username"`
	DateOfBirth string         		`bson:"dateOfBirth" json:"dateOfBirth"`
	Password    string             `bson:"password,omitempty" json:"password,omitempty"`

}
type UserInfoRes struct{
	Firstname   string      `json:"firstname"`
	ID       	string 		`json:"id"`

}