var map = L.map('map').setView([51.1801, 71.446], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);


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