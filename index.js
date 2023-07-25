// const http = require('http');

// const port = 3000;

// const server = http.createServer((req, res) => {
//     // res.statusCode = 200;
//     res.setHeader("Content-Type", "text/html");
//     res.end("<img src='https://pbs.twimg.com/media/Dj8XlmjV4AEzsvr.jpg'>");
// });

// server.listen(port, () => console.log(`App running on port: ${port}`));

require('dotenv').config();

const express = require('express');
const fruits = require('./fruits.js');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = process.env.PORT;
const fruitsFilePath = "./fruits.js";

app.use(cors());
app.use("/fruits", express.json());


function saveJSFile() {
    let fullString = "const fruits = ";
    fullString += JSON.stringify(fruits);
    

    fullString += "\nmodule.exports = fruits;"
    console.log(fullString);
    fs.writeFileSync(fruitsFilePath, fullString);
}

function getRandomNumber(min, max) {
    let count = 0;
    while(count < max) {

        count++;
    }

    
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkIDExists(id) {
    // console.log(id);
    for (let i = 0; i < fruits.length; i++) {
        console.log(fruits[i]["id"]);
        if (fruits[i]["id"] === id) return true;
    }
    return false;
}

function generateID(limit) {
    let id = "";
    let count = 0;
    for (let i = 0; i < limit; i++) {
        let num = getRandomNumber(1, 9);
        id += num;
    }

    while(checkIDExists(parseInt(id))) {
        for (let i = 0; i < limit; i++) {
            let num = getRandomNumber(1, 9);
            id += num;
        }
    }

    //console.log(id);
    return parseInt(id);
}

function validFruit(fruit) {
    if (typeof fruit != "object") return false;

    let keys = Object.keys(fruit);
    
    let realKey = true; 

    for (let i = 0; i < keys.length; i++) {

        switch(keys[i]) {
            case "genus":
                realKey = true;
            break;
            case "name":
                realKey = true;
            break;
            case "id":
                realKey = true;
            break;
            case "family":
                realKey = true;
            break;
            case "order":
                realKey = true;
            break;
            case "nutrients":
                realKey = true;
            break;
            case "carbohydrates":
                realKey = true;
            break;
            case "protein":
                realKey = true;
            break;
            case "fat":
                realKey = true;
            break;
            case "calories":
                realKey = true;
            break;
            case "sugar":
                realKey = true;
            break;
            default:
                realKey = false;
                return false;
            break;
        } 
        //if (keys[i] != ("genus" || "name" || "id" || "family" || "order" || "nutritions" || "carbohydrates" || "protein" || "fat" || "calories" || "sugar")) return false;
    }

    return true;
}


app.get('/', (req, res) => {
    //res.setHeader("Content-Type", "text/html");
    //res.send(`<img style="height:50%;width:50%" src='https://pbs.twimg.com/media/Dj8XlmjV4AEzsvr.jpg'><img style="height:50%;width:50%" src='https://oyster.ignimgs.com/mediawiki/apis.ign.com/star-wars-episode-7/8/83/Jabba-the-hut.jpg'>`);
    res.send('Hello Fruity!');
});

app.get('/fruits', (req, res) => {
    res.send(fruits);
});

app.post('/fruits', (req, res) => {
    const fruit = req.body;
    console.log(fruit["name"].toLowerCase());

    if (validFruit(fruit)) {
        const foundFruit = fruits.find((fruitItem) => fruitItem.name.toLowerCase() === fruit["name"].toLowerCase());
        
        if (foundFruit == undefined) {
            fruit["id"] = generateID(9999);
            
            console.log(fruit);

            fruits.push(fruit);
            saveJSFile();
            res.status("201").send(fruit);
        }
        else {
            res.status("418").send("Fruit already Exists");
        }
    }
    else {
        res.status("418").send("Fruit is invalid");
    }

    console.log(fruit);
});

app.get('/fruits/:name', (req, res) => {
    // res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    console.log("Enter");
    let fruit;

    console.log(req.params.name);
    for (let i = 0; i < fruits.length; i++) {
        // console.log(String(fruits[i]).toLowerCase());
        if (String(fruits[i]["name"]).toLowerCase() === String(req.params.name).toLowerCase()) {
            // console.log(fruits[i]);
            fruit = fruits[i];
            //break;
        }
    }
    if (fruit == undefined) res.status("404").send();
    console.log(fruit);
    // console.log(fruits);
    res.send(fruit);
});

// app.get('/penguins', (req, res) => {
//     res.status("204").send("Kaykay");
//     // res.send('Here are the penguins');
// });

// app.get('/penguins/:name', (req, res) => {
//     res.send(req.params);
// });

app.listen(port, () => console.log(`App running on port: ${port}`));