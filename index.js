const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csvtojson');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

let urlencodedParser = bodyParser.urlencoded({extended: false});
app.post('/savedata', urlencodedParser, (req, res) => {
    let datum = new Date();
    let str = `${req.body.teplota},${req.body.pocasi},${datum.toLocaleDateString()}\n`;
    fs.appendFile('./data/vysledky.csv', str, function(err) {
        if (err) {
            console.error(`Nepodařilo se uložit soubor: ${err}`);
            return res.status(400).json({
                success: false,
                message: `Nepodařilo se uložit soubor: ${err}`
            });
        }
    });
    res.redirect(301, '/');
});

app.get('/vysledky', (req,res) => {
    csv().fromFile('./data/vysledky.csv').then(data => {
        console.log(data);
        res.render('vysledky.pug', {'nadpis': 'Zápisy teplot', 'teploty' :data});
    }).catch(err => {
        console.log(err);
    });
});

app.get('/about', (req, res) => {
    res.send('Stránka k záznamu teplot. ');
});

app.get('/version', (req, res) => {
    res.send('Verze 1.0');
});

app.listen(port, () => {
    console.log(`Server is running, port: ${port}`);
});