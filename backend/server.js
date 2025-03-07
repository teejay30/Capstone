require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 5000;
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

// routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// Connect to DB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        // listen for request
        app.listen(process.env.PORT, () => {
            console.log(
                "connected to DATABASE & listening on port",
                process.env.PORT
            );
        });
    })
    .catch((error) => {
        console.log(error);
    });
