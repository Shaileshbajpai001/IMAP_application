// backend/scripts/reindex.js

// require("dotenv").config();
require("dotenv").config({ path: "backend/.env" });

const mongoose = require("mongoose");
const Email = require("../models/emailModel");
const elasticClient = require("../utils/elastic");

async function reindexEmails() {
  await mongoose.connect(process.env.MONGO_URI);
  const emails = await Email.find();

  for (const email of emails) {
    await elasticClient.index({
      index: "emails",
      id: email._id.toString(),
      document: {
        subject: email.subject,
        body: email.body,
        from: email.from,
        to: email.to,
        category: email.category,
        timestamp: email.timestamp,
      },
    });
    // console.log("✅ Indexed:", email.subject);
  }

  await mongoose.disconnect();
  // console.log(" All emails re-indexed to Elasticsearch");
}

reindexEmails().catch((err) => {
  console.error("❌ Error reindexing:", err);
  process.exit(1);
});
