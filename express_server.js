//This fcn is used to generate random product code
const {generateRandomString} = require("./helpers") 

// Set up of express server
const PORT = 8080;

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


// initial database

const warehouses = ["Toronto Storage", "Montreal Factory", "New York Closet", "Secret Hideout"];

const inventory = {
  0: {
    id: 0,
    code: generateRandomString(),
    product: "Cardboard Box",
    qty: 80,
    location: warehouses[0],
    price: 4000
  },
  1: {
    id: 1,
    code: generateRandomString(),
    product: "Toy Truck",
    qty: 12,
    location: warehouses[2],
    price: 6000
  },
  2: {
    id: 2,
    code: generateRandomString(),
    product: "Cutlery",
    qty: 500,
    location: warehouses[0],
    price: 550
  },
  3: {
    id: 3,
    code: generateRandomString(),
    product: "Basketballs",
    qty: 23,
    location: warehouses[3],
    price: 399
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

// CRUD actions start below
//------------------------------------------------

// GET inventory main page
app.get("/", (req, res) => {
  const templateVars = {inventory}
  res.render("inventory_index", templateVars);
});

// GET "create an inventory item" page
app.get("/new", (req, res) => {
    const templateVars = {warehouses}
    res.render("inventory_new", templateVars);
});

// GET "create a warehouse" page
app.get("/locations/new", (req, res) => {
  res.render("locations_new");
});

// GET "List of warehouse" page
app.get("/warehouses/", (req, res) => {
  const templateVars = {warehouses}
  res.render("warehouse_index", templateVars);
});

// GET "specific warehouse" page
app.get("/warehouses/:id", (req, res) => {
  const warehouse = req.params.id;
  const warehouseProductID = [];
  for (let key in inventory) {
    if (inventory[key].location === warehouse) {
      warehouseProductID.push(key);
    }
  }
  const warehouseProducts = {};
  const availableProducts = {};
  for (let key of warehouseProductID) {
    if (inventory[key]) {
      warehouseProducts[key] = inventory[key];
    }
  }
  
  for (let key in inventory) {
    if (!warehouseProducts[key]) {
      availableProducts[key] = inventory[key];
    }
  }

  const templateVars = {warehouse, warehouseProducts, availableProducts}
  res.render("warehouse_details", templateVars);
});

// GET "Edit an inventory item" page
app.get("/inventory/:id", (req, res) => {
  const id = req.params.id;
  const templateVars = {...inventory[id], warehouses};
  res.render("inventory_edit", templateVars);
});

// Update product information
app.post("/inventory/:id", (req, res) => {
  const id = req.params.id;
  inventory[id].product = req.body.product;
  inventory[id].qty = req.body.qty;
  inventory[id].location = req.body.warehouse;
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
    location: req.body.warehouse,
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

// Assign product to warehouse
app.post("/warehouses/:id/assign", (req, res) => {
  const warehouse = req.params.id;
  const key = req.body.warehouse;
  inventory[key].location = warehouse
  res.redirect(`/warehouses/${warehouse}`);
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
