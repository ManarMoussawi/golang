import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getUserById } from "../../services/users/user.js";

export const isUser = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  const value = authorization?.split(" ");
  if (value != undefined) {
    let token = value?.[1];
    if (!token) {
      res.json({ message: "cant access" });
    }
    jwt.verify(
      token,
      process.env.JSON_SECRET as string,
      async (err, decoded) => {
        if (err) {
          res.json({ message: "something went wrong" });
        } else {
          const { id } = decoded as { id: string };
          let foundUser = await getUserById(id);
          if (foundUser?.isAdmin == false) {
            res.locals.user = {
              _id: foundUser._id.toString(),
              firstname: foundUser.firstname,
            };
            next();
          } else {
            res.json({ message: "only users can access" });
          }
        }
      }
    );
  } else {
    res.json({ message: "cant access" });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  const value = authorization?.split(" ");
  if (value != undefined) {
    let token = value?.[1];
    if (!token) {
      res.json({ message: "cant access" });
    }
    jwt.verify(
      token,
      process.env.JSON_SECRET as string,
      async (err, decoded) => {
        if (err) {
          res.json({ message: "something went wrong" });
        } else {
          const { id } = decoded as { id: string };
          let foundUser = await getUserById(id);
          if (foundUser?.isAdmin == true) {
            res.locals.user = {
              _id: foundUser._id.toString(),
              firstname: foundUser.firstname,
            };

            next();
          } else {
            res.json({ message: "only users can access" });
          }
        }
      }
    );
  } else {
    res.json({ message: "cant access" });
  }
};
