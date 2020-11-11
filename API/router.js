/*
    API router for handling http CRUD requests to the web server. 
    Handles requests sent to '/api/items' endpoint. 
*/

const express = require('express');
const uuid = require('uuid');
var itemInventory = require('../InventoryItems');


// Create Router object and add methods. 
const router = express.Router();


/*
    GET all items. 
    Returns all the items in the inventory in JSON format. 
*/
router.get('/', (req, res) => {
    res.json(itemInventory);
});


/*
    GET item with specific ID.
*/
router.get('/:id', (req, res) => {
    
    const found = itemInventory.some( item => item.id === parseInt(req.params.id));
    
    if(found) {
        res.json(itemInventory.filter( item => item.id === parseInt(req.params.id)));
    }else{
        res.status(400).json({msg: `No member with id of ${req.params.id} found.`});
    }
    
});


/*
    POST a new item into the inventory, i.e. create new item. 
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
    
    itemInventory.push(newItem);
    
    res.redirect('/');
    
});


/*
    PUT request, i.e. update an item in the inventory with the given ID. 
*/

router.put('/:id', (req, res) => {
    
    var id = parseInt(req.params.id);
    
    const found = itemInventory.some(item => item.id === id);
    
    if(found){
        
        const itemUpdateDetails = req.body;
        
        itemInventory.forEach(item => {
           
            if(item.id === id){
                item.item = itemUpdateDetails.item ? itemUpdateDetails.item : item.item;
                item.price = itemUpdateDetails.price ? itemUpdateDetails.price : item.price;
                
                res.json({msg: 'Item updated', item});
            }
        });
        
    }else{
        res.status(400).json({msg: `Item with ID ${req.params.id} not found.`});
    }
    
});


/*
    DELETE request, i.e. delete item from inventory. 
*/
router.delete('/:id', (req, res) => {
    
    var IDtoDelete = parseInt(req.params.id);
    
    const found = itemInventory.some(item => item.id === IDtoDelete);
    
    if(found){
        
        itemInventory = itemInventory.filter(item => item.id !== IDtoDelete);
        
        res.json(
            {
                msg: `Deleted item with ID ${IDtoDelete}`,
                itemInventory
            }
        );
        
    }else{
        res.status(400).json({msg: `No item found with ID ${IDtoDelete}`});
    }
    
});


module.exports = router;