import { useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../App.js";
import { databases, account} from "../AppWrite.js";
import { ID } from "appwrite";

function Home() {
  const { setRoomId } = useContext(AppContext);
  const [userInput, setUserInput] = useState('');
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(()=>{
    async function checkUser(){
      try{
        const currentUser = await account.get();
        if(currentUser.$id != ''){
          setUser(true)
        }
      }
      catch(error){
        
      }
    }
    checkUser();
  })

  const handleCreateRoom = async () => {

    const data = await account.get();
    const userId = data.$id;
    localStorage.setItem('userId', userId);
    const documentID  = await databases.createDocument('6471d0c7a377ea50a9e7', '6471d37c47aba841fc16',ID.unique(), {html : "", css : "", js : "", roomID : "", userIds: [] });
    await databases.updateDocument(
      "6471d0c7a377ea50a9e7",
      "6471d37c47aba841fc16",
      documentID.$id,
      {roomID : documentID.$id, userIds: [userId]}// Pass the payload data to the updateDocument method
    );
    setRoomId(documentID.$id);
    navigate("/editor?roomID=" + documentID.$id);

  };

  const handleJoinRoom = async () => {

    if (userInput === '') {
      alert('Please enter a roomID');
    } 
    
    else {
      const regex = /^[a-zA-Z0-9]{20}$/;
      if (!regex.test(userInput)) {
        alert('Invalid roomID.');
      } 
      else {
        const data = await account.get();
        const userId = data.$id;
        localStorage.setItem('userId', userId);
        await setRoomId(userInput);
        const doc = await databases.getDocument(
          "6471d0c7a377ea50a9e7",
          "6471d37c47aba841fc16",
          userInput
          // Pass the payload data to the updateDocument method
        );
        const userIds = doc.userIds;
        await databases.updateDocument(
          "6471d0c7a377ea50a9e7",
          "6471d37c47aba841fc16",
          userInput,
          {userIds: [...userIds,userId]}// Pass the payload data to the updateDocument method
        );
        navigate("/editor?roomID=" + userInput);
      }
    }

  };

  const handleLogout = async () => {
    try {
      const data = await account.get();
      const userId = data.$id;
      await account.deleteSessions(userId);
      setUser(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">  
      <div className='fixed z-100 top-6 right-20'>
        {user === false ? 
        <div>
          <button 
            onClick={() => {
              navigate("/signup") 
            }} 
            className='bg-green-500 px-4 py-3 rounded-lg text-lg mr-2'
          >
            Sign Up
          </button> 
          <button 
            onClick={() => {
              navigate("/login") 
            }} 
            className='bg-green-500 px-4 py-3 rounded-lg text-lg'
          >
            LogIn
          </button> 
        </div>       
        : 
        <button 
          onClick={handleLogout}   
          className='bg-red-500 px-4 py-3 rounded-lg text-lg'>
          Log Out
        </button>}
      </div>
      <div className='mb-8'>
        <h1 className="text-9xl bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text">Collaborator</h1>
      </div>   
      <div> 
        <div className="text-center">
            <button className="px-4 py-3 bg-blue-500 text-black text-xl rounded-lg mb-4" onClick={handleCreateRoom}>Create a room</button>
            <button className="px-4 py-3 bg-blue-500 text-black text-xl rounded-lg ml-4" onClick={() => {handleJoinRoom()}}>Join a room</button>        
          <div>
            <input className="px-4 py-2 border border-gray-300 rounded-lg mt-4 w-full outline-none text-black" type="text" value={userInput} onChange={handleUserInputChange} placeholder="Enter room ID" />
          </div>
        </div>
      </div>  
    </div>    
  );
}

export default Home;
