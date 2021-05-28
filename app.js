//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
var _ = require('lodash');
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("ongodb://localhost:27017/todolistDB",{useNewUrlParser: true, useUnifiedTopology: true});

const itemsScehma = {
  name: String
};

const Item= mongoose.model("Item", itemsScehma);

const item1 = new Item({
  name: "eat bitch"
});

const item2 = new Item({
  name: "eat bitches "
});

const item3 = new Item({
  name: "eat bitches hehe"
});

const arr = [];

// Item.insertMany(arr, function(err){
//   if(err) console.log("something went wrong");
//   else console.log("done bro");})

const listScehma = {
  name: String,
  items:[itemsScehma]
};

const List= mongoose.model("List", listScehma);

app.get("/", function(req, res) {

  Item.find({},function(err,found){
    if(found.length===-1){
      Item.insertMany(arr, function(err){
        if(err){console.log(found);
        }});
      }else{
    res.render("list", {listTitle: "Today", newListItems: found});
  }});

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
    const listName = req.body.list;

const item =new Item({
  name: itemName
});


  if (listName === "Today") {
    item.save();
  //   workItems.push(item);
    res.redirect("/");}
    else{
      List.findOne({name:listName},function(err, results){
        results.items.push(item);
        results.save();
            res.redirect("/" + listName);
      });
  // } else {
  //   items.push(item);}
  }
});
app.post("/delete", function(req,res){
  const checked = req.body.checkbox;
  const listName = req.body.listName;

if(listName==="Today"){
  Item.findByIdAndRemove(checked, function(err){
if(!err){
    res.redirect("/");
  }
  });
}else{
  List.findOneAndUpdate({name: listName}, {$pull:{items: {_id: checked}}},function(err, results){
    if(!err) res.redirect("/"+ listName);
  });
}

});

app.get('/:custom', function (req, res) {
  var custom = _.capitalize(req.params.custom);
  List.findOne({name:custom},function(err, results){
    if(!err){
      if(!results){
        const list =new List({
      name: custom,
      items: arr
    });

    list.save();
    res.redirect("/" + custom );
      } else {
       res.render("list",  {listTitle: custom, newListItems: results.items});
      }
    }
    });
      });
//   else {

//
// }
//   }

// });



app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started so success!");
});
