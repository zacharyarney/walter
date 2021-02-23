import * as mongodb from 'mongodb';
import database from '../../../config/db.config';

interface Auth0UserSchema {
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  sub: string;
  auth0Id: string;
}

interface AccessTokenResponse {
  access_token: string;
  item_id: string;
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

export async function createUser(user: Auth0UserSchema) {
  console.log(user);
  try {
    const id = await users.insertOne(user);
    return await users.findOne({ _id: id });
  } catch (err) {
    return err.errmsg;
  }
}

export async function addNewAccessToken(
  auth0Id: string,
  accessTokenResponse: AccessTokenResponse
) {
  console.log('addNewAccessToken to DB');
  return await users.findOneAndUpdate(
    { auth0Id: auth0Id },
    { $addToSet: { items: accessTokenResponse } }
  );
}
