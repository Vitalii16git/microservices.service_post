import { messages } from "./utils/error.messages";
import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import cors from "cors";
import logger from "./utils/logger";
import router from "./routes/post.route";

const app: Application = express();
const PORT = process.env.PORT || 5055;

app.use(express.json());
app.use(cors());
app.use("/post", router);

app.use("*", (_req, res) => {
  res.status(404).json({ message: messages.notFound });
});

app.listen(PORT, () => {
  logger.info(`Service is running on port ${PORT}`);
});
