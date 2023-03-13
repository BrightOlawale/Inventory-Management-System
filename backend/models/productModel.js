const mongoose = require("mongoose");


const productSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user"
        },
        productName: {
            type: String,
            required: [true, "Please add product name"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Please add a description"],
            trim: true
        },
        price: {
            type: String,
            required: [true, "Please add a price"],
            trim: true
        },
        sku: {
            type: String,
            default: "SKU number",
            required: true,
            trim: true
        },
        quantity: {
            type: String,
            required: [true, "Please add quantity of product"],
            trim: true
        }
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model("product", productSchema);
module.exports = Product;