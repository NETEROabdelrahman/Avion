import express from "express";
import auth from '../middleware/auth.js'
import ProductsModel from "../models/ProductsModel.js";
import UserModel from "../models/UserModel.js";
import OrdersModel from "../models/OrdersModel.js";


const router = express.Router();


//get order

router.get("/", async (req, res) => {
    try {
      const orders = await OrdersModel.find().populate('order').populate('user')
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json(error)
    }
})

//get one order

router.get("/:orderid", async (req, res) => {


    try {
      const orders = await OrdersModel.findOne({_id:req.params.orderid}).populate('order').populate('user')
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json(error)
    }
})

//get user orders

router.get("/find/myorders",auth, async (req, res) => {
    try {
        const orders = await OrdersModel.find({ user: req.user.id }).populate('order')
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json(error)
    }
})

//update order status

router.put("/:orderid", auth, async (req, res) => {

    const { status } = req.body
    const order = await OrdersModel.findById(req.params.orderid)
    console.log((order.user).toString())
    console.log(req.user.id)
    if (req.user.isAdmin||req.user.id == (order.user).toString()) {
        
        try {
            const orders = await OrdersModel.findByIdAndUpdate(req.params.orderid, { $set: { status } }, { new: true })
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(500).send('you are not the admin')
    }
})




//delete one order

router.delete("/:orderid", async (req, res) => {

    let newAvailableAmount = [];
    const order = await OrdersModel.findById(req.params.orderid)
    if (order) {
        
        try {
             const products = await ProductsModel.find({ _id:  { $in: order.order }  })
             const productAvailableAmount = products.map(product=>product.amount)
             const quantity = order.quantity
            for (let i = 0; i < quantity.length; i++) {
                newAvailableAmount.push(productAvailableAmount[i]+quantity[i]);
            }
            for (let i = 0; i < products.length; i++) {
                
                    products[i].amount = newAvailableAmount[i];
            }
            await Promise.all(products.map(product => product.save()));
            await OrdersModel.findByIdAndDelete(req.params.orderid)
          res.status(200).json({message:"deleted successfully"});
        } catch (error) {
            console.log(error)
          res.status(500).json(error)
        }
    } else {
        res.status(500).json({message:"order doesn't exist"})
        
    }
})


//post order

router.post("/",auth, async (req, res) => {
    const userId = req.user.id
    

    const { quantity, status, order } = req.body
    
    let totalPrice = 0;
    let newAvailableAmount = [];
    
    
    try {
        const products = await ProductsModel.find({ _id: { $in: [...order] } })
        const productAvailableAmount = products.map(product=>product.amount)
        const productPrices = products.map(product => product.price)
        
        for (let i = 0; i < quantity.length; i++) {
            totalPrice += quantity[i] * productPrices[i];
        }
        
        for (let i = 0; i < quantity.length; i++) {
            newAvailableAmount.push(productAvailableAmount[i]-quantity[i]);
        }
        
        for (let i = 0; i < products.length; i++) {
            if (newAvailableAmount[i] >= 0) {
                products[i].amount = newAvailableAmount[i];
            } else {
                console.log("out of stock")
                res.status(500).json({ message: "out of stock" })
                return;
            }
        }
        await Promise.all(products.map(product => product.save()));
        const newOrder = new OrdersModel({ user: userId, order, quantity, status, totalPrice })
        await newOrder.save()
            res.status(201).json(newOrder)
    } catch (error) {
        console.log(error)
         res.status(500).json(error)
        }
} 
);
  


export {router as ordersRouter}