const express = require("express");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // Logging every request

console.log("🔥 Server is starting...");

// Initialize Razorpay client
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

app.post("/create_order", async (req, res) => {
    try {   
        console.log("📩 Incoming request to /create_order", req.body);
        
        const { amount, customer_name, customer_email, customer_phone } = req.body;
        
        if (!amount || amount <= 0) {
            console.log("❌ Invalid amount received!", amount);
            return res.status(400).json({ error: "Invalid amount" });
        }

        console.log("💰 Creating order for amount:", amount);
        
        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert INR to paise
            currency: "INR",
            receipt: `${Date.now()}`,
            notes: { customer_name, customer_email, customer_phone },
        });

        console.log("✅ Order created successfully!", order);
        res.json(order);
    } catch (error) {
        console.error("🔥 Error creating order:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Localhost check
app.get("/", (req, res) => {
    console.log("💡 Someone checked if the server is running!");
    res.send("Razorpay API Running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app; // For Vercel
