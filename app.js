const express =  require('express')
const mongoose =  require('mongoose')
const cors = require('cors')
const path = require('path')

 const productRoutes =  require('./routes/product-routes')
 const storeRoutes = require('./routes/store-routes')

const app =  express()


app.use(express.json())
app.use(cors())

// دسترسی عمومی به فایل‌های آپلودشده (عکس پروفایل و غیره)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))



app.use('/api' , productRoutes)
app.use('/api', storeRoutes)



mongoose  
.connect('mongodb://127.0.0.1:27017/manafGrocery')  
.then(() => {  
    console.log("Connected to MongoDB");  
    app.listen(8000);  
})  
.catch((err) => {  
    console.log("MongoDB connection error: ", err);  
});
