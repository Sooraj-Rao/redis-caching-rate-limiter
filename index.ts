import express from "express";
import { router as userRouter } from "./src/routers/auth.route";

const app = express();
app.use(express.json());

app.use("/api", userRouter);

app.listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});
