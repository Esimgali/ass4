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
            const iconURL = "https://openweathermap.org/img/wn/" + weatherdata.weather[0].icon + "@2x.png";
            weatherdata.iconUrl = "https://openweathermap.org/img/wn/" + weatherdata.weather[0].icon + "@2x.png"
            res.send(weatherdata)
        })   
    })
});

app.get('/getCurrency', async (req, res) => {
    const currency = req.query.currency
    let currencyData
    let url = `https://api.polygon.io/v2/aggs/ticker/C:${currency[0]}${currency[1]}/range/1/day/2023-01-09/2023-01-09?apiKey=HlL4pyh_lBQAqqxf87GC5gh25weDw0hQ`
    https.get(url, async function (response) {
        response.on("data", function (data) {
            currencyData = JSON.parse(data);
            console.log(currencyData);
            if (currencyData.queryCount === 0) {
                res.send("Currency not found. Please try again.");
                return;
            }
            let r = `<div class="d-flex">
                        <div class="w-50">${currency[0]} : 1</div>
                        <div class="w-50">${currency[1]} : ${currencyData.results[0].h}</div>
                    </div>`
            res.send(r)
        });
    })

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});