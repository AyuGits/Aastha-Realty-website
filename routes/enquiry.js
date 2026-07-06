const express = require("express");
const router = express.Router();

const db = require("../db");

router.post("/enquiry", (req, res) => {
    const { fullName, email, phone, service, message } = req.body;

    const sql = `
        INSERT INTO enquiries
        (full_name, email, phone, service, message)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [fullName, email, phone, service, message],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Enquiry Submitted Successfully"
            });
        }
    );
});

module.exports = router;