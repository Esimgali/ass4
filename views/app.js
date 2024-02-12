
var map = L.map('map').setView([51.1801, 71.446], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
var updateUserId = null

async function login(){
    let password = document.querySelector(".password")
    let login = document.querySelector(".login")
    let data
    if(login !== "" && password !== ""){
        await axios.get("http://localhost:3000/login",{params: {login : login.value, password : password.value}} )
    }
}

async function getWeather(){
        let data
        let cityName = document.querySelector(".cityName")
        if(cityName.value.length > 1){
            await axios.get("http://localhost:3000/getWeather", {params: {city : cityName.value}}).then(response =>{
                data = response.data
            })
            let weatherData = document.querySelector(".weatherData")
            weatherData.style.display = "inline"
            while (weatherData.firstChild) {
                    weatherData.removeChild(weatherData.firstChild);
            }
            if(typeof data === "string"){
                let error = document.createElement("div")
                error.style.color = "red"
                error.innerText = data
                weatherData.appendChild(error)
            }else{
                let icon = document.createElement("img")
                icon.src = data.iconUrl
                weatherData.appendChild(icon)
                let weather = document.createElement("p")
                weather.innerText = `
                Temperature : ${data.main.temp}°C
                
                Feels like : ${data.main.feels_like}°C

                The weather is : ${data.weather[0].description}

                Humidity : ${data.main.humidity}%

                Country code : ${data.sys.country}

                Pressure : ${data.main.pressure}

                Wind speed : ${data.wind.speed} metre/sec
                `
                weatherData.appendChild(weather)
                console.log(data.coord.lat, data.coord.lon);
                map.setView([data.coord.lat, data.coord.lon], 10);    
            }
        }
    getCountriesInfo(data.sys.country)
    // console.log( new Date().toJSON().slice(0, 10));
}

async function getCountriesInfo(code) {
    let data
    await axios.get("http://localhost:3000/getCountriesInfo", {params: {code: code}}).then((res)=>{
        data = res.data
        console.log(data);
    })
    let countriesInfo = document.querySelector(".countriesInfo")
    while (countriesInfo.firstChild) {
        countriesInfo.removeChild(countriesInfo.firstChild);
    }
    let flag = document.createElement("img")
    flag.src = data.flagUrl
    let languages = ""
    Object.keys(data.languages).map(key =>{
        languages += data.languages[key] + " "
    })
    
    let country = document.createElement("p")
    const currencies = Object.keys(data.currencies)[0]
    country.innerHTML = `
    <div style="width: 790px;display: grid; grid-template-columns:repeat(3, 1fr); grid-gap: 10px;">
                    <div style="display: grid; grid-template-rows: repeat(3, 0.5fr);">
                        <img style="width:auto ;  height: 50px;" src="${data.flagUrl}"/>
                        <div>Country name : ${data.name}</div>
                        <div>Continents : ${data.continents}</div>
                    </div>
                    <div style="display: grid; grid-template-rows: repeat(3, 0.5fr);">
                        <div>Area : ${data.area}</div>
                        <div>Timezones : ${data.timezones}</div>
                        <div>
                            Capital : ${data.capital.capitalName}
                            <p>Coordinates : lat: ${data.capital.latlng[0]}; lng: ${data.capital.latlng[1]}</p>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-rows: repeat(3, 0.5fr);">
                        <div>Languages : ${languages}</div>
                        <div>
                            Currency : ${data.currencies[currencies].name} ( ${currencies} )
                            <p>Symbol : ${data.currencies[currencies].symbol}</p>
                        </div>
                    </div>
                </div>
    `
    countriesInfo.appendChild(country)
}

async function getCurrency(){
    let currencyName1 = document.querySelector(".currencyName1")
    let currencyName2 = document.querySelector(".currencyName2")
    if(currencyName1.value.length > 1 && currencyName2.value.length > 1){
        let data;
        await axios.get("http://localhost:3000/getCurrency", {params: {currency : [currencyName1.value, currencyName2.value]}}).then(response =>{
            data = response.data
            console.log(data);
            let currencyData = document.querySelector(".currencyData")
            currencyData.innerHTML = data
        })
    }
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

async function getData() {
    let data
    try {
        await axios.get("http://localhost:3000/admin/all").then(response => {

        data = response.data
        console.log(response);
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
        await axios.post("http://localhost:3000/admin", { "action": "delete", "id": id }).then(response => {
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
        await axios.post("http://localhost:3000/admin", req).then(response => {
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