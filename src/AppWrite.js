import { Client, Account, Databases, Appwrite } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("64719ed6c9b56a6c9afe"); // Your project ID

export const account = new Account(client);

export const databases = new Databases(client);

export const signIn = async () => {
  try{
    const redirectUrl = 'http://localhost:3000/'
    await account.createOAuth2Session('github', redirectUrl).then((a) => {
      console.log(a);
    })
    .catch((error) => {
      console.log(error);
    })
  }
  catch(error)  {
      console.log('Error:', error); // Handle any errors
  };
};