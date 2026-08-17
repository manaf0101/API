
const User = require('../models/users')


//check user email
const checkUserEmail = async (req, res) => {
    try {
        const { userEmail } = req.query;
        
        if (!userEmail) {
            return res.status(400).json({ message: "Email is required" });
        }       
        
        const user = await User.findOne({ userEmail });

        if (user) {
            return res.status(200).json({ exists: true, message: "Email already exists" });
        }

        res.status(200).json({ exists: false, message: "Email is available" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error });
    }
}
//check user email


//get
const getUsers = async (req, res) => {
    try {
        const users = await Products.find();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        });
    }
};
//get





// پست 
const postNewUser = async (req, res) => {  
    const { userName } = req.body;  

    const newUser = new User({  
       userName : userName
    });  

    try {  
        await newUser.save(); // Save the new product to DB  
        res.status(201).json({ message: 'User created-manafgrocery', user: newUser });  
    } catch (error) {  
        res.status(500).json({ message: 'Creating User failed', error });  
    }  
};
// پست 



module.exports = {
    postNewUser,
    checkUserEmail,
    getUsers
};
