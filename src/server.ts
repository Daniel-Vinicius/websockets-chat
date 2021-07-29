import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;

const app = express();
const server = createServer(app);

app.use(express.static(path.join(__dirname, "..", "public")));

const io = new Server(server);

io.on("connection", (socket) => {
  console.log(socket.id)
})

app.get("/", (request, response) => {
  return response.json({
    message: "Hello World - Websocket"
  })
})

server.listen(PORT, () => console.log(`Server is running on port ${PORT} 🚀`));
