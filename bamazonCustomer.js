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
    run();
});

function run() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Buy products",
            "List products",
            "Exit"
        ]
    }).then(function(answer) {

        switch(answer.action){
            case "Buy products":
                buyProducts();
                break;
            case "List products":
                allProducts();
                break;
            case "Exit":
                connection.end();
                break;
        }
        
    });
};

function allProducts() {
    connection.query("SELECT * FROM products", function(err,res) {
        if (err) throw err;
        for (var i = 0; i<res.length; i ++){
        console.log("ID: " + res[i].item_id + "\nProduct Name" + res[i].product_name + "\nDepartment Name: " + res[i].department_name + "\nPrice: " + res[i].price.toFixed(2) + "\nStock Quantity: " + res[i].stock_quantity + "\n--------")
        }
    });
    connection.end();
};

function buyProducts() {
 //   allProducts();
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
    //    console.log(res.item_ID, res.amount)
        checkStore(res.item_ID, res.amount)

    })
};

function checkStore(id, quantity) {
    connection.query("SELECT *  FROM products WHERE ?", 
    {item_id: id},
        function(err,res){
        if (err) throw err; 
            console.log(quantity)
            console.log(res[0].stock_quantity)
        res.forEach(element =>{
            if (quantity <= element.stock_quantity) {
                console.log("There are enough " + element.product_name + " to purchase in stock")
                updateStore(quantity, id, element.stock_quantity, element.price.toFixed(2))

            }
            else {
                console.log("Sorry! We don't have enough stock of that item!")
                run()
            }

        })

    });
};

function updateStore(quantity, id, store_quantity, price) {
connection.query("UPDATE products SET ? WHERE ?",
    [{
        stock_quantity: store_quantity - quantity
    },
    {
        item_id:id
    },
    ],)
    var total= price *quantity
    console.log("Thank You for your order! Your total is $" + total.toFixed(2))

}



