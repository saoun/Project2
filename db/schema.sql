DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS todo;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_digest VARCHAR(255) NOT NULL
);

CREATE TABLE todo (
  id SERIAL PRIMARY KEY,
  info VARCHAR (255) NOT NULL,
  done BOOLEAN NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL
);