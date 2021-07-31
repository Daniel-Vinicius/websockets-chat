const socket = io("http://localhost:3000/")
let idChatRoom = "";

function onLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name')
  const avatar = urlParams.get('avatar')
  const email = urlParams.get('email')

  const HTMLPerfil = `<img class="avatar_user_logged" src=${avatar}/> <strong id="user_logged">${name}</strong>`;

  document.querySelector('.user_logged').innerHTML += HTMLPerfil;

  socket.emit("start", {
    email, name, avatar
  })

  socket.on("new_users", user => {
    const existInDiv = document.getElementById(`user_${user._id}`)

    if (!existInDiv) {
      addUser(user);
    }
  });

  socket.emit("get_users", (users) => {
    users.map(user => {
      if (user.email !== email) {
        addUser(user);
      }
    });
  });

  socket.on("message", ({ message, user }) => {
    if (message.roomId === idChatRoom) {
      addMessage({ message, user });
    }
  });

  socket.on("notification", (data) => {
    if (!idChatRoom || data.roomId !== idChatRoom) {
      const user = document.getElementById(`user_${data.from._id}`);
      user.insertAdjacentHTML("afterbegin", `<div class="notification"></div>`);
      const audio = new Audio("../audio/notification.wav");
      audio.play();
    }
  })
}

function addMessage(data) {
  const { user, message } = data;

  const HTMLMessages = `
    <span class="user_name user_name_date"> <img class="img_user" src=${user.avatar}/>
    <strong>${user.name} &nbsp;</strong> <span>${dayjs(message.created_at).format("DD/MM/YYYY HH:mm")}</span></span>
    <div class="messages">
    <span class="chat_message">${message.text}</span>
    </div>
    `;

  const MessagesList = document.getElementById("message_user");
  MessagesList.innerHTML += HTMLMessages;
}

function addUser(user) {
  const HTMLUsers = `<li class="user_name_list" id="user_${user._id}" idUser="${user._id}"> <img class="nav_avatar" src=${user.avatar} /> ${user.name} </li>`;

  const usersList = document.getElementById("users_list");
  usersList.innerHTML += HTMLUsers;
}

document.getElementById("users_list").addEventListener("click", (event) => {
  const inputMessage = document.getElementById("user_message");
  inputMessage.classList.remove("hidden");

  document.querySelectorAll("li.user_name_list").forEach(item => item.classList.remove("user_in_focus"));
  document.getElementById("message_user").innerHTML = "";
  
  if (event.target && event.target.matches("li.user_name_list")) {
    const idUser = event.target.getAttribute("idUser");
    event.target.classList.add("user_in_focus");

    const notification = document.querySelector(`#user_${idUser} .notification`);
    if (notification) notification.remove();

    socket.emit("start_chat", { idUser }, ({ room, messages }) => {
      idChatRoom = room.idChatRoom;

      messages.forEach(message => {
        const data = { message, user: message.to };
        addMessage(data);
      });
    })
  }
})

document.getElementById("user_message").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const message = event.target.value;
    event.target.value = "";

    if (idChatRoom.trim() && message.trim()) {
      socket.emit("message", { message, idChatRoom });
    }
  }
})

onLoad();
