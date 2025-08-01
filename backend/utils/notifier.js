//utils/notifier.js
const axios = require("axios");
require("dotenv").config();

/**
 * Send a Slack message when an "Interested" email is received.
 */
async function sendSlackNotification(email) {
  const { subject, from, to, category, suggestedReply } = email;

  const payload = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `📩 *New Email Notification*`,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Subject:*\n${subject || "(No Subject)"}`,
          },
          {
            type: "mrkdwn",
            text: `*From:*\n${from || "Unknown"}`,
          },
          {
            type: "mrkdwn",
            text: `*To:*\n${Array.isArray(to) ? to.join(", ") : to || "Unknown"}`,
          },
          {
            type: "mrkdwn",
            text: `*Category:*\n${category || "Uncategorized"}`,
          },
        ],
      },
    ],
  };

  if (suggestedReply) {
    payload.blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `💡 *Suggested Reply:*\n>${suggestedReply}`,
      },
    });
  }

  try {
    await axios.post(process.env.SLACK_WEBHOOK_URL, payload);
    console.log("✅ Slack notification sent.");
  } catch (error) {
    console.error("❌ Slack error:", error.message);

    // Optional: retry once after 1 second
    setTimeout(async () => {
      try {
        await axios.post(process.env.SLACK_WEBHOOK_URL, payload);
        console.log("🔁 Slack retry succeeded.");
      } catch (retryErr) {
        console.error("❌ Slack retry failed:", retryErr.message);
      }
    }, 1000);
  }
}

/**
 * Trigger an external automation via webhook (e.g., webhook.site).
 */
async function triggerWebhook(email) {
  const webhookUrl = process.env.CUSTOM_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("⚠️ CUSTOM_WEBHOOK_URL is not set");
    return;
  }

  try {
    await axios.post(webhookUrl, email);
    console.log("✅ Webhook triggered.");
  } catch (error) {
    console.error("❌ Webhook error:", error.message);
  }
}

/**
 * Main notifier used after email is categorized.
 * Only notifies if email category is "interested".
 */
async function notifyInterested(email) {
  const id = email._id || email.id;
  console.log(`📤 Notifying for Email ID: ${id}`);

  if (email.notified) {
    console.log("🔁 Already notified. Skipping.");
    return;
  }

  if (email.category && email.category.toLowerCase() === "interested") {
    await sendSlackNotification(email);
    await triggerWebhook(email);

    // Mark as notified
    email.notified = true;
    await email.save();
  } else {
    console.log("🔕 Notification skipped: Category is not 'interested'");
  }
}

module.exports = { notifyInterested };

