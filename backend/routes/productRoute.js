const express = require("express");
const authenticate = require("../middleWare/authMiddleware");
const {
    createProduct,
    getAllProducts,
    getProduct,
    deleteProduct,
    editProduct} = require("../controllers/productControllers")


const router = express.Router();

router.post("/", authenticate, createProduct);
router.get("/", authenticate, getAllProducts);
router.get("/:id", authenticate, getProduct)
router.delete("/:id", authenticate, deleteProduct)
router.patch("/:id", authenticate, editProduct)


module.exports = router