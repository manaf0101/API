// برای ستاره دار کردن رمز عبور از bcrypt استفاده می‌کنیم وبه این صورت کار میکند که رمز عبور را هش می‌کند و در دیتابیس ذخیره می‌کند. هنگام ورود کاربر، رمز عبور وارد شده با رمز عبور هش شده مقایسه می‌شود تا صحت آن بررسی شود.
const bcrypt = require('bcrypt');
// برای ستاره دار کردن رمز عبور از bcrypt استفاده می‌کنیم وبه این صورت کار میکند که رمز عبور را هش می‌کند و در دیتابیس ذخیره می‌کند. هنگام ورود کاربر، رمز عبور وارد شده با رمز عبور هش شده مقایسه می‌شود تا صحت آن بررسی شود.

const User = require('../models/users');
const Order = require('../models/order');

// فقط برای این قسمت ایمپورتش کرده ام : Get Users which they have store
const Store = require('../models/store');
const store = require('../models/store');
const { set } = require('mongoose');
// فقط برای این قسمت ایمپورتش کرده ام : Get Users which they have store





// GET ORDERS SUMMARY (تعداد سفارش‌ها در هر دسته)
const getOrdersSummary = async (req, res) => { 
    try {
        const { userId } = req.params;

        // هر چهار شمارش به‌صورت همزمان (parallel) اجرا می‌شوند
        const [current, delivered, returned, canceled] = await Promise.all([
            Order.countDocuments({ userId, status: 'current' , isCart: {$ne: true } }),
            Order.countDocuments({ userId, status: 'delivered' }),
            Order.countDocuments({ userId, status: 'returned' }),
            Order.countDocuments({ userId, status: 'canceled' }),
        ]);

        res.status(200).json({ current, delivered, returned, canceled });

    } catch (error) {
        console.log("Error getting orders summary:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
// GET ORDERS SUMMARY

// GET DELIVERED ORDERS
const getDeliveredOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({
            userId: userId,
            status: 'delivered'
        }).sort({ orderDate: -1 });

        res.status(200).json(orders);

    } catch (error) {
        console.log("Error getting delivered orders:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
// GET DELIVERED ORDERS


// GET RETURNED ORDERS
const getReturnedOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({
            userId: userId,
            status: 'returned'
        }).sort({ orderDate: -1 });

        res.status(200).json(orders);

    } catch (error) {
        console.log("Error getting returned orders:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
// GET RETURNED ORDERS


// GET CANCELED ORDERS
const getCanceledOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({
            userId: userId,
            status: 'canceled'
        }).sort({ orderDate: -1 });

        res.status(200).json(orders);

    } catch (error) {
        console.log("Error getting canceled orders:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
// GET CANCELED ORDERS


// GET CURRENT ORDERS
const getCurrentOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({
            userId: userId,
            status: 'current' ,
            isCart: { $ne: true } 
        }).sort({ orderDate: -1 });

        res.status(200).json(orders);

    } catch (error) {
        console.log("Error getting current orders:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
// GET CURRENT ORDERS


// UPLOAD PROFILE IMAGE
const uploadProfileImage = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: "هیچ فایلی ارسال نشد" });
        }

        // مسیر نسبی که در دیتابیس ذخیره می‌شود
        const imagePath = `/uploads/profile-images/${req.file.filename}`;

        const updatedUser = await User.findOneAndUpdate(
            { userId: userId },
            { userProfileImage: imagePath },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "عکس با موفقیت آپلود شد",
            userProfileImage: imagePath
        });

    } catch (error) {
        console.log("Error uploading profile image:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
// UPLOAD PROFILE IMAGE

// UPDATE PROFILE
const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const {
            fullName,
            userNationalityCode,
            userPhone,
            userEmail,
            userBirth,
            job,
            refundMethod
        } = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { userId: userId },
            {
                fullName,
                userNationalityCode,
                userPhone,
                userEmail,
                userBirth,
                job,
                refundMethod
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error updating profile:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
// UPDATE PROFILE


// CHECK PASSWORD
const checkPassword = async (req, res) => {
    try {
        const { userId, password } = req.body;

        if (!userId || !password) {
            return res.status(400).json({ message: "userId and password are required" });
        }

        const user = await User.findOne({ userId: userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        res.status(200).json({ valid: isMatch });

    } catch (error) {
        console.log("Error checking password:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
// CHECK PASSWORD


// CHANGE PASSWORD
const changePassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await User.findOneAndUpdate(
            { userId: userId },
            { password: hashedPassword },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.log("Error changing password:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
// CHANGE PASSWORD


//GET PROFILE
 const getProfile = async (req, res) => {
    try {
        const {userId} = req.params; 
        const user = await User.findOne({userId: userId}).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    } 
}
//GET PROFILE


// GET USERNAME
const getUsername = async (req, res) => {

    try {

        const { userId } = req.params;

        const user = await User.findOne({
            userId: userId
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            username: user.username
        });

    } catch (error) {

        console.log("Error getting username:", error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }

};
// GET USERNAME




// CHECK USERNAME
const checkUsername = async (req, res) => {

    try {

        const { username } = req.query;

        if (!username) {

            return res.status(400).json({
                message: "Username is required"
            });

        }

        const user = await User.findOne({
            username: username
        });

        res.status(200).json({

            exists: !!user,

            message: user
                ? "Username already exists"
                : "Username is available"

        });

    } catch (error) {

        console.log("Error checking username:", error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }

};
// CHECK USERNAME



// CHECK EMAIL
const checkUserEmail = async (req, res) => {

    try {

        const { email } = req.query;

        if (!email) {

            return res.status(400).json({
                message: "Email is required"
            });

        }

        const user = await User.findOne({
            userEmail: email
        });

        if (user) {

            return res.status(200).json({
                exists: true,
                message: "Email already exists"
            });

        }

        res.status(200).json({
            exists: false,
            message: "Email is available"
        });

    } catch (error) {

        console.log("Error checking email:", error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }

};
// CHECK EMAIL



// GET USERS
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
// GET USERS

// Get Users which they have store
const getUsersWithStore = async (req, res) => {
    try {
        const [users, stores] = await Promise.all([
            User.find().select('-password'),
            Store.find().sort({ createdAt: 1 }) // قدیمی‌ترین فروشگاه اول
        ]);

        // نگاشت سریع از userId به اطلاعات کاربر، برای جستجوی بدون حلقه‌ی تودرتو
        const userMap = new Map(users.map((user) => [user.userId, user]));

        // چون stores از قبل بر اساس createdAt مرتب شده، خروجی نهایی هم به همان ترتیب خواهد بود
        const sellersWithProfile = stores
            .filter((store) => userMap.has(store.userId))
            .map((store) => ({
                storeId: store._id,
                storeName: store.storeName,
                sellerID: store.sellerID,
                storeCreatedAt: store.createdAt,
                userId: store.userId,
                username: userMap.get(store.userId).username,
                userProfileImage: userMap.get(store.userId).userProfileImage,
            }));

        res.status(200).json(sellersWithProfile);

    } catch (error) {
        console.log("Error getting users with store:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
// Get Users which they have store


// POST USER
const postNewUser = async (req, res) => {

    const {
        userEmail,
        username,
        password,
        userId
    } = req.body;

    try {

        // هش کردن رمز عبور قبل از ذخیره در دیتابیس
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userEmail,
            username,
            password: hashedPassword,
            userId,
        });

        await newUser.save();

        // پسورد هش‌شده نباید در response برگردونده بشه
        const { password: _, ...userWithoutPassword } = newUser.toObject();

        res.status(201).json(userWithoutPassword);

    } catch (error) {

        console.log("Error creating user:", error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }

};
// POST USER


module.exports = {
    postNewUser,
    checkUserEmail,
    getUsers,
    checkUsername,
    getProfile,
    getUsername,
    updateProfile,
    checkPassword,
    changePassword,
    uploadProfileImage ,
    getCurrentOrders , 
    getDeliveredOrders ,
    getReturnedOrders ,
    getCanceledOrders ,
    getOrdersSummary,
    getUsersWithStore ,
};