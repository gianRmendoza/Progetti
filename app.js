for(var contatore=0;)
var messages = [];



function openPopUp(pop)
{
    document.getElementById('pop').style.display="block";
}

document.getElementById("close").onclick=function(e)
{
    document.getElementById('pop').style.display="none";
}
function sendMessage()
{
    
    var testo = document.getElementById("Testo").value;
    console.log(messages); 
}
