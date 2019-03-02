DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NOT NULL UNIQUE,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price DECIMAL (10,2),
    stock_quantity INT,
    PRIMARY KEY(item_id)
 );

SELECT * FROM products;