import jwt from "jsonwebtoken";
import { getUserById } from "../../services/users/user.js";
export const isUser = (req, res, next) => {
    const authorization = req.headers.authorization;
    const value = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ");
    if (value != undefined) {
        let token = value === null || value === void 0 ? void 0 : value[1];
        if (!token) {
            res.json({ message: "cant access" });
        }
        jwt.verify(token, process.env.JSON_SECRET, async (err, decoded) => {
            if (err) {
                res.json({ message: "something went wrong" });
            }
            else {
                const { id } = decoded;
                let foundUser = await getUserById(id);
                if ((foundUser === null || foundUser === void 0 ? void 0 : foundUser.isAdmin) == false) {
                    res.locals.user = {
                        _id: foundUser._id.toString(),
                        firstname: foundUser.firstname,
                    };
                    next();
                }
                else {
                    res.json({ message: "only users can access" });
                }
            }
        });
    }
    else {
        res.json({ message: "cant access" });
    }
};
export const isAdmin = (req, res, next) => {
    const authorization = req.headers.authorization;
    const value = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ");
    if (value != undefined) {
        let token = value === null || value === void 0 ? void 0 : value[1];
        if (!token) {
            res.json({ message: "cant access" });
        }
        jwt.verify(token, process.env.JSON_SECRET, async (err, decoded) => {
            if (err) {
                res.json({ message: "something went wrong" });
            }
            else {
                const { id } = decoded;
                let foundUser = await getUserById(id);
                if ((foundUser === null || foundUser === void 0 ? void 0 : foundUser.isAdmin) == true) {
                    res.locals.user = {
                        _id: foundUser._id.toString(),
                        firstname: foundUser.firstname,
                    };
                    next();
                }
                else {
                    res.json({ message: "only users can access" });
                }
            }
        });
    }
    else {
        res.json({ message: "cant access" });
    }
};
