DROP DATABASE IF EXISTS ttpfs;
CREATE DATABASE ttpfs;

\c

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name_ VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  funds NUMERIC DEFAULT 5000.00
);

CREATE TABLE stocks (
  id SERIAL PRIMARY,
  symbol VARCHAR UNIQUE NOT NULL,
  open_price NUMERIC NOT NULL,
  updated TIMESTAMP NOT NULL
);

CREATE TABLE portfolios (
  id SERIAL PRIMARY KEY
  user_id INT NOT NULL,
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  stock_id INT NOT NULL,
    FOREIGN KEY (stock_id)
    REFERENCES stocks(id)
    ON DELETE CASCADE,
  quantity INT NOT NULL,
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  stock_id INT NOT NULL,
    FOREIGN KEY (stock_id)
    REFERENCES stocks(id)
    ON DELETE CASCADE,
  quantity INT NOT NULL,
  transaction_date TIMESTAMP NOT NULL
);