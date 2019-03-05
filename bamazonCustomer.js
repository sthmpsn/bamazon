require("dotenv").config();      
require('console.table');

const keys = require("./keys.js");     // hide the username and pw used to connect to the mysql db
const mysql = require('mysql');
const inquirer = require('inquirer');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: keys.dbCreds.id,
    password: keys.dbCreds.secret,
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    displayInventory();
});



function entryPoint(){
    inquirer
        .prompt(
            {
                type: "list",
                message: "What would you like to do?",
                choices: 
                    [
                        "Purchase an item",
                        "Display Inventory",
                        "Exit"
                    ],
                name: "usrSelect"
            }
        )
        .then(function(IR){
            console.log("\nselection was: " +IR.usrSelect);
            switch(IR.usrSelect){
                case "Purchase an item":
                    purchaseProduct();
                    break;
                case "Display Inventory":
                    displayInventory();
                    break;
                case "Exit":
                    exit();
                    break;
            }
        });
}





function displayInventory(){
    var query = "SELECT item_id as ID, product_name as PRODUCT,price as PRICE, stock_quantity as QTY FROM products";
    connection.query(query,function(err,res){
        if (err) throw err;
        console.table(res);
        entryPoint();
    });

}

function purchaseProduct(){
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the ID of the product you want to buy?",
                name: "usrProductID"
            },
            {
                type: "input",
                message: "What is the quantity you would like to purchase?",
                name: "usrPurchaseAmt"
            }
        ])
        .then(function(IR){
            console.log("The user would like to purchase " +IR.usrPurchaseAmt+ " of item #" +IR.usrProductID);
            var itemID = IR.usrProductID;
            var itemPurchaseQTY = IR.usrPurchaseAmt;
            var query = "SELECT item_id as ID, product_name as PRODUCT, department_name as DEPT, price as PRICE, stock_quantity as QTY FROM products WHERE item_id =?";
            connection.query(query,itemID,function(err,res){
                if (err) throw err;
                console.log("itemQuery: " +JSON.stringify(res[0]));
                if (res.QTY < itemPurchaseQTY){
                    console.log("Sorry we currently only have " +res.QTY+ " of this product left, please select a lower quantity until we restock.")
                }
                else{                
                    updateStock(itemID,itemPurchaseQTY);
                }
            });
        });
}

function updateStock(id,qty){
    // Pass it a product ID and QTY and it will add/subtract that amount to the database
    var query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id=?";
    connection.query(query,[qty,id], function(err, res){
        if (err) throw err;
        console.log("Purchase successful, Thank you come back soon!\n");
        displayInventory();
        entryPoint();
    });

}



function exit(){
    connection.end;
    console.log("connection " + connection.threadId+ " was terminated");
    process.exit();
}
