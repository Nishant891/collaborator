import { Client, Account, Databases } from "appwrite";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const PROJECT_ID = process.env.REACT_APP_PROJECT_ID;

export const client = new Client()
  .setEndpoint(API_ENDPOINT)
  .setProject(PROJECT_ID);

export const databases = new Databases(client);
export const account = new Account(client);


