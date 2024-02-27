var updateUserId = null
async function login(){
    let password = document.querySelector(".password")
    let login = document.querySelector(".login")
    if(login !== "" && password !== ""){
        await axios.get("/login",{params: {login : login.value, password : password.value}} )
    }
}

async function getAnimeList(category){
    let myAnimeList = document.querySelector("#myAnimeList")
    if(myAnimeList){
        let data = null
        console.log(category);
        await axios.get("/getAnimeTop", {params : {category: category}}).then(res=>{
            data = res.data
        })
        while (myAnimeList.firstChild) {
            myAnimeList.removeChild(myAnimeList.firstChild);
        }
        data.forEach(element => {
            let card = document.createElement("div")
            card.className = "col"
            card.id = element.myanimelist_id
            card.innerHTML = 
            `<div style="" class="card">
            <img style="" src="${element.picture_url}" class="card-img-top" alt="...">
            <div class="card-body">
            <h5 class="card-title"><a href="${element.myanimelist_url}" target="_blank">${element.title}</a></h5>
            <p class="card-text">Score: ${element.score}</p>
            <p class="card-text">Type: ${element.type}</p>
            </div>
            <div class="card-footer">
            <small class="text-muted">${element.aired_on}</small>
            </div>
            </div>
            `
            myAnimeList.appendChild(card)
        });
    }

}
getAnimeList("all")

async function getMangaList(category){
    let myAnimeList = document.querySelector("#myMangaList")
    if(myAnimeList){
        let data = null
        console.log(category);
        await axios.get("/getMangaTop", {params : {category: category}}).then(res=>{
            data = res.data
        })
        while (myAnimeList.firstChild) {
            myAnimeList.removeChild(myAnimeList.firstChild);
        }
        data.forEach(element => {
            let card = document.createElement("div")
            card.className = "col"
            card.id = element.myanimelist_id
            card.innerHTML = 
            `<div style="" class="card">
            <img style="" src="${element.picture_url}" class="card-img-top" alt="...">
            <div class="card-body">
            <h5 class="card-title"><a href="${element.myanimelist_url}" target="_blank">${element.title}</a></h5>
            <p class="card-text">Score: ${element.score}</p>
            <p class="card-text">Type: ${element.type}</p>
            </div>
            <div class="card-footer">
            <small class="text-muted">${element.aired_on}</small>
            </div>
            </div>
            `
            myAnimeList.appendChild(card)
        });
    }

}
getMangaList("all")

async function changeCategory(){
    let currentCategory = document.querySelector("#changeCategory")
    getAnimeList(currentCategory.value)
}

async function changeCategoryManga(){
    let currentCategory = document.querySelector("#changeCategoryManga")
    getMangaList(currentCategory.value)
}

function showUsers(data) {
    if (data) {
        let table = document.querySelector(".tableUsers")
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
        table.style.border = "1px solid #000"
        var tr = document.createElement('tr');
        Object.keys(data[0]).map(key => {
            var td = document.createElement('td');
            td.innerText = key
            td.style.border = "1px solid #000"
            tr.appendChild(td)
        })
        var tbdy = document.createElement('tbody');
        tbdy.appendChild(tr);
        for (let user of data) {
            var tr = document.createElement('tr');
            Object.keys(user).map((key, id) => {
                var td = document.createElement('td');
                td.innerText = user[key]
                td.style.border = "1px solid #000"
                td.style.padding = "3px"
                tr.appendChild(td)
            })
            //_________________delete user______________________
            var td = document.createElement('button');
            td.innerText = "Delete"
            td.id = user["_id"]
            td.addEventListener("click", () => {
                let item = document.getElementById(`${user["_id"]}`)
                deleteUser(item.id)
            })
            td.style.border = "1px solid #000"
            td.style.padding = "3px"
            tr.appendChild(td)
            //__________________update user__________________
            var tu = document.createElement('button');
            tu.innerText = "Update";
            tu.id = user["_id"]
            tu.addEventListener("click", () => {
                updateUser(user["_id"]);
            });
            tu.style.border = "1px solid #000";
            tu.style.padding = "3px";
            tr.appendChild(tu);

            tbdy.appendChild(tr);
        }
        table.appendChild(tbdy);
    }
}

async function changeLang() {
    let lang = document.querySelector("#changeLang").value
    console.log(lang);
    await axios.get("/changeLang",{params:{lang: lang}}).then(res =>{
        if(res.data){
            window.location.reload()
        }
    })
    // window.location.reload();
}

function showHistory(data) {
    if (data) {
        let table = document.querySelector(".tableUsers")
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
        table.style.border = "1px solid #000"
        var tr = document.createElement('tr');
        let td = document.createElement('td');
        td.innerText = "HistoryId"
        td.style.border = "1px solid #000"
        Object.keys(data[0]).map(key => {
            let td = document.createElement('td');
            td.innerText = key
            td.style.border = "1px solid #000"
            tr.appendChild(td)
        })
        var tbdy = document.createElement('tbody');
        tbdy.appendChild(tr);
        for (let history of data) {
            var tr = document.createElement('tr');
            Object.keys(history).map((key, id) => {
                if(key === "user"){
                    let td1 = document.createElement('td');
                    td1.innerText = history[key] ? history[key]["_id"] : undefined
                    td1.style.border = "1px solid #000"
                    td1.style.padding = "3px"
                    tr.appendChild(td1)
                    let td2 = document.createElement('td');
                    td2.innerText = history[key] ? history[key].login : undefined
                    td2.style.border = "1px solid #000"
                    td2.style.padding = "3px"
                    tr.appendChild(td2)
                }else{
                    var td = document.createElement('td');
                    td.innerText = history[key]
                    td.style.border = "1px solid #000"
                    td.style.padding = "3px"
                    tr.appendChild(td)
                }
                
            })
            tbdy.appendChild(tr);
        }
        table.appendChild(tbdy);
    }
}

async function getHistory() {
    let data
    try {
        await axios.get("/admin/history").then(response => {

        data = response.data
    })
        .catch(error => {
            console.error('Ошибка:', error);    
        });
        showHistory(data)
    }
    catch (error) {
        console.error("Произошла ошибка при отправке запроса", error);
    }
}

async function getData() {
    let data
    try {
        await axios.get("/admin/allUsers").then(response => {

        data = response.data
    })
        .catch(error => {
            console.error('Ошибка:', error);    
        });
        showUsers(data)
    }
    catch (error) {
        console.error("Произошла ошибка при отправке запроса", error);
    }
}

async function deleteUser(id) {
    try {
        await axios.post("/admin", { "action": "delete", "id": id }).then(response => {
            data = response.data
            console.log(response.data);
        })
            .catch(error => {
                console.error('Ошибка:', error);
            });
        if (data.status == 200) {
            alert(data.message + " " + id)
            getData()
        }
    }
    catch (error) {
        console.error("Произошла ошибка при отправке запроса", error);
    }
}

async function updateUser(id){
    updateUserId = id
    let form = document.querySelector('.update')
    form.style.display = "inline"
}
async function updateUserById(){
    let login = document.querySelector('.login').value
    let password = document.querySelector('.password').value
    let isAdmin = document.querySelector('.isAdmin').value
    let form = document.querySelector('.update')
    params = {}
    if(login !== null && login.length > 0){
        params.login = login
    }
    if(password !== null && password.length > 0){
        params.pass = password
    }
    if(isAdmin !== null && isAdmin.length > 0){
        params.isAdmin = isAdmin
    }
    if(params.login || params.pass || params.isAdmin ){
        let req = {action : "update", params : params,_id : updateUserId}
        await axios.post("/admin", req).then(response => {
            data = response.data
            console.log(response.data);
        })
            .catch(error => {
                console.error('Ошибка:', error);
            });
        if (data.status == 200) {
            alert(data.message + " " + updateUserId)
        }
        getData()
    }
    updateUserId = null
    form.style.display = "none"
}
async function updateUserByIdInProfile(){
    let login = document.querySelector('.login').value
    let password = document.querySelector('.password').value
    let form = document.querySelector('.update')
    params = {}
    if(login !== null && login.length > 0){
        params.login = login
    }
    if(password !== null && password.length > 0){
        params.pass = password
    }
    if(params.login || params.pass ){
        let req = {action : "update", params : params,_id : updateUserId}
        await axios.post("/admin", req).then(response => {
            data = response.data
            console.log(response.data);
        })
            .catch(error => {
                console.error('Ошибка:', error);
            });
        if (data.status == 200) {
            alert(data.message + " " + updateUserId)
        }
        getData()
    }
    updateUserId = null
    form.style.display = "none"
}