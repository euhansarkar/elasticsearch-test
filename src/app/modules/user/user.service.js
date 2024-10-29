import QueryBuilder from "../../../utils/queryBuilder.js";
import ElasticsearchIndexBuilder from "../../elasticsearch/elasticsearchIndexBuilder.js";
import { UserSearchableFields } from "./user.const.js";
import { User } from "./user.model.js";

// Define Elasticsearch mappings
const userMappings = {
  name: { type: "text" },
  email: { type: "text" },
  city: { type: "text" },
};

// Initialize ElasticsearchIndexBuilder for the 'users' index
const esUserBuilder = new ElasticsearchIndexBuilder(
  "http://localhost:9200",
  "users",
  userMappings
);

(async () => {
  // Check connection and create index if it doesn't exist
  await esUserBuilder.ping();
})();


const sanitizeDocument = (doc) => {
  const sanitizedDoc = doc.toObject(); // Convert mongoose document to plain object
  delete sanitizedDoc._id; // Remove the _id field
  delete sanitizedDoc.__v; // Remove other metadata fields if necessary
  return sanitizedDoc;
};

// Create one user and index it in Elasticsearch
const createOne = async (payload) => {
  const result = await User.create(payload);
  await esUserBuilder.addDocument({
    index: "users",
    id: result._id.toString(), // Set the document ID explicitly
    body: sanitizeDocument(result), // Sanitize and pass the document body
  });
  return result;
};



// Bulk create users and index them in Elasticsearch
const createAll = async (payloads) => {
  const result = await User.insertMany(payloads);
  await esUserBuilder.bulkIndexExistingData(result); // Bulk indexing of all created users
  return result;
};

// Searching users via Elasticsearch
const searching = async (query) => {
  const results = await esUserBuilder.client.search({
    index: "users",
    body: {
      query: {
        query_string: {
          query,
          fields: UserSearchableFields,
        },
      },
    },
  });
  return results.hits.hits.map((hit) => hit._source);
};

// Get all users with MongoDB query options (pagination, sorting, etc.)
const getAll = async (query) => {
  const resultQuery = new QueryBuilder(User.find(), query)
    .search(UserSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()
    .limit();
  const result = await resultQuery.modelQuery;
  const meta = await resultQuery.countTotal();
  return { data: result, meta };
};

// Get a single user by ID
const getOne = async (id) => {
  const result = await User.findById(id);
  return result;
};

// Update a user in MongoDB and Elasticsearch
const updateOne = async (id, payload) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (result) {
    const sanitizedDoc = sanitizeDocument(result);
    await esUserBuilder.updateDocument(id, sanitizedDoc); 
  }
  return result;
};

// Delete a user from MongoDB and Elasticsearch
const deleteOne = async (id) => {
  const result = await User.findByIdAndDelete(id);
  if (result) {
    await esUserBuilder.deleteDocument(id); // Delete from Elasticsearch
  }
  return result;
};

// Export all services
export const UserServices = {
  createOne,
  createAll,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  searching,
};
