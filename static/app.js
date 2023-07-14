function openPopUp(pop) {
  document.getElementById("pop").style.display = "block";
  document.getElementById("Testo").focus();
  scrollToEnd();
}

document.getElementById("close").onclick = function (e) {
  document.getElementById("pop").style.display = "none";
};

window.onload = function () {
  $.ajax({
    url: "http://localhost:4242/saved-chat",
    type: "GET",
    //contentType: "application/json; charset=utf-8",
    success: function (response) {
      //destrutturazione di response
      const { answers_list, questions_list } = response;
      const messages = [...answers_list, ...questions_list];
      messages.sort((a, b) => {
        const { message: mA, date: dA } = a;
        const { message: mB, date: dB } = b;
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA > dateB) return 1;
        if (dateA < dateB) return -1;
        return 0;
      });
      for (const m of messages) {
        const { message, type } = m;
        let newElement = document.createElement("div");
        newElement.innerText = message;
        if (type === "question") {
          newElement.classList.add("message", "messageFrom");
        } else {
          newElement.classList.add("message", "messageTo");
        }
        document.getElementById("chatContent").appendChild(newElement);
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

function sendMessage() {
  document.getElementById("Testo").focus();
  // Inserisco il testo dentro una variabile
  let testo = document.getElementById("Testo").value;
  //localStorage.setItem("text", testo);

  // const date = new Date();
  // date.toISOString();

  // Creo un elemento html, aggiungo dentro il testo, aggiungo le classi e stampo l'elemnto dentro il contenitore
  let newElement = document.createElement("div");
  newElement.innerText = testo;
  newElement.classList.add("message", "messageFrom");
  document.getElementById("chatContent").appendChild(newElement); //inserisce il "figlio"(newElement) all'interno della "madre"(chat)

  //sound effect all'invio del messaggio
  const sendAudio = document.querySelector("#sendedMessage");
  sendAudio.volume = 0.3;
  sendAudio.play();

  // svuoto il campo di testo
  let value = document.getElementById("Testo").value;
  console.log("value", value);
  document.getElementById("Testo").value = "";

  //Chiama una funzione che restituisce un messaggio di attesa
  const loadingAudio = document.querySelector("#loadingMessage");
  setTimeout(function () {
    console.log("run");
    loadingMessage();
    
    loadingAudio.volume = 0.3;
    loadingAudio.play();
  }, 500);
  //Chiamare una nuova funzione da creare che restituisce un messaggio dopo 2 secondi che andrà in messageTo
  //Chiama il backend e manda gli la domanda(question) e restituisce una risposta (es: fake answer)
  setTimeout(function () {
    console.log("run");
    const data = {
      question: value
    };
    console.log("data", data);
    $.ajax({
      url: "http://localhost:4242/answer-question",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function (response) {
        console.log(response);
        let newElement = document.createElement("div");
        newElement.innerText = response.answer;
        newElement.classList.add("message", "messageTo");
        document.getElementById("chatContent").appendChild(newElement);
        const receiveAudio = document.querySelector("#receivedMessage");
        receiveAudio.volume = 0.3;
        receiveAudio.play();
          scrollToEnd();
      },
      error: function (error) {
        console.log(error);
      },
    });
    document.getElementById("loading").remove();
    loadingAudio.pause();
  }, 4000);
  scrollToEnd();
}

function receiveMessage() {
  let newElement2 = document.createElement("div");
  newElement2.innerText = "Ciao!";
  newElement2.classList.add("message", "messageTo");
  document.getElementById("chatContent").appendChild(newElement2);
  scrollToEnd();
}
function loadingMessage() {
  let newElement3 = document.createElement("div");
  newElement3.innerText = "...";
  newElement3.classList.add("message", "messageLoading");
  newElement3.setAttribute("id", "loading");
  document.getElementById("chatContent").appendChild(newElement3);
  scrollToEnd();
}
//la barra di scorrimento(scroll bar) rimane sempre giù
function scrollToEnd() {
  let chatList = document.getElementById("chatContent");
  chatList.scrollTop = chatList.scrollHeight;
}
//attiva il tasto invio della tastiera per inviare il messaggio
document.getElementById("Testo").addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    document.getElementById("submit").click();
  }
});

//LOGIN
function login(){
    const user = document.getElementById("user").value;
    const pass = document.getElementById("password").value;
    
    const userData = {        
        id:(Math.random() + 1).toString(36).substring(5),
        user:user.trim(),
        password:pass.trim()
      };
      console.log("userData", userData);
      fetch("http://localhost:4242/user-login",{
        body:JSON.stringify(userData),
        "Content-Type":"application/json; charset=utf-8",
        method:"POST"
      }).then(response =>response.json()).then(()=>{
        // window.location.replace('/login.html');
        // const pass_incorrect = document.getElementById("incorrect_pass").value;
        // pass_incorrect.classList.remove("hidden");
        if(user != "" && pass != "")
        {
          window.location.replace('/chatbot.html');
        }
        // console.log(response)
        }).catch(function (error) {
        console.log(error);
      })
}

function logout(){
  window.location.replace('/login.html');
}

// const ciao = "ciao";
// const gian = "Gian";
// const hello = `${ciao} ${gian}`;
