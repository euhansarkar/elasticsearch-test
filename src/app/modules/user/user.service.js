import QueryBuilder from "../../../utils/queryBuilder.js";
import ElasticsearchIndexBuilder from "../../elasticsearch/elasticsearchIndexBuilder.js";
import { UserSearchableFields } from "./user.const.js";
import { User } from "./user.model.js";

const userMappings = {
  name: { type: "text" },
  email: { type: "text" },
  city: { type: "text" },
};

const esUserBuilder = new ElasticsearchIndexBuilder(
  "http://localhost:9200",
  "users",
  userMappings
);

(async () => {
  await esUserBuilder.ping();
})();


const sanitizeDocument = (doc) => {
  const sanitizedDoc = doc.toObject();
  delete sanitizedDoc._id; 
  delete sanitizedDoc.__v; 
  return sanitizedDoc;
};

const createOne = async (payload) => {
  const result = await User.create(payload);
  await esUserBuilder.addDocument({
    index: "users",
    id: result._id.toString(), 
    body: sanitizeDocument(result),
  });
  return result;
};



const createAll = async (payloads) => {
  const result = await User.insertMany(payloads);
  await esUserBuilder.bulkIndexExistingData(result);
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


const getOne = async (id) => {
  const result = await User.findById(id);
  return result;
};


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

const deleteOne = async (id) => {
  const result = await User.findByIdAndDelete(id);
  if (result) {
    await esUserBuilder.deleteDocument(id);
  }
  return result;
};


const indexUnindexedUsers = async (batchSize = 50) => {
  let hasMoreUnindexed = true;
  let totalIndexed = 0;

  while (hasMoreUnindexed) {
    // Fetch a batch of unindexed users
    const unindexedUsers = await User.find({ isIndexed: false }).limit(
      batchSize
    );

    if (unindexedUsers.length === 0) {
      hasMoreUnindexed = false;
      console.log("No more unindexed users.");
      break;
    }

    // Index the batch in Elasticsearch
    await esUserBuilder.bulkIndexExistingData(unindexedUsers);

    // Update MongoDB records to set `isIndexed` to true
    await User.updateMany(
      { _id: { $in: unindexedUsers.map((user) => user._id) } },
      { isIndexed: true }
    );

    // Update total count of indexed users
    totalIndexed += unindexedUsers.length;
    console.log(
      `Indexed batch of ${unindexedUsers.length} users. Total indexed so far: ${totalIndexed}`
    );
  }

  return { message: `Indexed ${totalIndexed} users.` };
};

export const UserServices = {
  createOne,
  createAll,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  searching,
  indexUnindexedUsers,
};
