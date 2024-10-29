import mongoose from "mongoose";
import { Schema } from "mongoose";


const UserSchema = new Schema({
  name: String,
  email: String,
  city: String,
});


export const User = mongoose.model("User", UserSchema);
