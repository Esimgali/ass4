const express = require('express');
const https = require("https")
const app = express()
const path = require('path');
const bcrypt = require("bcrypt")
const saltRounds = 10

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));
app.use("/log/", express.static(__dirname));
app.use(express.urlencoded({extended: true}));

app.use(express.json());

var i18n = require('i18n');

let appLocale = 'ru';

i18n.configure({
    locales:['en', "ru"],
    directory: __dirname + '/locales',

    defaultLocale: 'en',
    cookie: 'lang',

});
app.use(i18n.init)
app.get("/changeLang", async (req, res)=>{
    console.log(appLocale)
    appLocale = req.query.lang;
    console.log("REQ =============", req.query.lang)
    i18n.setLocale(req.query.lang);
    console.log("After setLocalee",req.query.lang);
    console.log("I!*N: ", i18n.getLocale())
    res.send(appLocale)
})


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
const db =client.db("assignment")
const loginDB= db.collection("esimgali")
const history = db.collection("history")

let succsess = null
let val = ""
let loginSuc = false
let isAdmin = false
let navbar = [{ title: "Anime", id: 1, path:"main"}, { title: "Manga", id : 2, path:"manga"}, {title: "Profile", id : 3, path:"profile"}]
let userInfo = null
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'index.ejs'));
// });
app.get('/log', (req, res)=>{
    res.render('login', {appLocale})
})
app.get('/reg', (req, res)=>{
    res.render('reg', {appLocale})
})

    app.get('/log/main', (req, res)=>{
        res.render('main', {isAdmin:isAdmin, loginSuc : loginSuc, navbar: navbar, categories: ["airing", "upcoming", "tv", "movie", "ova", "ona", "special", "bypopularity", "favorite"]})
    })

    app.get('/log/manga', (req, res)=>{
        res.render('manga', {isAdmin:isAdmin, loginSuc : loginSuc, navbar: navbar, categories: ["manga" , "oneshots", "doujin", "lightnovels", "novels", "manhwa", "manhua", "bypopylarity", "fovorite"]})
    })

    app.get('/log/admin', (req, res)=>{
        res.render('adminPage', {isAdmin:isAdmin, loginSuc : loginSuc, navbar: navbar})
    })

    app.get('/log/profile', (req, res)=>{
        res.render('profile', {isAdmin:isAdmin, loginSuc : loginSuc, navbar: navbar, userInfo: userInfo})
    })

app.get("/img1",(req, res)=>{
    res.sendFile('./img1.png')
} )

app.post("/login", async (req, res) => {
    const login = req.body.login
    const password = req.body.password
    succsess = await loginDB.findOne({login:login})
    await bcrypt
        .compare(password, succsess.pass)
        .then(res => {
                console.log(res);
            if(!res){
                succsess = null
            }
        })
        .catch(err => console.error(err.message))        
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
    let password = null
    await bcrypt
        .hash(req.body.password, saltRounds)
        .then(hash => {
            console.log('Hash ', hash)
            password = hash
        })
        .catch(err => console.error(err.message))
    const name = req.body.name
    const surname = req.body.surname
    console.log("Hashed password",password);
    const createdAt = new Date()
    const deletedAt = null
    const updatedAt = []
    let isAdmin = false
    let find = await loginDB.findOne({login:login})
    if(find === null){
        const succsess = await loginDB.insertOne({name: name,surname: surname, login:login, pass:password, createdAt: createdAt, isAdmin: isAdmin, deletedAt:deletedAt,updatedAt:updatedAt})
        // if(succsess){
        //     if(succsess !== null || succsess.login !== ""){
        //         loginSuc = true
        //         isAdmin = succsess.isAdmin
        //         if(isAdmin && !navbar.includes({ title: "Admin page", id: 4, path:"admin"})){
        //             navbar.push({ title: "Admin page", id: 4, path:"admin"})
        //         }
        //     res.redirect("/log/main")
        //     return;
        //     }
        // }
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
    navbar = [{ title: "Anime", id: 1, path:"main"}, { title: "Manga", id : 2, path:"manga"}, {title: "Profile", id : 3, path:"profile"}]
    res.redirect("/log")
})
app.get('/getAnimeTop', async (req, res) => {
    let category = req.query.category
    const options = {
        method: 'GET',
        hostname: 'myanimelist.p.rapidapi.com',
        port: null,
        path: `/anime/top/${category}`,
        headers: {
            'X-RapidAPI-Key': '447022e1f1msh648146fbd8a23d8p1bb3a1jsn1de0581de845',
            'X-RapidAPI-Host': 'myanimelist.p.rapidapi.com'
        }
    };
    
    let request = https.request(options, function (response) {
        const chunks = [];
    
        response.on('data', function (chunk) {
            chunks.push(chunk);
        });
    
        response.on('end', function () {
            const body = Buffer.concat(chunks);
            animeList = body.toString()
            history.insertOne({user: userInfo, date: new Date(), action: "get Anime top list", category: category})
            res.send(body.toString())
        });
    });
    request.end()
});

app.get('/getMangaTop', async (req, res) => {
    let category = req.query.category
    const options = {
        method: 'GET',
        hostname: 'myanimelist.p.rapidapi.com',
        port: null,
        path: `/manga/top/${category}`,
        headers: {
            'X-RapidAPI-Key': '447022e1f1msh648146fbd8a23d8p1bb3a1jsn1de0581de845',
            'X-RapidAPI-Host': 'myanimelist.p.rapidapi.com'
        }
    };
    
    let request = https.request(options, function (response) {
        const chunks = [];
    
        response.on('data', function (chunk) {
            chunks.push(chunk);
        });
    
        response.on('end', function () {
            const body = Buffer.concat(chunks);
            animeList = body.toString()
            history.insertOne({user: userInfo, date: new Date(), action: "get Manga top list", category: category})
            res.send(body.toString())
        });
    });
    request.end()
});


app.get("/admin/allUsers",async (req, res) => {
    await loginDB.find().toArray().then(r =>{
        res.send(r)
    })
})

app.get("/admin/history",async (req, res) => {
    await history.find().toArray().then(r =>{
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
        let params = req.body.params
        params.updatedAt = [...userInfo.updatedAt, new Date()]
        const result = await loginDB.updateOne(
            { _id: new ObjectId(req.body._id) },
            { $set: params}
        );
        if(result){
            res.send({status : 200, message: "Успешно изменено"})
        }
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});