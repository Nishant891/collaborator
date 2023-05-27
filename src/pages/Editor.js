import React, { useState, useEffect } from 'react';
import { db } from '../Firebase.js';
import { useContext } from 'react';
import { AppContext } from '../App.js';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function Editor() {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [srcDoc, setSrcDoc] = useState('');
  const [forwardedContent, setForwardedContent] = useState([]);

  const { roomId } = useContext(AppContext);

  const roomRef = roomId !== '' ? doc(db, 'Rooms', roomId) : null;

  useEffect(() => {
    socket.on("received_message", (data) => {
      if(data.lang == "html"){
        setHtml(data.message);
      }
      else if(data.lang == "css"){
        setCss(data.message);
      }
      else if(data.lang == "js"){
        setJs(data.message);
      }
    })
}, [socket])

  useEffect(() => {
    if (roomRef) {
      const updateRoomData = async () => {
        await updateDoc(roomRef, {
          html: html,
          css: css,
          js: js,
        });
      };

      updateRoomData();
    }
  }, [html, css, js, roomId, roomRef]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `);
    }, 250);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  function handleForwardedContent(lang) {
    if (lang === 'html') {
      setForwardedContent([html, 'html'])
      if(forwardedContent != ""){
        socket.emit("send_message",{message: forwardedContent[0], lang: forwardedContent[1]});
      }
    } else if (lang === 'css') {
      setForwardedContent([css, 'css']);
      if(forwardedContent != ""){
        socket.emit("send_message",{message: forwardedContent[0], lang: forwardedContent[1]});
      }
    } else if (lang === 'js') {
      setForwardedContent([js, 'js']);
      if(forwardedContent != ""){
        socket.emit("send_message",{message: forwardedContent[0], lang: forwardedContent[1]});
      }
    }

  }

  function handleHTML(event) {
    const newHtml = event.target.value;
    setHtml(newHtml);
  }

  function handleCSS(event) {
    const newCss = event.target.value;
    setCss(newCss);
  }

  function handleJS(event) {
    const newJs = event.target.value;
    setJs(newJs);
  }

  return (
    <>
      <div className="pane top-pane">
        <div className="flex-container">
          <textarea
            className="code-area"
            style={{ height: '250px', width: '300px', marginLeft: '6px' }}
            value={html}
            onChange={handleHTML}
            placeholder="Enter HTML code"
          ></textarea>
          <textarea
            className="code-area"
            style={{ height: '250px', width: '300px', marginLeft: '6px' }}
            value={css}
            onChange={handleCSS}
            placeholder="Enter CSS code"
          ></textarea>
          <textarea
            className="code-area"
            style={{ height: '250px', width: '300px', marginLeft: '6px' }}
            value={js}
            onChange={handleJS}
            placeholder="Enter JavaScript code"
          ></textarea>
          <div>
            <button className="button-container" onClick={() => handleForwardedContent("html")}>Forward HTML</button>
            <button className="button-container" onClick={() => handleForwardedContent("css")}>Forward CSS</button>
            <button className="button-container" onClick={() => handleForwardedContent("js")}>Forward JS</button>
          </div>
        </div>
      </div>
      <div className="pane">
        <iframe className="bg-white-700"
          srcDoc={srcDoc}
          title="output"
          sandbox="allow-scripts"
          width="100%"
          height="100%"
          style={{ background: 'white' }}
        />
      </div>
    </>
  );
}

export default Editor;
