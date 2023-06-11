import { useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../App.js";
import { databases} from "../AppWrite.js";
import { ID } from "appwrite";

function Home() {
  const { setRoomId } = useContext(AppContext);
  const [userInput, setUserInput] = useState('');
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async () => {

    const documentID  = await databases.createDocument('6471d0c7a377ea50a9e7', '6471d37c47aba841fc16',ID.unique(), {html : "", css : "", js : "", roomID : ""});
    console.log(documentID.$id);
    databases.updateDocument(
      "6471d0c7a377ea50a9e7",
      "6471d37c47aba841fc16",
      documentID.$id,
      {roomID : documentID.$id}// Pass the payload data to the updateDocument method
    );
    setRoomId(documentID.$id);
    navigate("/editor?roomID=" + documentID.$id);

  };

  const handleJoinRoom = async () => {
    if(userInput === ''){

      alert("Please enter a roomID");

    }
    else{

      setRoomId(userInput);
      navigate("/editor?roomID=" + userInput);

    }
  };

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">  
      <div className='fixed z-100 top-6 right-20'>
        {user === '' ? 
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
        <button className='bg-red-500 px-4 py-3 rounded-lg text-lg'>
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
