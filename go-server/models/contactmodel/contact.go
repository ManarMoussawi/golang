package contactmodel

import (
	"regexp"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)



type Email struct {
	Email string `json:"email" bson:"email"`
}
type PhoneNumber struct {
	Phone string `json:"phone" bson:"phone"`
}

type Contact struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Firstname   string             `bson:"firstname" json:"firstname"`
	Lastname    string             `bson:"lastname" json:"lastname"`
	Emails      []Email            `json:"emails" bson:"emails"`
	PhoneNumbers []PhoneNumber     `json:"phoneNumbers" bson:"phoneNumbers"`
	Scope       string             `json:"scope" bson:"scope"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	CreatedBy   string             `json:"createdBy,omitempty" bson:"createdBy,omitempty"`
	UpdatedAt   time.Time          `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
	UpdatedBy   string             `json:"updatedBy,omitempty" bson:"updatedBy,omitempty"`
}
type Cr_Up_ContactBody struct{
	Firstname   string             `bson:"firstname" json:"firstname"`
	Lastname    string             `bson:"lastname" json:"lastname"`
	Emails      []Email            `json:"emails" bson:"emails"`
	PhoneNumbers []PhoneNumber     `json:"phoneNumbers" bson:"phoneNumbers"`
	Scope       string             `json:"scope" bson:"scope"`

}

func (p PhoneNumber)Validate()bool{
	regex,err:=regexp.Compile(`^(03|05|01|79)[0-9]{6}$`)
	if err!=nil{
		return false
	}
	return regex.MatchString(p.Phone)
}
func(e Email) Validate()bool{
	regex,err:=regexp.Compile(`^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}$`)
	if err!=nil{
		return false
	}
	return regex.MatchString(e.Email)
}
func Validatename(name string) bool {
    return len(name) >= 1
}


