import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home.js";
import Editor from "./pages/Editor.js";
import { useState, createContext } from 'react';

export const AppContext = createContext();

function App() {
  const [roomId, setRoomId] = useState('');
  return (
    <div className="App">
      <AppContext.Provider value={{ roomId, setRoomId }}>
        <Router>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/editor" element={<Editor/>}/>
            </Routes>
        </Router>
      </AppContext.Provider>
    </div>
  );
}

export default App;
