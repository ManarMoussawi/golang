import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const mongodbURL = process.env.MongodbURL;
const mongoClient = new MongoClient(mongodbURL);
let conn;
try {
    conn = await mongoClient.connect();
}
catch (err) {
    console.log(err.message);
    process.exit(1);
}
const db = conn.db("Phonebook-zod");
export default db;
