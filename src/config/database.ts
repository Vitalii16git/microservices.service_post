import dotenv from "dotenv";
dotenv.config();
import { knex, Knex } from "knex";

export const db: Knex = knex({
  client: "mysql2",
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  useNullAsDefault: true,
});
