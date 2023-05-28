import { getFirestore, addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from "../Firebase.js";
import { Link} from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from "../App.js";
import { signInWithGitHub } from "../Firebase.js";

function Home() {
  const {roomId, setRoomId } = useContext(AppContext);
  const [userInput, setUserInput] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleCreateRoom = async () => {
    const userId = uuidv4();
    const postRef = collection(db, "Rooms");

    const roomDoc = await addDoc(postRef, {
      userId: userId,
      html: "",
      css: "",
      js: "",
      roomId: ""
    });

    const newroomId = roomDoc.id;
    const roomRef = doc(db, "Rooms", newroomId);
    await setDoc(roomRef, { roomId: newroomId }, { merge: true });
    setRoomId(newroomId);

    // console.log(newroomId);
    // console.log('Room created successfully!');
  };

  const handleJoinRoom = async () => {
    if(userInput === ''){
      setShowAlert(true);
    }
    else{
      const userId = uuidv4();
      const postRef = collection(db, "Rooms");
    
      const roomDoc = await addDoc(postRef, {
        userId: userId,
        html: "",
        css: "",
        js: "",
        roomId: userInput
      });
    
      const newroomId = roomDoc.id;
      setRoomId(newroomId);
    
      // console.log('Joined room:', userInput);
      // console.log('Room created successfully!');
    }
  };

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
    setShowAlert(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">  
      <div className='fixed z-100 top-6 right-20'>
        <button onClick={signInWithGitHub} className='bg-green-500 px-4 py-3 rounded-lg text-lg'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"className="h-5 w-5 mr-2 inline-block">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.43 9.8 8.2 11.37.6.12.82-.26.82-.58v-2.04c-3.34.72-4.04-1.58-4.04-1.58-.54-1.37-1.32-1.74-1.32-1.74-1.08-.74.08-.72.08-.72 1.2.08 1.84 1.24 1.84 1.24 1.08 1.86 2.84 1.32 3.52 1 .1-.78.42-1.32.76-1.62-2.66-.3-5.46-1.34-5.46-5.94 0-1.32.48-2.4 1.28-3.24-.14-.32-.56-1.54.12-3.2 0 0 1-.32 3.3 1.24A11.6 11.6 0 0112 4.06c1.04.02 2.08.14 3.06.42 2.3-1.56 3.3-1.24 3.3-1.24.68 1.66.26 2.88.12 3.2.8.84 1.28 1.92 1.28 3.24 0 4.62-2.8 5.64-5.46 5.92.44.36.82 1.1.82 2.22v3.3c0 .32.2.7.82.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
          Sign In With GitHub</button>
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
            <input className="px-4 py-2 border border-gray-300 rounded-lg mt-4 w-full outline-none" type="text" value={userInput} onChange={handleUserInputChange} placeholder="Enter room ID" />
          </div>
        </div>
      </div>  
    </div>    
  );
}

export default Home;
