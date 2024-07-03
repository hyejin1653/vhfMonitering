//데이터 베이스 접속 정보.
var iniparser = require("iniparser");
let config = iniparser.parseSync(__dirname + "/config.ini");
const { Pool } = require("pg");

let configs = {
  user: config.POSTGRESQL.user,
  host: config.POSTGRESQL.server,
  database: config.POSTGRESQL.database,
  password: config.POSTGRESQL.password,
  port: 5432,
};

const pool = new Pool(configs);

module.exports = {
  pool: pool,
};
