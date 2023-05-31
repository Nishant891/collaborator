import { v4 as uuidv4 } from 'uuid';
import { Link} from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from "../App.js";
import { signIn, databases, account } from "../AppWrite.js";

function Home() {
  const {roomId, setRoomId } = useContext(AppContext);
  const [userInput, setUserInput] = useState('');
  const [user, setUser] = useState('');

  const getUser = async () => {

    const userData =  (await account) && account.get();
    userData
      .then((res) => {
        setUser(res);
        const userID = uuidv4();
        databases.createDocument('6471d0c7a377ea50a9e7', '6471d115416db8eb94fb' ,userID, {email : res.email, roomIDs : []});
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleCreateRoom = async () => {

    const roomId = uuidv4();
    console.log(roomId);
    databases.createDocument('6471d0c7a377ea50a9e7', '6471d37c47aba841fc16',roomId, {html : "", css : "", js : "", roomID : `${roomId}`});
    setRoomId(roomId);
    console.log(roomId);

  };

  const handleJoinRoom = async () => {
    if(userInput === ''){
      alert("Please enter a roomID");
    }
    else{

      const roomId = uuidv4();
      databases.createDocument('6471d0c7a377ea50a9e7', '6471d37c47aba841fc16',roomId, {html : "", css : "", js : "", roomID : `${userInput}`});
      setRoomId(roomId);

    }
  };

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
  };

  useEffect(() => {
    getUser();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">  
      <div className='fixed z-100 top-6 right-20'>
        {user === '' ? 
        <button onClick={signIn} className='bg-green-500 px-4 py-3 rounded-lg text-lg'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ borderRadius: '50%', backgroundColor: 'black' }} className='inline-block mb-1 mr-2'>
            <path fill="white" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.207 11.385.6.113.793-.258.793-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.611-4.042-1.611-.546-1.385-1.333-1.755-1.333-1.755-1.09-.745.083-.73.083-.73 1.204.085 1.839 1.235 1.839 1.235 1.07 1.838 2.806 1.305 3.484.997.108-.772.418-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.465-2.377 1.236-3.218-.124-.303-.536-1.524.117-3.176 0 0 1.007-.322 3.3 1.23.957-.267 1.98-.399 3-.404 1.02.005 2.043.137 3 .404 2.29-1.552 3.294-1.23 3.294-1.23.656 1.652.244 2.873.12 3.176.77.841 1.234 1.908 1.234 3.218 0 4.61-2.805 5.622-5.475 5.92.43.372.82 1.102.82 2.22 0 1.602-.014 2.888-.014 3.282 0 .319.19.694.8.576C20.565 22.092 24 17.593 24 12.297c0-6.627-5.373-12-12-12z"/>
          </svg>

          Login with GitHub
        </button> 
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
          <Link to="/editor">
            <button className="px-4 py-3 bg-blue-500 text-black text-xl rounded-lg mb-4" onClick={handleCreateRoom}>Create a room</button>
          </Link>
          <Link to={userInput !== '' ? '/editor' : ''}>
            <button className="px-4 py-3 bg-blue-500 text-black text-xl rounded-lg ml-4" onClick={() => {handleJoinRoom()}}>Join a room</button>
          </Link>           
          <div>
            <input className="px-4 py-2 border border-gray-300 rounded-lg mt-4 w-full outline-none text-white" type="text" value={userInput} onChange={handleUserInputChange} placeholder="Enter room ID" />
          </div>
        </div>
      </div>  
    </div>    
  );
}

export default Home;
