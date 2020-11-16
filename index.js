const express = require('express');
const logger = require('./middleware/logger');
const handlebars = require('express-handlebars');
var inventoryItems = require('./InventoryItems');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5000;

var url = "mongodb://localhost:27017/";


/*
    Use Middleware
*/
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));

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

// Render page for editing item info
app.get('/item/:id', (req, res) => {
    
    var searchID = req.params.id;
    
    var dbItem;
    
    MongoClient.connect(url, (err, db) => {
        
        if(err) throw err;
        var dbObj = db.db("ItemInventory");
        var query = {id: searchID};
        
        console.log(`Load edit item page of ${searchID}`);
        
        dbObj.collection("Items").findOne(query, (err, result) => {
            if(err) throw err;
            
            if(result != null)
            {
                dbItem = {
                    id: result.id,
                    item: result.item,
                    price: result.price
                };
                
                console.log(`Item found: ${dbItem}`);
                
                res.render('editItem', {title: "Edit Item", dbItem});
                console.log("Page rendered");
                db.close();
            }
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

