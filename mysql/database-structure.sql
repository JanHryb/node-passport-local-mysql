/*
procedury, transakcje, triggery sql projekt
wyzwalacze
triggery
*/

#DATABASE STRUCTURE
DROP DATABASE IF EXISTS warehouse;
CREATE DATABASE warehouse;
USE warehouse;

CREATE TABLE users  (user_id INT AUTO_INCREMENT,
                    user_first_name VARCHAR(50) NOT NULL,
                    user_last_name VARCHAR(50) NOT NULL,
                    user_email VARCHAR(50) NOT NULL,
                    user_password VARCHAR(60) NOT NULL, /*VARCHAR shloud be set on 60(no more no less) characters because of bcrypt libary!*/ 
                    PRIMARY KEY (user_id));

CREATE TABLE product_categories (product_category_id INT AUTO_INCREMENT,
                                product_category_name VARCHAR(50) NOT NULL,
                                product_category_desc TEXT,
                                PRIMARY KEY (product_category_id));

CREATE TABLE product_brands (product_brand_id INT AUTO_INCREMENT,
                            product_brand_name VARCHAR(50) NOT NULL ,
                            PRIMARY KEY (product_brand_id));

CREATE TABLE products   (product_id INT AUTO_INCREMENT,
                        product_name VARCHAR(50) NOT NULL,
                        product_desc TEXT,
                        product_price DECIMAL(7,2) UNSIGNED NOT NULL,
                        product_amount INT UNSIGNED NOT NULL,
                        product_category_id INT NOT NULL,
                        product_brand_id INT NOT NULL,
                        PRIMARY KEY (product_id),
                        FOREIGN KEY (product_category_id) REFERENCES product_categories(product_category_id),
                        FOREIGN KEY (product_brand_id) REFERENCES  product_brands(product_brand_id));

CREATE TABLE orders (order_id INT AUTO_INCREMENT,
                    order_date DATE NOT NULL,
                    product_id INT NOT NULL,
                    order_ordered_amount INT UNSIGNED NOT NULL,
                    order_total_price DECIMAL(9,2) UNSIGNED NOT NULL,
                    user_id INT NOT NULL,
                    PRIMARY KEY (order_id),
                    FOREIGN KEY (product_id) REFERENCES products(product_id),
                    FOREIGN KEY (user_id) REFERENCES users(user_id));

# INSERTS
INSERT INTO product_categories(product_category_name, product_category_desc)
VALUES ('buty',''), ('ubrania',''), ('akcesoria','');

INSERT INTO product_brands(product_brand_name)
VALUES ('adidas'), ('nike'), ('the north face'), ('wrangler'), ('MISBHV'), ('yeezy');

INSERT INTO products(product_name, product_desc,product_price, product_amount, product_category_id, product_brand_id)
VALUES ('nike air force 1', 'immortal shoes', 250.00, 400 , 1, 2), ('yeezy boost 350''bone'' ', 'very comfy shoes', 800.00, 25, 1, 6);


# PROCEDURES
DELIMITER $$
CREATE OR REPLACE PROCEDURE viewProducts()
BEGIN
    SELECT  products.product_id, products.product_name, products.product_desc, products.product_price, products.product_amount, product_categories.product_category_name, product_brands.product_brand_name
	FROM products
	INNER JOIN product_categories ON products.product_category_id = product_categories.product_category_id
	INNER JOIN product_brands ON products.product_brand_id = product_brands.product_brand_id
    ORDER BY product_id ASC ;
END $$
# CALL viewProducts();

DELIMITER $$
CREATE OR REPLACE PROCEDURE createProduct(product_name VARCHAR(50), product_desc TEXT, product_price DECIMAL(7,2) UNSIGNED, product_amount INT UNSIGNED, product_category_id INT, product_brand_id INT)
BEGIN
    INSERT INTO products(product_name, product_desc, product_price, product_amount, product_category_id, product_brand_id)
    VALUES (product_name, product_desc, product_price, product_amount, product_category_id, product_brand_id);
END $$
# CALL createProduct('adidas forum low', '',350.00,50,1,6);



