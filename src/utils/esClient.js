// elasticsearchClient.js
import { Client } from "@elastic/elasticsearch";

// Create an Elasticsearch client instance
const esClient = new Client({
  node: "http://localhost:9200", // Adjust based on your Elasticsearch setup
});

export default esClient;
