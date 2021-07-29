import express from "express";

const PORT = process.env.PORT || 3000;
const app = express();

app.get("/", (request, response) => {
  return response.json({
    message: "Hello World - Websocket"
  })
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT} 🚀`));
