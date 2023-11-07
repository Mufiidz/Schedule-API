import mongoose from "mongoose";

const dbUri = `${Bun.env.MONGODB_URI}/${Bun.env.DB_NAME}`;

mongoose
  .connect(dbUri)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((error) => console.log(`Error connected to mongodb (${error.message})`));

declare module "bun" {
  interface Env {
    MONGODB_URI: string;
    DB_NAME: string;
  }
}

export default mongoose;
