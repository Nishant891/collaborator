import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home.js";
import Editor from "./pages/Editor.jsx";
import SignUp from "./pages/SignUp.jsx";
import LogIn from "./pages/LogIn.jsx";
import { useState, createContext } from 'react';

export const AppContext = createContext();

function App() {
  const [roomId, setRoomId] = useState('');
  const [user, setUser] = useState(false);
  return (
    <div className="App">
      <AppContext.Provider value={{ roomId, setRoomId, user, setUser }}>
        <Router>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/editor" element={<Editor/>}/>
              <Route path="/signup" element={<SignUp/>}/>
              <Route path="/login" element={<LogIn/>}/>
            </Routes>
        </Router>
      </AppContext.Provider>
    </div>
  );
}

export default App;
