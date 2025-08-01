//backend/routes/email.js
const express = require("express");
const router = express.Router();
const Email = require("../models/emailModel");
const elasticClient = require("../utils/elastic");
const { notifyInterested } = require("../utils/notifier");
const { categorizeEmail, suggestReply } = require("../utils/ai"); //  AI utils

//  Get all emails
router.get("/", async (req, res) => {
  try {
    const emails = await Email.find().sort({ date: -1 });
    res.status(200).json(emails);
  } catch (err) {
    console.error("❌ Error fetching emails:", err);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});


//  Search via Elasticsearch
router.get("/search", async (req, res) => {
  const query = req.query.query;
  console.log("Search Query:", query);

  try {
    const result = await elasticClient.search({
      index: "emails",
      query: {
        multi_match: {
          query,
          fields: ["subject", "body", "from", "to"],
        },
      },
    });

    const hits = result.hits.hits.map((hit) => hit._source);
    res.status(200).json(hits);
  } catch (err) {
    console.error("❌ Full Elasticsearch error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      detail: err?.meta?.body || err.message,
    });
  }
});

//  PATCH to update category manually
router.patch("/:id/category", async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ error: "Missing `category` in body" });
  }

  try {
    const email = await Email.findByIdAndUpdate(id, { category }, { new: true });

    if (!email) {
      return res.status(404).json({ error: "Email not found" });
    }

    if (category === "Interested") {
      notifyInterested({
        subject: email.subject,
        from: email.from,
        to: email.to,
        id: email._id,
      });
    }

    res.status(200).json(email);
  } catch (err) {
    console.error(" Category update error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  AI Categorization

router.post("/categorize", async (req, res) => {
  const { id, text } = req.body;
  console.log("📩 Categorize request received:", { id, text });

  if (!id || !text) return res.status(400).json({ error: "Missing id or text" });

  try {
    const predictedCategory = await categorizeEmail(text);
    console.log(" Category predicted:", predictedCategory);

    const updatedEmail = await Email.findByIdAndUpdate(
      id,
      { category: predictedCategory },
      { new: true }
    );

    if (predictedCategory === "Interested") {
      await notifyInterested(updatedEmail);
    }

    res.json({ category: predictedCategory });
  } catch (err) {
    console.error("❌ Categorization failed:", err);
    res.status(500).json({ error: "Failed to categorize email" });
  }
});




//  Suggest reply
router.post("/suggest-reply", async (req, res) => {
  const { id, text } = req.body;
   console.log("SUGGESTED REPLY request received:", { id, text });
  if (!id || !text) return res.status(400).json({ error: "Missing id or text" });

  try {
    const reply = await suggestReply(text); //  use function from utils/ai.js
    res.json({ reply });
  } catch (err) {
    console.error("❌ Reply suggestion failed:", err);
    res.status(500).json({ error: "Failed to suggest reply" });
  }
});

module.exports = router;
