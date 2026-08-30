// برای ستاره دار کردن رمز عبور از bcrypt استفاده می‌کنیم وبه این صورت کار میکند که رمز عبور را هش می‌کند و در دیتابیس ذخیره می‌کند. هنگام ورود کاربر، رمز عبور وارد شده با رمز عبور هش شده مقایسه می‌شود تا صحت آن بررسی شود.
const bcrypt = require('bcrypt');
// برای ستاره دار کردن رمز عبور از bcrypt استفاده می‌کنیم وبه این صورت کار میکند که رمز عبور را هش می‌کند و در دیتابیس ذخیره می‌کند. هنگام ورود کاربر، رمز عبور وارد شده با رمز عبور هش شده مقایسه می‌شود تا صحت آن بررسی شود.

const User = require('../models/users');


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
};