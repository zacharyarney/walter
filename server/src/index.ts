import { MongoClient } from 'mongodb';
import config from './config/config';
import mongo from './config/db.config';
import { app } from './api/server';
import * as usersDAO from './dao/users/users';

const port = config.port;

MongoClient.connect(mongo.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(client => {
    usersDAO.injectDb(client);

    app.listen(port, () => {
      console.log(`\n=== SERVER LISTENING ON ${port} ===\n`);
    });
  })
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });
