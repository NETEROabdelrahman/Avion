import express from "express";
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { authRouter } from "./routes/auth.js";
import { productRouter } from "./routes/products.js";
import { userRouter } from "./routes/users.js";
import { ordersRouter } from "./routes/orders.js";

const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())

app.use('/auth',authRouter)
app.use('/products',productRouter)
app.use('/users',userRouter)
app.use('/orders',ordersRouter)

mongoose.connect(process.env.CONNECTION_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
       
    })


    const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
    console.log('running server')
})