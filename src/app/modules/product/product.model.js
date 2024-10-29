import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  weight: { type: Number, required: true },
  price: {
    merchant: {
      buyingPrice: { type: Number, required: true },
      sellingPrice: { type: Number, required: true },
    },
    icchaporon: {
      buyingPrice: { type: Number, required: true },
      sellingPrice: { type: Number, required: true },
    },
  },
  discount: {
    type: {
      type: String,
      enum: ["fixed", "percentage"],
      required: true,
    },
    discountPercentage: { type: Number },
    price: {
      merchant: {
        buyingPrice: { type: Number, required: true },
        sellingPrice: { type: Number, required: true },
      },
      icchaporon: {
        buyingPrice: { type: Number, required: true },
        sellingPrice: { type: Number, required: true },
      },
    },
  },
  quantity: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  images: [
    {
      url: { type: String, required: true },
      isDeleted: { type: Boolean, default: false },
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
  delivery: {
    isCalculateByWeight: { type: Boolean, default: false },
    insideDhaka: [{ type: Number }],
    outsideDhaka: [{ type: Number }],
    single: {
      insideDhaka: { type: Number },
      outsideDhaka: { type: Number },
      _id: mongoose.Schema.Types.ObjectId,
    },
  },
  features: { type: Map, of: String },
  isFragile: { type: Boolean, default: false },
  promotions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Promotion" }],
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
  isActive: { type: Boolean, default: true },
  badge: { type: String },
  variantType: { type: String, default: "default" },
  variants: [{ type: mongoose.Schema.Types.Mixed }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  order: { type: Number, default: 0 },
  orderLimit: { type: Number, default: 1 },
  shopPosition: { type: Number, default: 0 },
});


export const Product = mongoose.model("Product", ProductSchema);

