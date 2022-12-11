import dotenv from "dotenv";
import logger from "../logger/logging";
import mongoose from "mongoose";

dotenv.config();

let database: mongoose.Connection;

export const connectMongoDb = () => {
  if (database) {
    return;
  }

  const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: false,
  };

  const MONGO_USERNAME = process.env.MONGO_USERNAME;
  const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
  const MONGO_HOST = process.env.MONGO_URL;

  const MONGO = {
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MONGO_OPTIONS,
    url: `mongodb://${MONGO_HOST}`,
  };

  mongoose.connect(MONGO.url, MONGO_OPTIONS);

  database = mongoose.connection;

  database.once("open", async () => {
    logger.info("Connected to database");
  });

  database.on("error", () => {
    logger.info("Error connecting to database");
  });
};

export const disconnect = () => {
  if (!database) {
    return;
  }

  mongoose.disconnect();

  database.once("close", async () => {
    logger.info("Diconnected  to database");
  });
};

//export default config
