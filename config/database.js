import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "26257", 10),
  username: process.env.DB_USER || "sgmnt_master",
  password: process.env.DB_PASSWORD || "uEaAMLzn6fZ2EkRc",
  database: process.env.DB_NAME || "sgmnt_ref_core",
  logging: false,
  dialectOptions: {
    ssl: process.env.DB_SSL === "true",
  },
    sync: { force: true } ,
});

export default sequelize;
