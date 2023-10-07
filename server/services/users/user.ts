import db from "../../db/conn.js";
import { CreateUserType, EditUserType } from "../../schemas/user/user.js";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export const signToken = async (id: string) => {
  const secretKey = process.env.JSON_SECRET as string;
  const token = jwt.sign(
    {
      id,
    },
    secretKey,
    {
      expiresIn: "2 days",
    }
  );
  return token;
};

export const getAUser = async (username: string, password: string) => {
  const user = await db.collection("users").findOne({ username, password });
  return user;
};

export const getUserById = async (id: string) => {
  let foundUser = await db
    .collection("users")
    .findOne({ _id: new ObjectId(id) });
  return foundUser;
};

export const getNonDeletedUsers = async () => {
  const allusers = await db
    .collection("users")
    .find({ isDeleted: false, isAdmin: false })
    .toArray();
  return allusers;
};

export const createUser = async (body: CreateUserType, firstname: string) => {
  let result = await db.collection("users").insertOne({
    ...body,
    createdAt: new Date(),
    createdBy: firstname,
    isAdmin: false,
    isDeleted: false,
  });
  return result;
};

export const editUser = async (
  id: string,
  body: EditUserType,
  firstname: string
) => {
  const filter = { _id: new ObjectId(id) };
  const update = {
    $set: {
      ...body,
      editedAt: new Date(),
      editedBy: firstname,
    },
  };
  const result = await db.collection("users").findOneAndUpdate(filter, update);
  return result;
};

export const softDeleteUser = async (id: string) => {
  const filter = { _id: new ObjectId(id) };
  const update = {
    $set: {
      isDeleted: true,
    },
  };
  const result = await db.collection("users").findOneAndUpdate(filter, update);
  console.log("resulltttt", result);
  return result;
};
