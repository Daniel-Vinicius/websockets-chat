import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

const app = express();
const server = createServer(app);

mongoose.connect("mongodb://localhost/rocket-socket", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use(express.static(path.join(__dirname, "..", "public")));

const io = new Server(server);

export { server, io }
