function no_filter(button) {
    let id = button.id;
    callAjax(id, (response)=>{
        let arr = JSON.parse(response)
        for(let el of arr){
            let cur_tile  =document.getElementById(el)
            cur_tile.style.display = 'block'
        }
    });
}

function in_stock(button) {
    let id = button.id;
    callAjax(id, (response) => {
        let arr = JSON.parse(response);
        for(let el of arr) {
            let cur_tile = document.getElementById(el);
            cur_tile.style.display = 'none';
        }
    });

}
function overdue(button) {
    let id = button.id;
    callAjax(id, (response)=>{
        let arr = JSON.parse(response);
        for(let el of arr) {
            let cur_tile = document.getElementById(el);
            cur_tile.style.display = 'none';
        }
    })
}

function  callAjax(id, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200)
            callback(this.responseText);
    };
    xhttp.open("GET",`/library/${id}`,true);
    xhttp.send();
}