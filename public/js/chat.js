const socket = io("http://localhost:3000")
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

    socket.on("message", ({ message, user }) => {
      addMessage({ message, user });
    })
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
  if (event.target && event.target.matches("li.user_name_list")) {
    const idUser = event.target.getAttribute("idUser");
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
