import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import DatabaseConnection from './config/ConnectDB.js'
import UserRouter from './Routes/UserRoutes.js'
import categoryRouter from './Routes/CategoryRoute.js'
import productRouter from './Routes/ProductRoute.js'
import AddressRoutes from './Routes/AddressRoute.js'
import subCategoryRoutes from './Routes/SubcategoryRoute.js'
import CartRoute from './Routes/CartRoute.js'
import bannerRouter from './Routes/BannerRoute.js'
import DashboardRouter from './Routes/DashboardRoute.js'
import wishlistRouter from './Routes/WishlistRoute.js'
import OrderRouter from './Routes/OrderRoute.js'
import contactRouter from './Routes/ContactRoute.js'


const app = express()
DatabaseConnection()

// app.use(cors({
//     credentials: true,
//     origin: ["http://localhost:5173", "http://localhost:5174","http://localhost:5175"],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"]
// }));
app.use(cors())
app.use(express.json())
app.use(cookieParser())


// Routes
app.use('/api/user', UserRouter)
app.use('/api/category', categoryRouter)
app.use('/api/product', productRouter)
app.use('/api/address', AddressRoutes)
app.use('/api/contact', contactRouter)
app.use('/api/subcategory', subCategoryRoutes)
app.use('/api/cart', CartRoute)
app.use('/api/banner', bannerRouter)
app.use('/api/dashboard', DashboardRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/orders', OrderRouter)




const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server Is Running ON ${PORT}`);

})       