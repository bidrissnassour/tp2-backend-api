const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const { PrismaLibSql } = require("@prisma/adapter-libsql");

dotenv.config();

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
