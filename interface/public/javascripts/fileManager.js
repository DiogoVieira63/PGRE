
function showFile(name, type,id){
    console.log("Inside showFile");
    if (type == "image/png" || type == "image/jpeg")
        var file = $(`<img src='/fileStore/${name}' width='400px'>`);
    else 
        var file = $(`<p>${name},${type}</p>`);
    var download = $(`<div><a href='/download/${name}' download='${name}'>Download</a></div>`)
    var open = $(`<div><a href='/files/${id}'>Open Page</a></div>`)
   
    $("#display").empty();
    $("#display").append(file,download,open);
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
  console.log("Inside dropdown", id);
  var x = document.getElementById(id);
  if (x.className.indexOf("w3-show") == -1) { 
    //x.style.display = "block";
    x.className += " w3-show";
  } 
  else {
    //x.style.display = "none";
    x.className = x.className.replace(" w3-show", "");
  }
}

function openTab(tab,button,isPage) {
  var tabName = isPage ? "PageTab" : "Tab";
  var buttonName = isPage ? "PageButton-Tab" : "Button-Tab";

  console.log("Inside openTab", tab);
  var i;
  var x = document.getElementsByClassName(tabName);
  for(i = 0; i < x.length; i++) {
    x[i].style.display = "none";
    console.log(x[i]);
  }
  var x = document.getElementsByClassName(buttonName);
  for(i = 0; i < x.length; i++){
    x[i].classList.remove("w3-border-red");
    console.log(x[i]);
  }
  document.getElementById(button).classList.add("w3-border-red");

  var elem = document.getElementById(tab);
  elem.style.display = "block";
}


function searchTable(inputId, tableId) {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById(inputId);
  filter = input.value.toUpperCase();
  table = document.getElementById(tableId);
  tr = table.getElementsByTagName("tr");

  var skipNextRow = false; // Flag to skip the row following the filtered row
  var hiddenRows = []; // Array to store the indexes of hidden rows

  for (i = 0; i < tr.length; i++) {
    if (skipNextRow) {
      skipNextRow = false;
      continue;
    }

    td = [tr[i].getElementsByTagName("td")[0], tr[i].getElementsByTagName("td")[1]];
    if (td[0] || td[1]) {
      txtValue = (td[0] ? td[0].textContent || td[0].innerText : '') + (td[1] ? td[1].textContent || td[1].innerText : '');
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        hiddenRows.push(i + 1); // Store the index of the next row to skip
        skipNextRow = true; // Set flag to skip the next row
      } else {
        tr[i].style.display = "none";
      }
    }
  }

  // Restore visibility for previously hidden rows
  hiddenRows.forEach(function(row) {
    if (tr[row]) {
      tr[row].style.display = "";
    }
  });
}

function searchSimpleTable(inputId, tableId) {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById(inputId);
  filter = input.value.toUpperCase();
  table = document.getElementById(tableId);
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) { 
    td = [tr[i].getElementsByTagName("td")[0], tr[i].getElementsByTagName("td")[1]];
    if (td[0] || td[1]) {
      txtValue = (td[0] ? td[0].textContent || td[0].innerText : '') + (td[1] ? td[1].textContent || td[1].innerText : '');
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function openEditModal(id) {
  document.getElementById(id).style.display = "block";
}

function closeEditModal(id) {
  document.getElementById(id).style.display = "none";
}

// Filter table based on selected values
function applyFilters() {
  var visibilidade = $('input[name="visibilidade"]:checked').val();
  var inscrito = $('input[name="inscrito"]:checked').val();

  // Show/hide table rows based on filter values
  $('#listaCursos tr').each(function(index) {
    if (index === 0) return;

    var rowVisibilidade = $(this).find('td:eq(2) i').hasClass('fa-unlock');
    var rowInscrito = $(this).find('td:eq(3) i').hasClass('fa-check');

    if ((visibilidade === 'todos' || (visibilidade === 'publico' && rowVisibilidade) || (visibilidade === 'privado' && !rowVisibilidade)) &&
        (inscrito === 'todos' || (inscrito === 'sim' && rowInscrito) || (inscrito === 'nao' && !rowInscrito))) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}



function applyFiltersMaintainNextRow() {
  var table = document.getElementById("meusCursos");
  var rows = table.getElementsByTagName("tr");

  var visibility = document.querySelector('input[name="visibilidade"]:checked').value;

  var previousRowVisible = true;

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var visibilityCell = row.getElementsByTagName("td")[2];
    var nextRow = row.nextElementSibling;

    if (visibilityCell) {
      var visibilityIcons = visibilityCell.getElementsByTagName("i");
      var isPrivate = visibilityIcons[0].classList.contains("fa-lock");

      if (visibility === "todos" || (visibility === "privado" && isPrivate) || (visibility === "publico" && !isPrivate)) {
        row.style.display = "";
        previousRowVisible = true;
      } else {
        row.style.display = "none";
        previousRowVisible = false;
      }

      if (nextRow) {
        if (previousRowVisible) {
          nextRow.style.display = "";
        } else {
          nextRow.style.display = "none";
        }
      }
    }
  }
}

