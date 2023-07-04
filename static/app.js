function openPopUp(pop)
{
    document.getElementById('pop').style.display="block";
    document.getElementById("Testo").focus();
}

document.getElementById("close").onclick = function(e)
{
    document.getElementById('pop').style.display="none";
}

function sendMessage(){
    document.getElementById("Testo").focus();
    // Inserisco il testo dentro una variabile
    let testo = document.getElementById("Testo").value;

    // Creo un elemento html, aggiungo dentro il testo, aggiungo le classi e stampo l'elemnto dentro il contenitore
    let newElement = document.createElement('div');
    newElement.innerText = testo;
    newElement.classList.add("message", "messageFrom");
    document.getElementById("chatContent").appendChild(newElement); //inserisce il "figlio"(newElement) all'interno della "madre"(chat)

    // svuoto il campo di testo
    let value = document.getElementById("Testo").value;
    console.log("value", value);
    document.getElementById("Testo").value="";
    
    //Chiama una funzione che restituisce un messaggio di attesa
    setTimeout(
        function() {
            console.log("run");
            loadingMessage();
           }, 500);
    //Chiamare una nuova funzione da creare che restituisce un messaggio dopo 2 secondi che andrà in messageTo
    //Chiama il backend e manda gli la domanda(question) e restituisce una risposta (es: fake answer)
    setTimeout(
        function() {
            console.log("run");
            data = JSON.stringify({'question': value})
            console.log("data", data)
            $.ajax({
                url: 'http://localhost:4242/answer-question',
                type: 'POST',
                data: data,
                contentType: "application/json; charset=utf-8",
                success: function(response) {
                    console.log(response)
                    let newElement = document.createElement('div');
                    newElement.innerText = response.answer;
                    newElement.classList.add("message", "messageTo");
                    document.getElementById("chatContent").appendChild(newElement),
                scrollToEnd(); 
                },
                error: function(error) {
                    console.log(error);
                }
            });
            document.getElementById("loading").remove();
           }, 2000);
           scrollToEnd()
}

function receiveMessage()
{
    let newElement2 = document.createElement('div');
    newElement2.innerText = "Ciao!";
    newElement2.classList.add("message", "messageTo");
    document.getElementById("chatContent").appendChild(newElement2);
    scrollToEnd()
}
function loadingMessage()
{
    let newElement3 = document.createElement('div');
    newElement3.innerText = "...";
    newElement3.classList.add("message", "messageLoading");
    newElement3.setAttribute("id","loading");
    document.getElementById("chatContent").appendChild(newElement3);
    scrollToEnd()
}
function scrollToEnd(){
	let chatList = document.getElementById("chatContent");
	chatList.scrollTop = chatList.scrollHeight;
}

document.getElementById("Testo")
    .addEventListener("keyup", function(e) {
        if (e.keyCode === 13) {
            document.getElementById("submit").click();
        }
    });