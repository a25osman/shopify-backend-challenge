const {generateRandomString} = require("./helpers")
const PORT = 8080;

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


// initial database
const inventory = {
  0: {
    id: 0,
    code: generateRandomString(),
    product: "Cargo Van",
    qty: 8,
    location: null,
    price: 4000
  },
  1: {
    id: 1,
    code: generateRandomString(),
    product: "Small Truck",
    qty: 12,
    location: null,
    price: 6000
  },
  2: {
    id: 2,
    code: generateRandomString(),
    product: "Large Truck",
    qty: 5,
    location: null,
    price: 9000
  },
  3: {
    id: 3,
    code: generateRandomString(),
    product: "Fork Lift",
    qty: 6,
    location: null,
    price: 15000
  },
  4: {
    id: 4,
    code: generateRandomString(),
    product: "Cargo",
    qty: 35,
    location: null,
    price: 1500
  }
};

const warehouses = ["Toronto Storage", "Montreal Factory", "New York Closet"];


// CRUD actions start below
//------------------------------------------------

// GET inventory main page
app.get("/", (req, res) => {
  const templateVars = {inventory}
  res.render("inventory_index", templateVars);
});

// GET "create an inventory item" page
app.get("/new", (req, res) => {
    res.render("inventory_new");
});

// GET "create a warehouse" page
app.get("/locations/new", (req, res) => {
    res.render("locations_new");
});

// GET "Edit an inventory item" page
app.get("/inventory/:id", (req, res) => {
  const id = req.params.id;
  const templateVars = inventory[id];
  res.render("inventory_edit", templateVars);
});

// Update product information
app.post("/inventory/:id", (req, res) => {
  const id = req.params.id;
  inventory[id].product = req.body.product;
  inventory[id].qty = req.body.qty;
  inventory[id].location = req.body.location;
  inventory[id].price = req.body.price;
  res.redirect("/");
});

// Create new product
app.post("/new", (req, res) => {
  const id = Number(Object.keys(inventory).pop()) + 1; // this will be the id of the new product
  inventory[id] = {
    id,
    code: generateRandomString(),
    product: req.body.product,
    qty: req.body.qty,
    location: req.body.location,
    price: req.body.price
   };
  res.redirect("/");
});

// Create new warehouse
app.post("/locations/new", (req, res) => {
  const warehouse = req.body.warehouse;
  warehouses.push(warehouse); 
  res.redirect("/");
});

// Delete product
app.post("/inventory/:id/delete", (req, res) => {
  const id = req.params.id;
  delete inventory[id];
  res.redirect(`/`);
});

// Active port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
