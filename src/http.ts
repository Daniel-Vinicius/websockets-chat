import "reflect-metadata";
import "dotenv/config";
import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

const app = express();
const server = createServer(app);

mongoose.connect(`${process.env.MONGO_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log(`Mongo is Running. URL: ${process.env.MONGO_URL}`));

app.use(express.static(path.join(__dirname, "..", "public")));

const io = new Server(server);

export { server, io }
