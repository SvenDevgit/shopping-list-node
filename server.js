// server.js without using mongoDB
// storage is defined and instantiated locally.

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var jsonParser = bodyParser.json();

app.use(express.static('public'));

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};
Storage.prototype.getItemIndex = function(id){
   var index;
   index = this.items.findIndex(function(item) { return item.id === parseInt(id); });    
   console.log(' index in de prototype ' + index);
   return index;
};
Storage.prototype.delete = function(index){
	var removed;
    removed = this.items.splice(index,1);
	return removed;
};
Storage.prototype.update = function(index, newName){
   var updated;
   var setName = this.items[index].name = newName; 
   updated = this.items[index];
   return updated;
};
//
var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');
//
app.get('/items', function(req, res) {
    res.json(storage.items);
});
//
app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    var item = storage.add(req.body.name);
    res.status(201).json(item);
});
//
app.delete('/items/:id', jsonParser, function(req, res){
	console.log('in the delete');
    if (!req.body) {
        return res.sendStatus(400);
    } 
    var id = req.params.id;
    var index = storage.getItemIndex(id);
    if (index == -1){
       res.status(404).send('This item does not exist index' + index);
    }
    else {
      var removed = storage.delete(index);
      res.status(200).json(removed);
    }  
});
//
app.put('/items/:id', jsonParser, function(req, res){
    console.log('in the put');
    console.log(' body name ' + req.body.name);
    if (!req.body) {
        return res.sendStatus(400);
    } 
    var id = req.params.id;
    var index = storage.getItemIndex(id);
    if (index == -1){
       res.status(404).send('This item does not exist index' + index);
    }
    else {
      var updated = storage.update(index, req.body.name);
      res.status(200).json(updated);
    }  
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

exports.app = app;
exports.storage = storage;