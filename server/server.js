const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('db connected...')
}).catch((error)=>{
    console.log(error)
})

app.use("/api", require("./routes/authRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));
