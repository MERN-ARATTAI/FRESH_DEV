import express from 'express';
import { Register, Login, Logout, getMe, getAllUsers, getUserById, toggleUserStatus } from '../controller/User.js';
import { Protect } from '../Middleware/User.js';
import { Admin } from '../Middleware/Admin.js';

const UserRouter = express.Router();

UserRouter.post('/register', Register)
UserRouter.post('/login', Login)
UserRouter.get('/logout', Protect, Logout)
UserRouter.get("/me", Protect, getMe);

// Customer management routes (admin only)
UserRouter.get('/', Protect, Admin, getAllUsers);
UserRouter.get('/:id', Protect, Admin, getUserById);
UserRouter.patch('/:id/toggle-status', Protect, Admin, toggleUserStatus);

export default UserRouter;