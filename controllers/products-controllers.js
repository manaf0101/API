const User = require('../models/users');



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

        const users = await User.find();

        res.status(200).json(users);

    } catch (error) {

        res.status(500).json({
            message: "Something went wrong"
        });

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

        const newUser = new User({

            userEmail,
            username,
            password,
            userId

        });

        await newUser.save();

        res.status(201).json(newUser);

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
    checkUsername

};