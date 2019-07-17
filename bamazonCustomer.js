require("dotenv").config();

var inquirer = require('inquirer');
var mysql = require('mysql')


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASS,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId)
    allProducts();
});

function run() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Buy products",
            "Exit"
        ]
    }).then(function(answer) {

        switch(answer.action){
            case "Buy products":
                buyProducts();
                break;
            case "exit":
                connection.end();
                break;
        }
        
    });
};

function allProducts() {
    connection.query("SELECT * FROM products", function(err,res) {
        if (err) throw err;
        for (var i = 0; i<res.length; i ++){
            console.log("ID: " + res[i].item_id + "\nProduct Name" + res[i].product_name + "\nDepartment Name: " + res[i].department_name + "\nPrice: " + res[i].price + "\nStock Quantity: " + res[i].stock_quantity + "\n--------")
        }
    });
};

function buyProducts() {

    inquirer.prompt([
        {
        name: "item_ID",
        type: "input",
        message: " What is the item ID of the item you would like to buy?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
            }
        },
        {
        name: "amount",
        type: "input",
        message: "How many items would you like to buy?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
            }
        }
    ]).then (function(res) {
        console.log(res.item_ID, res.amount)

    })
};
