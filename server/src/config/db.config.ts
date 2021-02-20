require('dotenv').config();

export default {
  url: process.env.MONGODB_URL ?? '',
  dbName: process.env.DB_NAME,
};
