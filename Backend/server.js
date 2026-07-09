require('dotenv').config();

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

const fileFilter = (req, file, cb) => {
    // Allow both JPEG and PNG files
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG and PNG images are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        const isLocalOrigin = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
        if (isLocalOrigin) {
            return callback(null, true);
        }

        return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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


