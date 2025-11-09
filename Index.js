const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./models");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/clients", require("./routes/client.routes"));
app.use("/api/revenue", require("./routes/revenue.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));

// DB Connection
db.sequelize
  .sync()
  .then(() => {
    console.log("✅ Database connected successfully!");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => console.log("❌ DB Error:", err));
