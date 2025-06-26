const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authroutes')

const port = 3000;

const app = express();
app.use(express.json());

connectDB().then(() => {
    console.log("Database connected successfully");
})

app.get('/', (req, res) => {
    return res.status(200).json({ message: "Working" });
})
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`server is running on ${port}`);
});


