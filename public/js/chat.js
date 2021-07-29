const socket = io("http://localhost:3000")

socket.on("chat_booted", data => {
  console.log(data)
})
