const express = require('express');
const https = require("https")
const bodyParser = require('body-parser');
const { log } = require('console');
const app = express()
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const path = require('path');
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/getWeather', (req, res) => {
    const city = req.query.city
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=043755d1ce9013f2d7862bad8bc14e92&units=metric"
    https.get(url, function(response){
        response.on("data", function (data) { 
            const weatherdata = JSON.parse(data); 
            console.log(weatherdata);
            if (weatherdata.cod === "404") { 
                res.send("City not found. Please try again."); 
                return; 
            }
            // const temp = weatherdata.main.temp
            // const feels = weatherdata.main.feels_like
            const iconURL = "https://openweathermap.org/img/wn/" + weatherdata.weather[0].icon + "@2x.png";
            // const desc = weatherdata.weather[0].description
            // res.write("<h1>Temperature </h1>" + temp)
            // res.write("<h1>Feels like </h1>" + feels)
            // res.write("<h1>Icon</h1><img src='" + iconURL + "'>")
            // res.write("<h1>The weather is </h1>" + desc)
            // res.write("<h1>Humidity</h1>" + weatherdata.main.humidity)
            // res.write("<h1>Pressure </h1>" + weatherdata.main.pressure)
            // res.write("<h1>Country code</h1>" + weatherdata.sys.country)
            weatherdata.iconUrl = "https://openweathermap.org/img/wn/" + weatherdata.weather[0].icon + "@2x.png"
            res.send(weatherdata)
        })   
    })
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});