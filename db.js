const { Client } = require("pg");

const client = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

async function connect() {
  await client.connect();
  console.log("Connected to PostgreSQL database");
}

async function query(sql, params) {
  const res = await client.query(sql, params);
  return res.rows;
}

async function disconnect() {
  await client.end();
  console.log("Disconnected from PostgreSQL database");
}

module.exports = {
  connect,
  query,
  disconnect,
};
