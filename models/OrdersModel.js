import mongoose from "mongoose";
const OrdersSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    order: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required:true
    }],
    quantity: [{
        type: Number,
        required:true
    }],
    totalPrice: {
        type: Number,
        required:true
    },
    status: {
        type: String,
        required: true,
        default:"cart"
    }
 
},
    { timestamps: true }
);

export default mongoose.model("Orders", OrdersSchema)