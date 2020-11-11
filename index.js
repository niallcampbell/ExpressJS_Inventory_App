const express = require('express');
const logger = require('./middleware/logger');
const handlebars = require('express-handlebars');
var inventoryItems = require('./InventoryItems');
const MongoClient = require('mongodb').MongoClient;

const app = express();

const PORT = process.env.PORT || 5000;

var url = "mongodb://localhost:27017/";


/*
    Use Middleware
*/
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger);


/*
    Set up handlebars for html templates and dynamic generation. 
*/
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars'); 


/*
    Respond to homepage request with dynamically generated HTML page. 
    main.handlebars will be populated with index.handlebars. 
*/
app.get('/', (req, res) => {
    
    var itemInv = [];
    
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbObj = db.db("ItemInventory");
        dbObj.collection("Items").find({}).toArray((err, result) => {
            if(err) throw err;
            itemInv = result;
            res.render('index', {title: 'Inventory App', itemInv});
            db.close();
        });
    });
});


/*
    Use API requests router
*/
const apiRouter = require('./API/router');
app.use('/api/items', apiRouter);


app.listen(PORT, () => {
    console.log(`Web Server listening on Port ${PORT}`);
});

