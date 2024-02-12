const express = require('express');
const https = require("https")
const { log } = require('console');
const app = express()
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));
app.use("/log/", express.static(__dirname));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const port = 3000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = "mongodb+srv://Esimgali:eskh110405@cluster0.pe84r7o.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

client.connect();
const db =client.db("Practice7")
const loginDB= db.collection("esimgali")
let succsess = null
let val = ""
let loginSuc = false
let isAdmin = false
let navbar = [{ title: "Main", id: 1, path:"main"}, { title: "Currency", id : 2, path:"currency"}, {title: "Profile", id : 3, path:"profile"}]
let userInfo = null
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'index.ejs'));
// });
app.get('/log', (req, res)=>{
    res.render('login')
})
app.get('/reg', (req, res)=>{
    res.render('reg')
})

    app.get('/log/main', (req, res)=>{
        res.render('main', {isAdmin:isAdmin, loginSuc : loginSuc, navbar: navbar})
    })

    app.get('/log/currency', (req, res)=>{
        res.render('currency', {isAdmin:isAdmin, loginSuc : loginSuc, navbar: navbar})
    })

    app.get('/log/admin', (req, res)=>{
        res.render('adminPage', {isAdmin:isAdmin, loginSuc : loginSuc, navbar: navbar})
    })

    app.get('/log/profile', (req, res)=>{
        res.render('profile', {isAdmin:isAdmin, loginSuc : loginSuc, navbar: navbar, userInfo: userInfo})
    })


app.post("/login", async (req, res) => {
    const login = req.body.login
    const password = req.body.password
    succsess = await loginDB.findOne({login:login, pass:password})
    if(succsess !== null){
        if((succsess !== null || succsess.login !== "") && succsess.deletedAt === null){
            loginSuc = true
            userInfo = succsess
            isAdmin = succsess.isAdmin
            if(isAdmin && !navbar.includes({ title: "Admin page", id: 4, path:"admin"})){
                navbar.push({ title: "Admin page", id: 4, path:"admin"})
            }
            console.log(succsess);
            res.redirect("/log/main")
            return;
        } 
        console.log(succsess);
    }
    res.redirect("/log")
})

app.post("/signUp", async (req, res) => {
    const login = req.body.login
    const password = req.body.password
    const createdAt = new Date()
    const deletedAt = null
    const updatedAt = []
    let isAdmin = false
    let find = await loginDB.findOne({login:login})
    if(find === null){
        const succsess = await loginDB.insertOne({login:login, pass:password, createdAt: createdAt, isAdmin: isAdmin, deletedAt:deletedAt,updatedAt:updatedAt})
        if(succsess){
            if(succsess !== null || succsess.login !== ""){
                loginSuc = true
                isAdmin = succsess.isAdmin
                if(isAdmin && !navbar.includes({ title: "Admin page", id: 4, path:"admin"})){
                    navbar.push({ title: "Admin page", id: 4, path:"admin"})
                }
            res.redirect("/log/main")
            return;
            }
        }
        console.log(succsess);
        res.redirect("/log")
    }else{
        res.send("Этот логин уже используется")
    }
    
})

app.post("/logout", async(reg, res) =>{
    val="login"
    succsess = null
    loginSuc = false
    navbar = [{ title: "Main", id: 1, path:"main"}, { title: "Currency", id : 2, path:"currency"}, {title: "Profile", id : 3, path:"profile"}]
    res.redirect("/log")
})

app.get('/getWeather', (req, res) => {
    const city = req.query.city
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=043755d1ce9013f2d7862bad8bc14e92&units=metric"
    https.get(url, function(response){
        response.on("data", function (data) { 
            const weatherdata = JSON.parse(data); 
            if (weatherdata.cod === "404") { 
                res.send("City not found. Please try again."); 
                return; 
            }
            const iconURL = "https://openweathermap.org/img/wn/" + weatherdata.weather[0].icon + "@2x.png";
            weatherdata.iconUrl = "https://openweathermap.org/img/wn/" + weatherdata.weather[0].icon + "@2x.png"
            db.collection('weather').insertOne(weatherdata)
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

app.get('/getCountriesInfo', (req, res) => {
    const code = req.query.code
    let url = `https://restcountries.com/v3.1/alpha/${code}`
    https.get(url, (response) =>  {
        response.on("data", (data)=> {
            const counrtyData = JSON.parse(data)[0];
            let result = {}
            result.name = counrtyData.name.common
            result.continents = counrtyData.continents[0]
            result.capital = {latlng: counrtyData.capitalInfo.latlng, capitalName: counrtyData.capital[0]}
            result.currencies = counrtyData.currencies
            result.flagUrl = counrtyData.flags.png
            result.timezones = counrtyData.timezones
            result.languages = counrtyData.languages
            result.area = counrtyData.area + " km2"
            console.log(result);
            res.send(result)
        });
    })
});


app.get("/admin/all",async (req, res) => {
    await loginDB.find().toArray().then(r =>{
        res.send(r)
    })
})

app.post("/admin",async (req, res) => {
    console.log(req.body);
    const action = req.body.action
    if(action === "delete"){
        const id = req.body.id
        const find = await loginDB.findOne({_id: new ObjectId(id)})
        if(find){
            if(find.deletedAt === null){
                const result = await loginDB.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { deletedAt: new Date() } }
                );
                console.log(result);
                res.send(result)
            }
        }
    }else if(action === "update"){
        const result = await loginDB.updateOne(
            { _id: new ObjectId(req.body._id) },
            { $set: req.body.params }
        );
        if(result){
            res.send({status : 200, message: "Успешно изменено"})
        }
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});