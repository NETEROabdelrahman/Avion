import express from "express";
import auth from '../middleware/auth.js'
import ProductsModel from "../models/ProductsModel.js";
import UserModel from "../models/UserModel.js";


const router = express.Router();


//get all products
router.get("/allproducts", async (req, res) => {
    try {
        const products = await ProductsModel.find()
        res.status(200).json(products)
    } catch (error) {
      res.status(500).json(error);
    }
  });


//get products

// router.get("/", async (req, res) => {
//     const limit = req.query.limit
//     const filter = req.query.filter
//     const sort = req.query.sort
//     const search = req.query.search

//     const regex = new RegExp(search, 'i');

//     try {
//         if (filter) {
//             if (sort == "price") {
//                 const products = await ProductsModel.find({ category: filter }).sort({ price: -1 }).limit(limit)
//                 res.status(200).json(products);
//                 return;
//             }
//             if (sort == "name") {
//                 const products = await ProductsModel.find({ category: filter }).sort({ name: 1 }).limit(limit)
//                 res.status(200).json(products);
//                 return;
//             }
//             if (sort == "createdAt") {
//                 const products = await ProductsModel.find({ category: filter }).sort({ createdAt: 1 }).limit(limit)
//                 res.status(200).json(products);
//                 return;
//             }
//             if (sort == "amount") {
//                 const products = await ProductsModel.find({ category: filter }).sort({ amount: -1 }).limit(limit)
//                 res.status(200).json(products);
//                 return;
//             }
//             const products = await ProductsModel.find({ category: filter }).limit(limit)
//             res.status(200).json(products);
//         }  else if (search) {
//             const products = await ProductsModel.find({ name: regex }).limit(limit)
//             res.status(200).json(products);
//         } else {
//             const products = await ProductsModel.find().limit(limit)
//             res.status(200).json(products);
//         }

//     } catch (error) {
//         res.status(500).json(error)
//     }
// });

router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit) || 8; // default to 8 results per page
    const page = parseInt(req.query.page) || 1; // default to first page
    const offset = (page - 1) * limit; // calculate the offset based on the page and limit
    const filter = req.query.filter;
    const sort = req.query.sort;
    const search = req.query.search;
  
    const regex = new RegExp(search, "i");
  
    try {
      let query = {};
  
      if (filter) {
        query.category = filter;
      }
  
      if (search) {
        query.name = regex;
      }
  
      let sortQuery = {};
  
      if (sort == "price") {
        sortQuery.price = -1;
      } else if (sort == "name") {
        sortQuery.name = 1;
      } else if (sort == "createdAt") {
        sortQuery.createdAt = 1;
      } else if (sort == "amount") {
        sortQuery.amount = -1;
      }
  
      const totalResults = await ProductsModel.countDocuments(query);
      const totalPages = Math.ceil(totalResults / limit);
  
      const products = await ProductsModel.find(query)
        .sort(sortQuery)
        .skip(offset)
        .limit(limit);
  
      res.status(200).json({
        page,
        totalPages,
        totalResults,
        products,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  });


//post product

router.post("/",auth, async (req, res) => {
    const newProduct = new ProductsModel(req.body)
    if (req.user.isAdmin) {
        
        try {
            const savedProduct= await newProduct.save();
            res.status(201).json(savedProduct)
        } catch (error) {
         res.status(500).json(error)
        }
    } else {
        res.status(500).json({message:"you are not the admin!"})

    }
});
  

//update product

router.put("/find/:id",auth, async (req, res) => {
   try {
       const product = await ProductsModel.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
       res.status(201).json(product)
   } catch (error) {
       console.log(error)
    res.status(500).json(error)
   }
});
  

//delete product

router.delete("/find/:id",auth, async (req, res) => {
   try {
        await ProductsModel.findByIdAndDelete(req.params.id)
       res.status(201).json('deleted')
   } catch (error) {
    res.status(500).json(error)
   }
});
  

//get one product

router.get("/find/:id", async (req, res) => {
   try {
      const product = await ProductsModel.findById(req.params.id)
       res.status(200).json(product)
   } catch (error) {
    res.status(500).json(error)
  }
});







export {router as productRouter}