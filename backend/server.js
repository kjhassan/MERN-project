import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authroutes from "./routes/auth.route.js";
import messageroutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import connectdb from "./database/mongodbconnection.js";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();  //so gurll this for loading the environment variables from.env file

app.use(express.json());  //gurll this basically parses the incoming requests from req.body => from the auth.controller file (middleware)
app.use(cookieParser());

app.use("/api/auth",authroutes)
app.use("/api/message",messageroutes)
app.use("/api/user",userRoutes)



app.listen(PORT, () => {

  connectdb();
  console.log('Server running on port', PORT);
  
});
  
// app.get('/', (req, res) => {
//   res.send('Hello World! so just checking ');     //root route basically the hoe page //http://localhost:5000/
// });

