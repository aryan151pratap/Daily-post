require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const login = require("./routes/login");
const post = require("./routes/post");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

connectDB();

app.get("/", (req, res) => {
    res.send("CORS enabled");
});

app.use("/", login);
app.use("/", post);

app.listen(3000, () => console.log("Server running on port 3000"));
