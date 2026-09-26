// برای محصولات فروشنده 

const Product = require('../models/products');

// همه ی محصولات 
const getAllProducts  =  async (req , res) =>  {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.status(200).json(products);

    } catch (error) {
        console.log("Error getting products:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
// همه ی محصولات 



// GET همه‌ی محصولات یک فروشنده
const getProductsBySeller = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const products = await Product.find({ sellerId }).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.log("Error getting products:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// افزودن محصول جدید
const addProduct = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const { tag, name, price, discountPrice, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "عکس محصول الزامی است" });
        }

        const imageUrl = `/uploads/product-images/${req.file.filename}`;

        const newProduct = new Product({
            sellerId,
            tag,
            name,
            price: Number(price),
            discountPrice: discountPrice ? Number(discountPrice) : undefined,
            description,
            imageUrl,
        });

        await newProduct.save();

        res.status(201).json({ message: "محصول با موفقیت اضافه شد", product: newProduct });

    } catch (error) {
        console.log("Error adding product:", error);
        res.status(500).json({ message: "خطایی رخ داد، لطفاً دوباره تلاش کنید" });
    }
};

// ویرایش محصول
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { tag, name, price, discountPrice, description } = req.body;

        const updateData = {
            tag,
            name,
            price: Number(price),
            discountPrice: discountPrice ? Number(discountPrice) : undefined,
            description,
        };

        // فقط اگر عکس جدیدی ارسال شده باشد، جایگزین عکس قبلی می‌شود
        if (req.file) {
            updateData.imageUrl = `/uploads/product-images/${req.file.filename}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "محصول یافت نشد" });
        }

        res.status(200).json({ message: "محصول با موفقیت ویرایش شد", product: updatedProduct });

    } catch (error) {
        console.log("Error updating product:", error);
        res.status(500).json({ message: "خطایی رخ داد، لطفاً دوباره تلاش کنید" });
    }
};

// حذف محصول
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        await Product.findByIdAndDelete(productId);
        res.status(200).json({ message: "محصول با موفقیت حذف شد" });
    } catch (error) {
        console.log("Error deleting product:", error);
        res.status(500).json({ message: "خطایی رخ داد، لطفاً دوباره تلاش کنید" });
    }
};

module.exports = { getAllProducts, getProductsBySeller, addProduct, updateProduct, deleteProduct };