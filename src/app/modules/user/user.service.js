import QueryBuilder from "../../../utils/queryBuilder.js";
import { UserSearchableFields } from "./user.const.js";
import { User } from "./user.model.js";


const createOne = async (payload) => {
  const result = await User.create(payload);
  return result;
};

const createAll = async (payloads) => {
  const result = await User.insertMany(payloads);
  return result;
};


const searching = async (query) => {
  const results = await User.search({
  query_string: {
    query
    }    
  });

  return results;
}

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
  return result;
};

const deleteOne = async (id) => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

export const UserServices = {
  createOne,
  createAll,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  searching,
};
