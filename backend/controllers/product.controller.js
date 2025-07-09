import Product from "../models/product.models.js";

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        console.log('Fetching all products...');
        const products = await Product.find({});
        console.log(`Found ${products.length} products`);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: "Error fetching the products", error: error.message });
    }
};

// Get single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: "Error fetching the product", error: error.message });
    }
};

// Create new product (Admin only)
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, brand, category, countInStock, image } = req.body;

        // Validate required fields
        if (!name || !description || !price || !brand || !category || countInStock === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const product = new Product({
            name,
            description,
            price,
            brand,
            category,
            countInStock,
            image: image || `https://via.placeholder.com/300x300?text=${encodeURIComponent(name)}`
        });

        const savedProduct = await product.save();
        console.log('Product created:', savedProduct._id);
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, brand, category, countInStock, image } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
        product.image = image || product.image;

        const updatedProduct = await product.save();
        console.log('Product updated:', updatedProduct._id);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
    try {
        console.log('Delete product request for ID:', req.params.id);
        console.log('User making request:', req.user);

        const product = await Product.findById(req.params.id);
        if (!product) {
            console.log('Product not found for ID:', req.params.id);
            return res.status(404).json({ message: "Product not found" });
        }

        console.log('Found product to delete:', product.name);
        await Product.findByIdAndDelete(req.params.id);
        console.log('Product deleted successfully:', req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};

// Default export for backward compatibility
const allProducts = getAllProducts;
export default allProducts;