import mongoose from "mongoose";
import "dotenv/config";

const DdConnection = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(`The data base is connected`);
    })
    .catch(() => {
      console.log(`Error occured while connecting`);
    });
};

export { DdConnection };
