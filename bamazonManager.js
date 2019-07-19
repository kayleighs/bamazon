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
            "List products for sale",
            "View low inventory",
            "Add to inventory",
            "Add new product",
            "Exit"
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "List products for sale":
                allProducts();
                run()
                break;
            case "View low inventory":
                lowInventory();
                break;
            case "Add to inventory":
                addInventory();
                break;
            case "Add new product":
                addNewProduct();
                break;
            case "Exit":
                connection.end();
                break;
        }
    });
};

function allProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id + "\nProduct Name: " + res[i].product_name + "\nDepartment Name: " + res[i].department_name + "\nPrice: " + res[i].price.toFixed(2) + "\nStock Quantity: " + res[i].stock_quantity + "\n--------")
        }
    });

};
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <5", function (err, res){
        if (err) throw err;
        count = 0
            for (var i = 0; i < res.length; i++) {
                count +=1
                console.log("ID: " + res[i].item_id + "\nProduct Name" + res[i].product_name + "\nDepartment Name: " + res[i].department_name + "\nPrice: " + res[i].price.toFixed(2) + "\nStock Quantity: " + res[i].stock_quantity + "\n--------")
            };
            run()
        if (count === 0) {
            console.log("There is nothing low in stock");
            run()
        };
    });
};

function addInventory() {
    connection.query("SELECT item_id FROM products", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "id",
                message: "Which item (by ID) do you want to restock?",
                validate: function (value) {
                    if (isNaN(value) === false && value <= res.length) {
                        return true;
                    }
                    return false;
                }
            }, {
                type: "input",
                name: "quantity",
                message: "How much stock do you want to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            connection.query("SELECT stock_quantity FROM products WHERE ?",{item_id: answer.id},
            function (err, res) {
                    if (err) throw err
                var newTotal = parseInt(res[0].stock_quantity) + parseInt(answer.quantity)
            connection.query("UPDATE products SET ? WHERE ?", [
                {stock_quantity: newTotal},
                {item_id: answer.id},
            ]);
            console.log("Adding " + answer.quantity + " items to the store")
     //       console.log("New stock number is " + newTotal)
            connection.query("SELECT product_name, stock_quantity FROM products WHERE ?", {item_id: answer.id},
                function (err, res) {
                    if (err) throw err; 
                    console.log("The product " + '"' + (res[0].product_name)  +'"'+ " now has a stock of " + res[0].stock_quantity + "\n--------")
                    run()
                })
            })
        });
    });
};

function addNewProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the new product you would like to add?",
            validate: function (value) {
                if (isNaN(value) === true) {
                    return true;
                }
                return false;
            }
        }, {
            type: "list",
            name: "department",
            message: "Enter the department under which this product will be listed",
            choices: ["Stationary", "electronics", "arts and craft", "toys", "baby", "furniture", "appliance", "home and garden", "other"]

        }, {
            type: "input",
            name: "price",
            message: "What is the price?",
            validate: function (value) {
                if (isNaN(value) === false && Number.isInteger(value) === false) {
                    value = parseFloat(value).toFixed(2)
                    return true;
                }
                return false;
            }
        }, {
            type: "input",
            name: "quantity",
            message: "How many in stock?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answer) {
        var name = answer.name;
        var department =  answer.department;
        var price = answer.price;
        var quantity =  answer.quantity
        connection.query("INSERT INTO products SET ?",
        {
            product_name: name,
            department_name: department,
            price: price,
            stock_quantity: quantity,

        },
         function (err, res) {
            if (err) throw err;
             console.log(res.affectedRows + " product inserted!\n");
            run();
        })
    //    console.log(query.sql)
    })

};
