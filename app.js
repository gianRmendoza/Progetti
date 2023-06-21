function openPopUp(pop)
{
    document.getElementById('pop').style.display="block";
}

document.getElementById("close").onclick = function(e)
{
    document.getElementById('pop').style.display="none";
}

function sendMessage(){
    // Inserisco il testo dentro una variabile
    var testo = document.getElementById("Testo").value;

    // Creo un elemento html, aggiungo dentro il testo, aggiungo le classi e stampo l'elemnto dentro il contenitore
    var newElement = document.createElement('div');
    newElement.innerText = testo;
    newElement.classList.add("message", "messageFrom");
    document.getElementById("chatContent").appendChild(newElement); //inserisce il "figlio"(newElement) all'interno della "madre"(chat)

    // svuoto il campo di testo
    document.getElementById("Testo").value="";

    //Chiama una funzione che restituisce un messaggio di attesa
    loadingMessage()

    //Chiamare una nuova funzione da creare che restituisce un messaggio dopo 2 secondi che andrà in messageTo
    setTimeout(
        function() {
            console.log("run");
            receiveMessage();
           }, 2000);
}

function receiveMessage()
{
    var newElement2 = document.createElement('div');
    newElement2.innerText = "Ciao!";
    newElement2.classList.add("message", "messageTo");
    document.getElementById("chatContent").appendChild(newElement2);
}
function loadingMessage()
{
    var newElement3 = document.createElement('div');
    newElement3.innerText = "...";
    newElement3.classList.add("message", "messageLoading");
    document.getElementById("chatContent").appendChild(newElement3);
}