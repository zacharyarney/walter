import * as mongodb from 'mongodb';
import database from '../../config/db.config';

interface UserSchema {
  auth0Id: string;
}

let users: mongodb.Collection;

export function injectDb(connection: mongodb.MongoClient) {
  if (users) return;

  try {
    users = connection.db(database.dbName).collection('users');
  } catch (err) {
    console.error('Unable to connect to collection "users": ', err);
  }
}

export async function getUserByAuth0Id(id: string) {
  return await users.findOne({ auth0Id: id });
}

export async function createUser(user: UserSchema) {
  try {
    return await users.insertOne(user);
  } catch (err) {
    return err.errmsg;
  }
}
