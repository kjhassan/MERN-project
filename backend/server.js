import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";

import connectToMongoDB from "./database/mongodbconnection.js";
import { app, server } from "./socket/socket.js";

dotenv.config();
const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);

app.use(express.static(path.join(__dirname, "frontend","dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});





// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import authroutes from "./routes/auth.route.js";
// import messageroutes from "./routes/message.route.js";
// import userRoutes from "./routes/user.route.js";
// import connectdb from "./database/mongodbconnection.js";

// const app = express();
// const PORT = process.env.PORT || 5000;

// dotenv.config();  //so gurll this for loading the environment variables from.env file

// app.use(express.json());  //gurll this basically parses the incoming requests from req.body => from the auth.controller file (middleware)
// app.use(cookieParser());

// app.use("/api/auth",authroutes)
// app.use("/api/message",messageroutes)
// app.use("/api/user",userRoutes)



// app.listen(PORT, () => {

//   connectdb();
//   console.log('Server running on port', PORT);
  
// });
  
// app.get('/', (req, res) => {
//   res.send('Hello World! so just checking ');     //root route basically the hoe page //http://localhost:5000/
// });

