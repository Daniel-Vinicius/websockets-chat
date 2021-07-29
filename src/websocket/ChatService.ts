import { io } from "../http";

io.on("connection", (socket) => {
  console.log(socket.id)
})

io.on("connect", (socket) => {
  socket.emit("chat_booted", {
    message: "Your chat was booted"
  })
})

