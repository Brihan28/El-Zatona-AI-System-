require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const fileRoutes = require("./routes/fileRoutes");
app.use("/api/files", fileRoutes);

app.get("/", (req,res)=>{
    res.send("API running");
});

const PORT = 5000;
app.listen(PORT, ()=> console.log("Server running"));