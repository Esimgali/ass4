var map = L.map('map').setView([51.1801, 71.446], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);


async function getWeather(){
        let cityName = document.querySelector(".cityName")
        if(cityName.value.length > 1){
            let data
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
                console.log(data);
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