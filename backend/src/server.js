import express from "express";
import path from "path";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import {functions,inngest} from "./config/inngest.js";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

const __dirname=path.resolve(); // __dirname is an absolute path. and path.resolve() will give us the absolute path of the current directory
app.use(express.json());
app.use(clerkMiddleware());//add auth object under the req = > req.auth

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/api/health", (req, res) => {
  res.status(200).json({message:"success"});
});

//make our app ready for deployement
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist"))) //in this line i am using middleware and middlware ? Browser -> Request ->Server(Middlewsre) -> Response -> Browser and express static is a middleware that will serve the static files from the dist folder and path.join is used to join the path of the current directory with the path of the dist folder and index.html file

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"))
  });
}

const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`Server is running on por${ENV.PORT}`);
  });
};
startServer();

