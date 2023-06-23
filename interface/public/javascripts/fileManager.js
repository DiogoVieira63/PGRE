
function showFile(name, type){
    console.log("Inside showFile");
    if (type == "image/png" || type == "image/jpeg")
        var file = $(`<img src='/fileStore/${name}' width='400px'>`);
    else 
        var file = $(`<p>${name},${type}</p>`);
    var download = $(`<div><a href='/download/${name}' download='${name}'>Download</a></div>`)
   
    $("#display").empty();
    $("#display").append(file,download);
    $("#display").modal({ showClose: true, keyboard : true });
}



function markAsRead(username,id,porta){

  console.log("ID: ",id)

  //require('dotenv').config({path: '../../.env'})
  console.log(porta)
  var token = document.cookie.split("=")
  var tok = ""
  for(let i = 0; i<token.length; i+=2){
    if(token[i]=="token"){
      tok = token[i+1]
    }
  }
  console.log(tok)
  console.log("Inside markAsRead");
  var x = document.getElementById(id);
  
  if (id[0] == "_"){
    id = id.slice(1,id.lenght)
  }
  
  x.classList.remove('w3-border-red');
  x.classList.add('w3-border-green');
  let url = `http://localhost:${porta}`;
  console.log(`${url}/noticias/${id}`);

  return axios.post(`${url}/noticias/lida`, {username: username, id: id});
}

  

function toggleAccordion(id){
    console.log(id)
    var x = document.getElementById('accordion' + id);
    if (x.classList.contains('w3-hide')) {
      x.classList.remove('w3-hide');
    } else {
      x.classList.add('w3-hide');
    }
}

function dropdown(id) {
  var x = document.getElementById(id);
  if (x.className.indexOf("w3-show") == -1) { 
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}
