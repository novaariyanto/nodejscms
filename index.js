const functions = require('firebase-functions');

const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());


var exphbs = require('express-handlebars');
app.engine('hbs',exphbs({
    extname : 'hbs',
    partialsDir : path.join(__dirname,'app','views','partials'),
    partialsDir:[
        path.join(__dirname,'views/partials')
    ]   
}));


app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');

app.use('/assets',express.static(__dirname+'/public'));
app.use('/',require(__dirname+'/route'));

var port = 6000;
app.listen(port,()=>{
    console.log('Server is running at port '+port);
});
