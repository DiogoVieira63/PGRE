
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


function toggleAccordion(id){
    console.log(id)
    var x = document.getElementById('accordion' + id);
    if (x.classList.contains('w3-hide')) {
      x.classList.remove('w3-hide');
    } else {
      x.classList.add('w3-hide');
    }
}

