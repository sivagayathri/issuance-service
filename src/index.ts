import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import  {redis}  from "./clients/redisClient.js";
import issuanceRoutes from "./routes/issuanceRoutes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", issuanceRoutes);

const PORT = Number(process.env.PORT || 3000);
const server = app.listen(PORT, () => console.log(`Issuance service listening ${PORT}`));


process.on("SIGINT", async () => {
  console.log("shutting down issuance...");
  server.close();
  redis.disconnect();
  process.exit(0);
});
