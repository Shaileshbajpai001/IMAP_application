const { Client } = require('@elastic/elasticsearch');

require('dotenv').config();

const elasticClient = new Client({
  node: 'http://localhost:9200',
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  },
  headers: {
    'accept': 'application/vnd.elasticsearch+json; compatible-with=8',
    'content-type': 'application/vnd.elasticsearch+json; compatible-with=8'
  }
});

module.exports = elasticClient;
