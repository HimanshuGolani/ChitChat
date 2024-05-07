import express from "express";
import cors from "cors";
import { DdConnection } from "./MongoDb/Connection.js";
import UserRouter from "./routes/UserRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/MessageRouter.js";

// initialzed the instance of the app
const app = express();

//middle wears to make the backend and frontend
// access each others data

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;

// starting the instance to listen to the port
app.listen(PORT, () => {
  console.log(`server is running on the port ${PORT} `);
});

// using routing
// route for the User Login / Signup
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);
// error handeling middlewares
// workis to handel if the url is incorrect or error occure
app.use(notFound);
app.use(errorHandler);

// connecting to the mongoDb
DdConnection();
