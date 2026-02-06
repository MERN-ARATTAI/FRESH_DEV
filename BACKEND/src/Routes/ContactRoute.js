import express from "express";
import {
    createContact,
    getAllContacts,
    deleteContact,
} from "../controller/Contact.js"
import { Protect } from '../Middleware/User.js';
import { Admin } from '../Middleware/Admin.js';

const contactRouter = express.Router();

// public
contactRouter.post("/create", Protect, createContact);

// admin
contactRouter.get("/all", Protect, Admin, getAllContacts);
contactRouter.delete("/:id", Protect, Admin, deleteContact);

export default contactRouter