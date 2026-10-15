const express =  require('express')
const mongoose =  require('mongoose')
const cors = require('cors')
const path = require('path')

 const userRoutes =  require('./routes/user-routes')
 const storeRoutes = require('./routes/store-routes')
 const storeProductsRoutes = require('./routes/storeProducts-routes')
 const cartRoutes = require('./routes/cart-routes')

const app =  express()


app.use(express.json())
// قبلاً: app.use(cors())  ← هر سایتی می‌تونست به بک‌اند وصل شه
// حالا: فقط آدرس فرانتِ خودمون (که از متغیر محیطی میاد) اجازه داره.
// اگه متغیر FRONTEND_URL تنظیم نشده بود (مثلاً رو کامپیوتر خودت)، همه رو قبول می‌کنه
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))

// دسترسی عمومی به فایل‌های آپلودشده (عکس پروفایل و غیره)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))



app.use('/api' , userRoutes)
app.use('/api', storeRoutes)
app.use('/api', storeProductsRoutes)
app.use('/api', cartRoutes)



// آدرس دیتابیس: رو سرور از متغیر محیطی MONGO_URI میاد
// رو کامپیوتر  چون متغیر نداریم، همون دیتابیس لوکال قبلی استفاده می‌شه
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/manafGrocery'

// پورت: سرورهای میزبانی خودشون پورت رو تعیین می‌کنن و از process.env.PORT می‌دن
// رو کامپیوتر و همون ۸۰۰۰ می‌مونه
const PORT = process.env.PORT || 8000

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT);
  })
  .catch((err) => {
    console.log("MongoDB connection error: ", err);
  });
