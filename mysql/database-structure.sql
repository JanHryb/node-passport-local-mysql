DROP DATABASE IF EXISTS warehouse;
CREATE DATABASE warehouse;
USE warehouse;

CREATE TABLE users  (user_id INT AUTO_INCREMENT,
                    user_first_name VARCHAR(50) NOT NULL,
                    user_last_name VARCHAR(50) NOT NULL,
                    user_email VARCHAR(50) NOT NULL,
                    user_password VARCHAR(60) NOT NULL, /*VARCHAR shloud be set on 60(no more no less) characters because of bcrypt libary!*/ 
                    PRIMARY KEY(user_id));