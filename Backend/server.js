const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authroutes');
const spRoutes = require('./routes/spRoutes');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const { billUpload } = require("./controller/billController");

const port = 3000;

const app = express();
app.use(express.json());


app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}));

app.use(cookieParser());





const storage = multer.diskStorage({
    destination: "./bills",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), billUpload);

connectDB().then(() => {
    console.log("Database connected successfully");
})

app.get('/', (req, res) => {
    return res.status(200).json({ message: "Working" });
})
app.use('/auth', authRoutes);
app.use('/sp', spRoutes);

app.listen(port, () => {
    console.log(`server is running on ${port}`);
});


