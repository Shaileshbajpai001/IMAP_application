const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { startIMAPSync } = require("./imap/imapClient");
const Email = require("./models/emailModel");

dotenv.config();

const app = express();
const emailRoutes = require("./routes/email");

const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅  MongoDB connected");

    console.log("IMAP Module:", require("./imap/imapClient"));

    startIMAPSync(); //  Start IMAP after DB connects
  })
  .catch((err) => {
    console.error("MongoDB error:", err);
  });

app.get("/emails", async (req, res) => {
  try {
    const emails = await Email.find().sort({ date: -1 }).limit(20);
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching emails", error });
  }
});


app.use("/emails", emailRoutes);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
