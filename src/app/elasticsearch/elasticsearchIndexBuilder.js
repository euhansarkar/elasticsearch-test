import { Client } from "@elastic/elasticsearch";

class ElasticsearchIndexBuilder {
  constructor(esNode, indexName, mappings) {
    this.client = new Client({ node: esNode });
    this.indexName = indexName;
    this.defaultMappings = mappings;
  }

  async indexExists() {
    const { body } = await this.client.indices.exists({
      index: this.indexName,
    });
    return body;
  }

  async createIndex() {
    if (!(await this.indexExists())) {
      await this.client.indices.create({
        index: this.indexName,
        body: { mappings: { properties: this.defaultMappings } },
      });
      console.log(`Index '${this.indexName}' created with dynamic mappings.`);
    } else {
      console.log(`Index '${this.indexName}' already exists.`);
    }
  }

  async addDocument(document) {
    await this.client.index({
      index: this.indexName,
      id: document._id,
      body: document,
    });
  }

  async updateDocument(document) {
    await this.client.update({
      index: this.indexName,
      id: document._id,
      body: {
        doc: document,
      },
    });
  }

  async deleteDocument(id) {
    await this.client.delete({
      index: this.indexName,
      id,
    });
  }

  async bulkIndexExistingData(data) {
    const bulkPayload = data.flatMap((item) => [
      { index: { _index: this.indexName, _id: item._id.toString() } },
      item,
    ]);

    const { body: bulkResponse } = await this.client.bulk({
      refresh: true,
      body: bulkPayload,
    });

    if (bulkResponse.errors) {
      const erroredDocuments = bulkResponse.items.filter(
        (item) => item.index && item.index.error
      );
      console.error("Errors occurred while indexing:", erroredDocuments);
    } else {
      console.log("All documents indexed successfully.");
    }
  }

  async ping() {
    try {
      await this.client.ping();
      console.log("Elasticsearch connected");
    } catch (error) {
      console.error("Elasticsearch unavailable", error);
    }
  }
}

export default ElasticsearchIndexBuilder;
