const path = require("path");
const express = require("express");
const app = express();
const routes = require("./routes/lists");
const database = require("./data/database");

//--------------------------------------------------------
//********* EJS ENGINE
//--------------------------------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//--------------------------------------------------------
//********* MIDDLEWARES
//--------------------------------------------------------
app.use(express.urlencoded({extended: true})); // Parse incoming request bodies
app.use(express.json()); // Parse AJAX incomeing request
app.use(express.static("public"));

app.use(routes);

//if there is no connection to the active database the page not loaded
database.connectToDatabase().then(() =>{
  app.listen(3000);
});