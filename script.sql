DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
 item_id INT NOT NULL AUTO_INCREMENT,
 product_name VARCHAR(100) NOT NULL,
 department_name VARCHAR(45) NOT NULL,
 price INT,
 stock_quantity INT,
 PRIMARY KEY (id)
);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("stickers", "stationary", 2.10, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("apple tv", "electronics", 50, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPad", "electronics", 1200, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPhone", "electronics", 800, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("awesome motherboard", "electronics", 300, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("awesome processor", "electronics", 600, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("4k monitor", "electronics", 1000, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("paint brush pack", "arts and craft", 150, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("old holland oil color pack", "arts and craft", 1000, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("big linen canvas", "arts and craft", 100, 1000);