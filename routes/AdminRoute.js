// Import necessary modules
import express from 'express';
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


// Create a router instance
const router = express.Router();

// Admin Login Endpoint
router.post('/adminlogin', (req, res) => {
    const { email, password } = req.body;

    // Query to get user by email
    const sql = "SELECT * FROM admin WHERE email=?";
    con.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Query error:", err);
            return res.status(500).json({ loginStatus: false, error: "Query error" });
        }

        if (results.length === 0) {
            return res.json({ loginStatus: false, error: "Wrong email or password" });
        }

        const user = results[0];

        // Verify password
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error("Password comparison error:", err);
                return res.status(500).json({ loginStatus: false, error: "Server error" });
            }

            if (match) {
                const token = jwt.sign({ role: "admin", email: user.email }, "jwt_secret_key", { expiresIn: '1d' });
                res.cookie('token', token, { httpOnly: true, secure: true }); // Adjust options as needed
                return res.json({ loginStatus: true });
            } else {
                return res.json({ loginStatus: false, error: "Wrong email or password" });
            }
        });
    });
});

// Book Tickets Endpoint
router.post('/booktickets', (req, res) => {
    const { name, departure, arrival, departuredate, returndate, passenger, tripType, categories } = req.body;

    const sql = "INSERT INTO TICKETS (name, departure, arrival, departuredate, returndate, passenger, tripType, categories) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [name, departure, arrival, departuredate, returndate, passenger, tripType, categories];

    // Insert ticket into the database
    con.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting ticket:", err);
            return res.status(500).json({ status: false, error: "Error inserting ticket" });
        }
        return res.json({ status: true, message: "Ticket inserted successfully",name:name,departure:departure,arrival:arrival,departuredate:departuredate,returndate:returndate,passenger:passenger,tripTye:tripType,categories:categories });
    });
});

// Fetch Booked Tickets Endpoint
router.get('/getbookedtickets', (req, res) => {
    const sql = "SELECT * FROM TICKETS";
    con.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching booked tickets:", err);
            return res.status(500).json({ status: false, error: "Error fetching booked tickets" });
        }
        return res.json(results);
    });
});

// Export the router
export { router as adminRouter };
