import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/ai", aiRoutes);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from AI" });
});

app.listen(8080, () => console.log("Server has started on port 8080"));
