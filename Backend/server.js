const express=require('express');
const connectDB=require('./config/db');

const port=3000;

const app=express();
app.use(express.json());

connectDB().then(()=>{
    console.log("Database connected successfully");
}).
catch(()=>{
     console.log("Database connectionn failed");
});


app.listen(port,()=>{
    console.log(`server is running on ${port}`);
});
                

