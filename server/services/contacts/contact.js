import db from "../../db/conn.js";
import { ObjectId } from "mongodb";
import { CreateContactSchema, } from "../../schemas/contact/contact.js";
export const getContactById = async (id) => {
    const contact = await db
        .collection("contacts")
        .findOne({ _id: new ObjectId(id) });
    return contact;
};
export const deleteContact = async (id) => {
    const result = await db
        .collection("contacts")
        .findOneAndDelete({ _id: new ObjectId(id) });
    return result;
};
export const insertContact = async (body, _id) => {
    const result = await db.collection("contacts").insertOne(Object.assign(Object.assign({}, body), { createdAt: new Date(), createdBy: _id }));
    return result;
};
export const updateContact = async (id, body, _id) => {
    const filter = { _id: new ObjectId(id) };
    const update = {
        $set: Object.assign(Object.assign({}, body), { updatedAt: new Date(), updatedBy: _id }),
    };
    const result = await db
        .collection("contacts")
        .findOneAndUpdate(filter, update);
    return result;
};
export const isEmail = (text) => {
    const trimmedText = text.trim();
    const regex = /@/;
    return regex.test(trimmedText);
};
export const isNumber = (num) => {
    const trimmedNum = num.trim();
    const regex = /^[0-9]+$/;
    return regex.test(trimmedNum);
};
export const deleteContactHandler = async (req, res) => {
    const { id } = req.params;
    const { _id } = res.locals.user;
    const createdByUser = await getContactById(id);
    if ((createdByUser === null || createdByUser === void 0 ? void 0 : createdByUser.createdBy) === _id) {
        try {
            const result = await deleteContact(id);
            if (result.value) {
                res.json({ isDeleted: true });
            }
            else {
                res.json({ message: "cant delete contact" });
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        res.json({ message: "only creators of contacts can delete them" });
    }
};
export const editContactHandler = async (req, res) => {
    const body = req.body;
    const { id } = req.params;
    const { _id } = res.locals.user;
    const createdByUser = await getContactById(id);
    if (_id === (createdByUser === null || createdByUser === void 0 ? void 0 : createdByUser.createdBy)) {
        const result = CreateContactSchema.safeParse(body);
        if (result.success == true) {
            try {
                const result = await updateContact(id, body, _id);
                if (result.ok == 1) {
                    res.json({ isUpdated: true });
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            res.json({ bodyFromServer: body });
        }
    }
    else {
        res.json({ message: "only creator of contacts can edit them " });
    }
};
export const createContactHandler = async (req, res) => {
    const body = req.body;
    const { _id } = res.locals.user;
    const result = CreateContactSchema.safeParse(body);
    if (result.success == true) {
        try {
            const result = await insertContact(body, _id);
            if (result.acknowledged == true) {
                res.json({ created: true });
            }
            else {
                res.json({ created: false });
            }
        }
        catch (err) {
            res.json({ message: "cant create contact" });
        }
    }
    else {
        res.json({ body });
    }
};
export const searchContactHandler = async (req, res) => {
    let startAtContact = parseInt(req.query.startAtContact);
    let perPage = parseInt(req.query.perPageContacts);
    let scopeSearch = req.query.scope;
    let text = req.query.text;
    let isMe = req.query.checkByMe;
    let insensitiveSearch = { $regex: text, $options: "i" };
    let doSearchText = false;
    let doSearchScope = scopeSearch !== "private" && scopeSearch !== "public" ? false : true;
    let mySearch = {};
    let query = [];
    if (text !== (null || undefined) && text !== "") {
        doSearchText = true;
    }
    if (doSearchText) {
        if (isEmail(text)) {
            mySearch = { "emails.email": insensitiveSearch };
        }
        else if (isNumber(text)) {
            mySearch = { "phoneNumbers.phone": { $regex: text } };
        }
        else {
            mySearch = {
                $or: [
                    { firstname: insensitiveSearch },
                    { lastname: insensitiveSearch },
                    { "emails.email": insensitiveSearch },
                ],
            };
        }
    }
    if (doSearchText) {
        query.push(mySearch);
    }
    if (doSearchScope) {
        query.push({ scope: scopeSearch });
    }
    if (isMe === "true" || scopeSearch === "private") {
        const { _id } = res.locals.user;
        query.push({ createdBy: _id });
    }
    const filteredQuery = query.reduce((result, item) => {
        return Object.assign(Object.assign({}, result), item);
    }, {});
    const filteredContacts = db.collection("contacts").find(filteredQuery);
    const countFilteredContacts = await filteredContacts.count();
    let tableFilteredContacts = await db
        .collection("contacts")
        .find(filteredQuery)
        .toArray();
    if (filteredContacts) {
        res.json({
            filteredContacts: await filteredContacts
                .skip(startAtContact)
                .limit(perPage)
                .toArray(),
            count: countFilteredContacts,
            tableFilteredContacts,
        });
    }
    else {
        res.json({ message: "cant get contacts" });
    }
};
