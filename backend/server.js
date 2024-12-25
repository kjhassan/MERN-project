import express from "express";
import dotenv from "dotenv";

import authroutes from "./routes/auth.route.js";

dotenv.config();  //so gurll this for loading the environment variables from.env file

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World! so just checking ');     //root route basically the hoe page 
});

app.use("/api/auth",authroutes)


app.listen(PORT, () => 
  console.log('Server running on port', PORT));