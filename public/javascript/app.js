function deleteItemFromInventory()
{   
    var elem = $(event.target);
    var row = elem.parent().parent();
    var id = row.children(".rowItemID").html();
    row.remove();
    
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
        
        if (this.readyState == 4 && this.status == 200) {
            alert(`Item with ID \'${id}\' deleted`);
        }else if(this.readyState == 4 && this.status == 400){
            var res = xhttp.responseText;
            alert(`${JSON.parse(res).msg}`);
        }
    };
    
    xhttp.open("DELETE", `http://localhost:5000/api/items/${id}`, true);
    xhttp.send();
    
    location.reload(true);
    
}


function updateItem(itemID)
{   
    var item = $("#updateItemName").val();
    var price = $("#updateItemPrice").val();
    
    var updateItemDetails = {
        item: item,
        price: price
    };
    
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
        
        if(this.readyState == 4 && this.status == 200)
        {
            var res = xhttp.responseText;
            alert(`Item with ID ${itemID} updated`);
        }
        
    };
    
    xhttp.open("PUT", `http://localhost:5000/api/items/${itemID}`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(updateItemDetails));
    
    location.reload(true);
    
}
