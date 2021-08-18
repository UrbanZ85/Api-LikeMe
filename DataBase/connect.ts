import mongoose from "mongoose";
import config from "../util/config.json";

function connect() {
  const dbUri = config.mongoDb.MONGO_PATH;

  return mongoose
    .connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log("db error", error);
      process.exit(1);
    });
}

export default connect;