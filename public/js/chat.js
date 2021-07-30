const socket = io("http://localhost:3000")

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
  })
}

function addUser(user) {
  const HTMLUsers = `<li class="user_name_list" id="user_${user._id}" idUser="${user._id}"> <img class="nav_avatar" src=${user.avatar} /> ${user.name} </li>`;
  
  const usersList = document.getElementById("users_list");
  usersList.innerHTML += HTMLUsers;
}

onLoad();


