const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");


const createProduct = asyncHandler(async (req, res) => {
    const {productName, description, price, quantity, sku} = req.body;

    if(!productName || !description || !price || !quantity || !sku){
        res.status(400);
        throw new Error("Please fill all fields");
    }

    const newProduct = await Product.create({
        user: req.user.id,
        productName,
        description,
        price,
        quantity,
        sku
    });

    res.status(201).json(newProduct);
})

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({user: req.user.id}).select("-createdAt");
    if (!products){
        res.status(400)
        throw new Error("Cannot fetch Inventories");
    }
    res.status(200).json(products);
})


const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        res.status(400);
        throw new Error("Cannot fetch Inventory");
    }
    if (req.user.id !== product.user.toString()){
        res.status(400);
        throw new Error("Not authorized....")
    }
    
    res.status(200).json(product);
})


const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product){
        res.status(400);
        throw new Error("Cannot fetch Inventory");
    }
    if (req.user.id !== product.user.toString()){
        res.status(400)
        throw new Error("Not authorized....")
    }

    await product.remove();
    res.status(200).json({
        message: "Product deleted successfully"
    })
})


const editProduct = asyncHandler(async (req, res) => {
    const id = req.params.id
    const {productName, sku, price, description, quantity} = req.body;

    if (!productName || !sku || !price || !description || !quantity){
        res.status(400);
        throw new Error("Please fill all fields");
    }

    const product = await Product.findById(id);

    if (!product){
        res.status(400);
        throw new Error("Cannot fetch Inventory");
    }

    if (req.user.id !== product.user.toString()){
        res.status(400);
        throw new Error("Not authorized....")
    }
    const edited = await Product.findByIdAndUpdate(
        {_id: id},
        {
            productName,
            sku,
            price,
            description,
            quantity
        },
        {
            new: true,
            runValidators: true
        }
        );
    res.status(200).json(edited);
})

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    deleteProduct,
    editProduct
};