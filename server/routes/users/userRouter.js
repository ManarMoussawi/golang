var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import express from "express";
import { MongoError } from "mongodb";
import dotenv from "dotenv";
import { isUser } from "../../services/authentication/auth.js";
dotenv.config();
const router = express.Router();
import { isAdmin } from "../../services/authentication/auth.js";
import { CreateUserSchema, EditUserSchema, } from "../../schemas/user/user.js";
import { createUser, getNonDeletedUsers, softDeleteUser, editUser, signToken, getAUser, getUserById, } from "../../services/users/user.js";
router.get("/", isAdmin, async (req, res) => {
    const allusers = await getNonDeletedUsers();
    const usersWithoutPassword = allusers.map((user) => {
        const { password } = user, remaining = __rest(user, ["password"]);
        return remaining;
    });
    res.json({ users: usersWithoutPassword });
});
router.get("/fullname/:id", isUser, async (req, res) => {
    const { id } = req.params;
    const user = await getUserById(id);
    if (user) {
        const fullname = `${user.firstname} ${user.lastname}`;
        res.json({ fullname });
    }
    else
        res.json({ message: "cant find user" });
});
router.post("/create", isAdmin, async (req, res) => {
    try {
        const body = req.body;
        const _a = req.body, { username } = _a, others = __rest(_a, ["username"]);
        const _b = req.body, { dateOfBirth } = _b, remainingBody = __rest(_b, ["dateOfBirth"]);
        const newBody = Object.assign(Object.assign({}, remainingBody), { dateOfBirth: new Date(dateOfBirth) });
        const parseResul = CreateUserSchema.safeParse(newBody);
        if (parseResul.success == true) {
            const { firstname } = res.locals.user;
            const result = await createUser(newBody, firstname);
            if (result.acknowledged == true)
                res.json({ created: true });
        }
        else {
            res.json({ bodyFromServer: body });
        }
    }
    catch (error) {
        if (error instanceof MongoError && error.code == 11000) {
            res.json({ message: "username is taken, choose another one" });
        }
        else
            res.json({ message: "error occures" });
    }
});
router.post("/edit/:id", isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const _a = req.body, { dateOfBirth } = _a, remainingBody = __rest(_a, ["dateOfBirth"]);
        const _b = req.body, { username } = _b, others = __rest(_b, ["username"]);
        const newBody = Object.assign(Object.assign({}, remainingBody), { dateOfBirth: new Date(dateOfBirth) });
        const result = EditUserSchema.safeParse(newBody);
        if (result.success == true) {
            const { firstname } = res.locals.user;
            const response = await editUser(id, newBody, firstname);
            if (response.value) {
                res.json({ isUpdated: true });
            }
            else {
                res.json({ message: "cant updated user" });
            }
        }
        else {
            res.json({ bodyFromServer: req.body });
        }
    }
    catch (error) {
        if (error instanceof MongoError && error.code == 11000) {
            res.json({ message: "username taken choose another one" });
        }
        else {
            res.json({ message: "error in editing user" });
        }
    }
});
router.get("/delete/:id", isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await softDeleteUser(id);
        if (result.value) {
            res.json({ deleted: true });
        }
    }
    catch (err) {
        res.json({ message: "cant delete user" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const userFound = await getAUser(username, password);
        if (!userFound) {
            res.json({ message: "error in username or password" });
        }
        else {
            try {
                let id = userFound._id.toString();
                let token = await signToken(id);
                res.json({
                    token: token,
                    id: userFound._id.toString(),
                    firstname: userFound.firstname,
                    isAdmin: userFound.isAdmin,
                });
            }
            catch (error) {
                console.log("Error generating token:", error);
            }
        }
    }
    catch (err) { }
});
export default router;
