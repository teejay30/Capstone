require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

// express app
const app = express();

// middleware
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});

// routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// Connect to DB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB"); // For Debug
        // listen for request
        const port = process.env.PORT || 5000; // Dinagdag ko lang to  di ko kasi ma run
        app.listen(port, () => {
            console.log("connected to DATABASE & listening on port",port);   
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error:",error);
    });
