import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import routes from "./route";
import { connectDB } from "./config/db";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

const PORT = process.env.PORT || 5000;

app.get("/health", (_, res) => {
  res.json({ status: "OK", message: "Workflow engine service is healthy" });
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();

export default app;