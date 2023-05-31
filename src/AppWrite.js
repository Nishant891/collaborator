import { Client, Account, Databases, Appwrite } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("64719ed6c9b56a6c9afe"); // Your project ID

export const account = new Account(client);

export const databases = new Databases(client);

export const signIn = async () => {
  try{
    const redirectUrl = 'http://localhost:3000/'; // Replace with your desired redirect URL
    await account.createOAuth2Session('github', redirectUrl)
  }
  catch(error)  {
      console.log('Error:', error); // Handle any errors
  };
};