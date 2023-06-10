import { Client, Account, Databases } from "appwrite";
 
const client = new Client()
.setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
.setProject("64719ed6c9b56a6c9afe") // Your project ID

export const databases = new Databases(client);

export const signIn = async () => {

  try{
    const redirectUrl = 'http://localhost:3000/';
    const account = new Account(client);
    const userAccount = await account.createOAuth2Session('github', redirectUrl);
    userAccount
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error)
      })
  }

  catch(error)  {
      console.log('Error:', error); // Handle any errors
  };
   
};


