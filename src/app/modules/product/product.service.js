import QueryBuilder from "../../../utils/queryBuilder.js";
import { ProductSearchableFields } from "./product.const.js";
import { Product } from "./product.model.js";


const createOne = async (payload) => {
  const result = await Product.create(payload);
  return result;
};

const indexingAll = async () => {
  const products = await Product.find();
  dude.awesome = true;
  await dude.index();

}

const createAll = async (payloads) => {
  const result = await Product.insertMany(payloads);
  return result;
};


const searching = async (query) => {
  const results = await Product.search({
  query_string: {
    query
    }    
  });

  return results;
}

const getAll = async (query) => {
  const resultQuery = new QueryBuilder(Product.find(), query)
    .search(ProductSearchableFields)
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
  const result = await Product.findById(id);
  return result;
};
const updateOne = async (id, payload) => {
  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteOne = async (id) => {
  const result = await Product.findByIdAndDelete(id);
  return result;
};

export const ProductServices = {
  createOne,
  createAll,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  searching,
};
