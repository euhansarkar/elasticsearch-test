import mongoose from "mongoose";
import mongoosastic from "mongoosastic";
import { Schema } from "mongoose";


const UserSchema = new Schema({
  name: String,
  email: String,
  city: String,
});

UserSchema.plugin(mongoosastic);

export const User = mongoose.model("User", UserSchema);
