// برای محصولات فروشنده 

const Product = require('../models/products');
const Store = require('../models/store');
const User = require('../models/users');



// SEARCH (ترکیبی: هم‌زمان تو فروشگاه‌ها و تو محصولات)
const searchEverything = async (req, res) => {
    try {
        const { q } = req.query

        if (!q || !q.trim()) {
            return res.status(200).json({ stores: [], products: [] })
        }

        const regex = new RegExp(q.trim(), 'i')

        // جستجوی فروشگاه‌ها: نام غرفه یا نام کاربری
        // sellerID رو هم می‌گیریم چون آدرس صفحه‌ی فروشگاه بر اساس همینه
        const storesPromise = Store.find({
            $or: [{ storeName: regex }, { username: regex }]
        })
            .select('storeName username sellerID')
            .limit(6)

        // جستجوی محصولات: چون Product یه کالکشن جداست (نه آرایه‌ی داخل Store)
        // مستقیم خود کالکشن Product رو بر اساس name فیلتر می‌کنیم
        const productsPromise = Product.find({ name: regex })
            .select('name price discountPrice imageUrl sellerId')
            .limit(8)

        const [stores, rawProducts] = await Promise.all([storesPromise, productsPromise])

        // هر محصول فقط sellerId (یعنی userId فروشنده) رو داره
        // ولی برای لینک به SellerMarket به sellerID خود فروشگاه نیاز داریم
        // پس یه نگاشت از userId فروشنده‌ها به sellerID فروشگاهشون می‌سازیم (یک کوئری اضافه، نه به ازای هر محصول)
        const sellerUserIds = [...new Set(rawProducts.map((p) => p.sellerId))]

        const sellerStores = await Store.find({ userId: { $in: sellerUserIds } })
            .select('userId sellerID')

        const userIdToSellerID = new Map(sellerStores.map((s) => [s.userId, s.sellerID]))

        const products = rawProducts.map((p) => ({
            _id: p._id,
            name: p.name,
            price: p.price,
            discountPrice: p.discountPrice,
            imageUrl: p.imageUrl,
            sellerID: userIdToSellerID.get(p.sellerId) || null,
        }))

        res.status(200).json({ stores, products })

    } catch (error) {
        console.log("Error searching:", error)
        res.status(500).json({ message: "Something went wrong" })
    }
}


// GET SELLER MARKET (پروفایل عمومی یک غرفه + محصولاتش، برای بازدید بقیه کاربران)
// برای کامپوننت SelletMarket.tsx در فرانت
const getSellerMarket = async (req, res) => {
    try {
        const { sellerID } = req.params

        if (!sellerID) {
            return res.status(400).json({ message: "sellerID الزامی است" })
        }

        const store = await Store.findOne({ sellerID })

        if (!store) {
            return res.status(404).json({ message: "فروشگاهی با این کد پیدا نشد" })
        }

        // عکس پروفایل از کالکشن یوزر میاد چون جدا از Store ذخیره شده (دقیقا مثل getUsersWithStore)
        const user = await User.findOne({ userId: store.userId }).select('-password')

        // محصولات فروشنده از Product collection
       const products = await Product.find({ sellerId: store.userId })

        res.status(200).json({
            store: {
                storeName: store.storeName,
                sellerID: store.sellerID,
                username: store.username,
                welcomeMessage: store.welcomeMessage,
                contactInfo: store.contactInfo,
                userProfileImage: user?.userProfileImage || "",
            },
            products: products || [],
        })

    } catch (error) {
        console.log("Error getting seller market:", error)
        res.status(500).json({ message: "خطایی در بازیابی فروشگاه رخ داد" })
    }
}
// GET SELLER MARKET (پروفایل عمومی یک غرفه + محصولاتش، برای بازدید بقیه کاربران)
// برای کامپوننت SelletMarket.tsx در فرانت



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

module.exports = { getAllProducts, getProductsBySeller, addProduct, updateProduct, deleteProduct , getSellerMarket, searchEverything };