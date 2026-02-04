import express from 'express';
import { Protect } from '../Middleware/User.js';
import { createAddress, updateAddress, getAddress, deleteAddress } from '../controller/Address.js';

const AddressRoutes = express.Router()

AddressRoutes.post('/', Protect, createAddress)
AddressRoutes.put('/:id', Protect, updateAddress)
AddressRoutes.get('/', Protect, getAddress)
AddressRoutes.delete('/:id', Protect, deleteAddress)

export default AddressRoutes;