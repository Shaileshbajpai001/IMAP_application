// backend/elastic/indexEmails.js

const elasticClient = require('../utils/elastic');

async function indexEmailToElastic(email) {
  try {
    await elasticClient.index({
      index: 'emails',
      id: email._id.toString(), // Use MongoDB ID as document ID
      document: {
        subject: email.subject,
        from: email.from,
        to: email.to,
        text: email.text,
        date: email.date,
        account: email.account,
      },
    });

    console.log(` NICEEE Indexed email: ${email.subject}`);
  } catch (err) {
    console.error('❌ Elasticsearch index error:', err);
  }
}

module.exports = indexEmailToElastic;
