require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const enquiryRoutes = require("./routes/enquiry");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve frontend files
app.use(express.static(__dirname));

// API Routes
app.use("/api", enquiryRoutes);

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});