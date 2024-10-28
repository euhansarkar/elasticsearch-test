// app.ts
import express, { json, urlencoded } from "express";
import cors from "cors";
import router from "./app/routes/index.js";

const app = express();

app.use(cors());

// parser
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
