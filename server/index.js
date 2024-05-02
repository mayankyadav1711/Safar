const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MONGOURI } = require('./config/keys')

const app = express();
const PORT = process.env.PORT || 5000;

// CORS policy 
app.use(cors({
  origin: [
    "https://safarnamaaa.vercel.app",
    "http://localhost:3000",
  ], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Database connection
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB!");
});
mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
  process.exit(1); // Exit the application on database connection error
});


require("./models/user");
require("./models/post");
require("./models/notification");
require("./models/contact");
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

// Home route
app.get("/", (req, res) => {
  res.json("Welcome to Safarnamaaa");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});