/*
    API router for handling http CRUD requests to the web server. 
    Handles requests sent to '/api/items' endpoint. 
*/

const express = require('express');
const uuid = require('uuid');
var itemInventory = require('../InventoryItems');

const MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


// Create Router object and add methods. 
const router = express.Router();


/*
    GET all items. 
    Returns all the items in the Items collection from the ItemInventory DB. 
*/
router.get('/', (req, res) => {
    
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbObj = db.db("ItemInventory");
        dbObj.collection("Items").find({}).toArray((err, result) => {
            if(err) throw err;
            res.json(result);
            db.close();
        });
    });
});


/*
    GET item with specific ID.
*/
router.get('/:id', (req, res) => {
    
    //const found = itemInventory.some( item => item.id === parseInt(req.params.id));
    var searchID = parseInt(req.params.id);
    
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbObj = db.db("ItemInventory");
        var query = { id: searchID };
        dbObj.collection("Items").findOne(query, (err, result) => {
            if(err) throw err;
            
            if(result != null)
            {
                var dbItem = {
                    id: result.id,
                    item: result.item,
                    price: result.price
                };
            
                res.json(dbItem);
            
                console.log("Item: " + dbItem);
            }else{
                res.status(400).json({msg: `No member with id of ${searchID} found.`});
            }
            
            db.close();
        });
    });
});


/*
    POST a new item into the ItemInventory Database, i.e. create new item. 
*/
router.post('/', (req, res) => {
    
    var newItem = {
        id: uuid.v4(),
        item: req.body.item,
        price: req.body.price
    };
    
    if(!newItem.item || ! newItem.price){
       return res.status(400).json({msg: 'Please supply a valid name and price'});
    }
    
    // Send the new item to the database
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbObj = db.db("ItemInventory");
    
        dbObj.collection("Items").insertOne(newItem, (err, res) => {
            if(err) throw err;
            db.close();
        });
    });
    
    //res.json(newItem);
    
    res.redirect('/');
    
});


/*
    PUT request, i.e. update an item in the inventory with the given ID. 
*/

router.put('/:id', (req, res) => {
    
    var updateID = parseInt(req.params.id);
    var query = {id: updateID};
    const updateDetails = req.body;
    var updItem = updateDetails.item;
    var updPrice = updateDetails.price;
    
    var newValues = { $set: {item: updItem, price: updPrice} };
    
    MongoClient.connect(url, (err, db) => {
       if(err) throw err; 
        var dbObj = db.db("ItemInventory");
        dbObj.collection("Items").updateOne(query, newValues, (err, result) => {
            
            if(err) throw err;
            
            if(result != null)
            {
                console.log(`Item with ID ${updateID} updated: ` + result.result);
                res.json(result);
                
            }else{
                res.status(400).json({msg: `Item with ID ${updateID} not found.`});
            }
            db.close();
        });
    });
    
});


/*
    DELETE request, i.e. delete item from inventory. 
*/
router.delete('/:id', (req, res) => {
    
    var IDtoDelete = parseInt(req.params.id);
    
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbObj = db.db("ItemInventory");
        var query = {id: IDtoDelete};
        
        dbObj.collection("Items").deleteOne(query, (err, result) => {
            if(err) throw err;
            
            if(result.result.n !== 0)
            {
                console.log(`Item with ID ${IDtoDelete} deleted.`);
                res.json(result.result);
                
            }else{
                res.status(400).json({msg: `No item found with ID ${IDtoDelete}`});
            }
            
            db.close();
        }); 
    });    
});


module.exports = router;