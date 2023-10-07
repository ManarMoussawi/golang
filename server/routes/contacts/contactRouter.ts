import express from "express";
const router = express.Router();
import {
  deleteContactHandler,
  editContactHandler,
  createContactHandler,
  searchContactHandler,
} from "../../services/contacts/contact.js";

import { isUser } from "../../services/authentication/auth.js";

router.get("/search", isUser, searchContactHandler);
router.post("/create", isUser, createContactHandler);
router.post("/edit/:id", isUser, editContactHandler);
router.get("/delete/:id", isUser, deleteContactHandler);

export default router;
