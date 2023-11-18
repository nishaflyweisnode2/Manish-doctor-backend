const express = require("express")
const http = require("http")
const NotFound = require("./Middlewares/notfound")
const serverless = require("serverless-http");
const db = require("./db");
const helmet = require("helmet");
const app = express()
const Grid = require("gridfs-stream")
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connection = require("./db")
const xss = require("xss-clean")
const path = require("path")
const rateLimiter = require("express-rate-limit")
const asyncRapper = require("./Middlewares/asyncRapper")
const logger = require("./Middlewares/loggers")
app.use(express())
dotenv.config();
const { StatusCodes } = require("http-status-codes")
app.use(logger)

connection();
const conn = mongoose.connection;
conn.once('open', () => {
    gfs = Grid(conn, mongoose.mongo);
    gfs.collection("uploads");
})

//Route declaration goes here
const userRouter = require('./Routes/userRouter');
const addaboutRouter = require('./Routes/aboutme');
const adminRouter = require('./Routes/adminRouter');
const categoryRouter = require('./Routes/categoryRouter');
const subcategoryRouter = require('./Routes/subcategoryRouter');
const productRouter = require('./Routes/productRouter');
const testimonyRouter = require('./Routes/testimonyRouter');
const specialistRouter = require('./Routes/specialistRouter');
const productcatRouter = require('./Routes/productcategoryRouter');
const subproductcatRouter = require('./Routes/subproductcategoryRouter');
const productsellRouter = require('./Routes/productsellRouter');
const doctorRouter = require('./Routes/doctorRouter');
const healthCatgoryRouter = require('./Routes/healthCategoryRouter');
const healthtestRouter = require('./Routes/heathtestRouter');
const preferenceRouter = require('./Routes/preferenceRouter');
const bookingRouter = require('./Routes/bookingRouter');
const contactRouter = require('./Routes/contactRouter');
const supportRouter = require('./Routes/supportRouters');
const faqRouter = require('./Routes/faqRouter');
const faqcontentRouter = require('./Routes/faqcontentRouter');
const cartRoute = require('./Routes/cartRoute');
const hospitalRoute = require('./Routes/hospitalRoute');
const paymentRoute = require('./Routes/paymentRoute');
const couponRoute = require('./Routes/couponRoute');
const appointmentRoute = require('./Routes/appointmentRoute');
const chatRoute = require('./Routes/chatRoute');









app.set('trust proxy', 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
app.use(xss())



//Router declaration goes here

app.use('/api/user', userRouter);
app.use('/api/addabout', addaboutRouter);
app.use('/api/admin', adminRouter);
app.use('/api/category', categoryRouter);
app.use('/api/subcategory', subcategoryRouter);
app.use('/api/product', productRouter);
app.use('/api/testimony', testimonyRouter);
app.use('/api/specialist', specialistRouter);
app.use('/api/productcat', productcatRouter);
app.use('/api/subproductcat', subproductcatRouter);
app.use('/api/sellproduct', productsellRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/healthcategory', healthCatgoryRouter);
app.use('/api/healthtest', healthtestRouter);
app.use('/api/preference', preferenceRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/contact', contactRouter);
app.use('/api/support', supportRouter);
app.use('/api/faq', faqRouter);
app.use('/api/faqcontent', faqcontentRouter);
app.use('/api/cart', cartRoute);
app.use('/api/hospital', hospitalRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/coupon', couponRoute);
app.use('/api/appointment', appointmentRoute);
app.use('/api/chat', chatRoute);




app.use('/uploads', express.static('uploads'))
app.use(express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || 8082;
app.get("/", (req, res) => {
    res.status(StatusCodes.OK).send("Dr-Manish-Backend")
})




app.use(NotFound)
const server = http.createServer(app)
const start = asyncRapper(async () => {
    server.listen(port, () => {
        console.log(`We are running on port ${port}`);
    })
})
start();

module.exports = { handler: serverless(app) };
