import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/users/userRouter.js";
import contactRouter from "./routes/contacts/contactRouter.js";
dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRouter);
app.use("/contacts", contactRouter);
app.listen(5000, () => {
  console.log("server run at port 5000");
});
