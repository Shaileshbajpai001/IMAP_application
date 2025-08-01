// backend/imap/imapClient.js

const { ImapFlow } = require("imapflow");
const dotenv = require("dotenv");
const { simpleParser } = require("mailparser");

const Email = require("../models/emailModel");
const get30DaysAgo = require("../utils/date");
const indexEmail = require("../elastic/indexEmails");
const { categorizeEmail } = require("../utils/ai");
const { notifyInterested } = require("../utils/notifier");

dotenv.config();

const accounts = [
  {
    user: process.env.IMAP_EMAIL_1,
    pass: process.env.IMAP_PASS_1,
    label: "Account 1",
  },
  {
    user: process.env.IMAP_EMAIL_2,
    pass: process.env.IMAP_PASS_2,
    label: "Account 2",
  },
];

async function handleNewEmail(client, msg, label) {
  const exists = await Email.findOne({ messageId: msg.envelope.messageId });
  if (exists) return;

  const parsed = await simpleParser(msg.source);
  const emailText = parsed.text?.trim() || "⚠️ No text extracted";

  // Save basic email info first
  const saved = await Email.create({
    messageId: msg.envelope.messageId,
    from: msg.envelope.from?.[0]?.address || "",
    to: msg.envelope.to?.map(t => t.address) || [],
    subject: msg.envelope.subject || "(No Subject)",
    date: msg.envelope.date,
    text: emailText,
    account: label,
    category: "Uncategorized", // default in case AI fails
  });

  console.log(`📩 Saved: ${saved.subject}`);
  await indexEmail(saved);

  // Try categorizing using Gemini AI
  try {
    const aiCategory = await categorizeEmail(emailText);
    saved.category = aiCategory || "Uncategorized";

    // Suggest reply only if email is Interested or Meeting Booked
    if (saved.category === "Interested" || saved.category === "Meeting Booked") {
      const { suggestReply } = require("../utils/ai");
      const reply = await suggestReply(emailText);
      saved.suggestedReply = reply || "";
    }

    await saved.save();

    if (saved.category === "Interested") {
      await notifyInterested(saved);
    }
  } catch (err) {
    console.error("❌ AI categorization or reply failed:", err.message);
    // Don't crash, email is still saved with default values
  }
}

async function startIMAPSync() {
  for (const acc of accounts) {
    if (!acc.user || !acc.pass) {
      console.warn(`⚠️ Missing credentials for ${acc.label}`);
      continue;
    }

    const client = new ImapFlow({
      host: "imap.gmail.com",
      port: 993,
      secure: true,
      auth: {
        user: acc.user,
        pass: acc.pass,
      },
      logger: false,
    });

    try {
      await client.connect();
      console.log(`✅ Connected to ${acc.label}`);

      await client.mailboxOpen("INBOX");
      const since = get30DaysAgo();

      for await (const msg of client.fetch({ since }, { envelope: true, source: true })) {
        await handleNewEmail(client, msg, acc.label);
      }

      // Real-time email listener
      client.on("exists", async () => {
        const lock = await client.getMailboxLock("INBOX");
        try {
          const msg = await client.fetchOne(client.mailbox.exists, {
            envelope: true,
            source: true,
          });
          await handleNewEmail(client, msg, acc.label);
        } finally {
          lock.release();
        }
      });
    } catch (err) {
      console.error(`❌ IMAP error (${acc.label}):`, err);
    }
  }
}

module.exports = { startIMAPSync };
