import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/index.js";

async function main() {
  await mongoose.connect(config?.database_url);
  console.log("Connected to MongoDB");
  app?.listen(config?.port, () => {
    console.log(`Server running at port ${config?.port}`);
  });
}
main();