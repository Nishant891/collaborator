import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../App.js";
import { AiFillHtml5 } from "react-icons/ai";
import { FaCss3Alt } from "react-icons/fa";
import { DiJavascript } from "react-icons/di";
import { client, databases, account } from "../AppWrite.js";
import { Query } from "appwrite";
import { Tooltip } from 'react-tooltip';


function Editor() {
  let { roomId } = useContext(AppContext);

  if(roomId=='' || roomId==null){
    const storedRoomId = localStorage.getItem("roomId");
    roomId = storedRoomId;
  }
  else{
    localStorage.setItem("roomId", roomId);
  }

  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [srcDoc, setSrcDoc] = useState("");
  const [copyStatus, setCopyStatus] = useState('Copy');

  useEffect(() => {
    async function fetchData (){
      try{
        const contents = await databases.listDocuments("6471d0c7a377ea50a9e7","6471d37c47aba841fc16",[
          Query.equal("roomID", [roomId])]);
          setHtml(contents.documents[0].html);
          setCss(contents.documents[0].css);
          setJs(contents.documents[0].js);
      }
      catch(error){
        console.log("Error:",error);
      }  
    }
    fetchData();

    const handlePageReload = () => {
      fetchData();
    };
  
    window.addEventListener("beforeunload", handlePageReload);
  
    return () => {
      window.removeEventListener("beforeunload", handlePageReload);
    };

  },[roomId]);

  useEffect(() => {
      //let userId = '';
      const getUser = account.get();
      getUser.then((res)=>{
        const userId = res.$id;
        const unsubscribe = client.subscribe(
        [ `databases.6471d0c7a377ea50a9e7.collections.6471d37c47aba841fc16.documents.${roomId}`],
        (response) => {
          if (
            response.events[0] ===
            `databases.6471d0c7a377ea50a9e7.collections.6471d37c47aba841fc16.documents.${roomId}.update`
          ) {
            const eventData = response.payload;
            eventData.userIds.map((users) => {
              if(users!==userId){
                console.log(userId);
                console.log("called");
                setHtml(eventData.html);
                setCss(eventData.css);
                setJs(eventData.js);
              }
            })
          }
        }
      )
      return () => {
        console.log("cleanup")
        unsubscribe();
      };
      })
      .catch((error)=>{
        console.log(error);
      })
  }, [html, css, js]);
  

  //This useEffect executes whenever their is a change in html,css,js and refreshes the iframe to render after every 250ms

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

  async function updateData(newVal,lang){
    if (lang === "html") {
      try{
        await databases.updateDocument(
          "6471d0c7a377ea50a9e7",
          "6471d37c47aba841fc16",
          roomId,
          {html:newVal}
        )
      }
      catch(error){
        console.log("Error2 :",error);
      }
    } 
    
    else if (lang === "css") {
      try{
        await databases.updateDocument(
          "6471d0c7a377ea50a9e7",
          "6471d37c47aba841fc16",
          roomId,
          {css:newVal}
        )
      }
      catch(error){
        console.log("Error2 :",error);
      } 
    }
    
    else if (lang === "js") {
      try{
        await databases.updateDocument(
          "6471d0c7a377ea50a9e7",
          "6471d37c47aba841fc16",
          roomId,
          {js:newVal}
        )
      }
      catch(error){
        console.log("Error2 :",error);
      }  // Assign the JS value to the payload object
    } 
  }

 function handleHTML(event) {
    event.preventDefault();
    const newHtml = event.target.value;
    updateData(newHtml,"html");
    setHtml(newHtml);
    
  }

  function handleCSS(event) {
    event.preventDefault();
    const newCss = event.target.value;
    updateData(newCss,"css");
    setCss(newCss);
  }

  function handleJS(event) {
    event.preventDefault();
    const newJs = event.target.value;
    updateData(newJs,"js");
    setJs(newJs);
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopyStatus('Copied');
      setTimeout(() => {
        setCopyStatus('Copy');
      }, 2000);
      // Optionally, you can display a notification or perform any other action after successful copy
    } catch (error) {
      console.log('Error while copying to clipboard:', error);
    }
  }

  return (
    <>
      <div className="w-full flex justify-between items-center py-3 px-3 bg-black">
        <div className="flex items-center">
          <p className="text-white bg-transparent font-semibold font-mono text-2xl">
            Code Editor
          </p>
        </div>
        <div className="flex items-center">
      <span className="text-white bg-transparent font-semibold font-mono text-2xl">{roomId}</span>
      <button className="bg-black text-white flex items-center rounded py-2 px-4 ml-2" onClick={handleCopy}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 9H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1"></path>
        </svg>
        <span data-tip={copyStatus} data-for="copy-tooltip" className="bg-gray-700 text-white rounded p-1">
          {copyStatus}
        </span>
      </button>
      <Tooltip id="copy-tooltip" effect="solid" place="bottom" event="hover" />
    </div>
      </div>
      <div className="flex flex-col bg-black">
        <div className="">
          <div className="flex items-center justify-center w-full h-[22rem] border-t border-b">
            <div className="flex-1 p-2 h-full">
              <div className="w-full">
                <span className="text-white bg-[#1d1e22] py-2 flex items-center justify-center gap-2 px-2 shadow-xl w-[6rem] ">
                  <AiFillHtml5 className=" bg-[#bc1313] rounded text-[#ffffff]" />{" "}
                  HTML
                </span>
              </div>
              <textarea
                className="w-full p-2 outline-none border-none bg-[#1d1e22] resize-none text-white h-[18.9rem]"
                value={html}
                onChange={handleHTML}
              />
            </div>
            <div className="flex-1 p-2 h-full">
              <div className="w-full">
                <span className="text-white bg-[#1d1e22] py-2 flex items-center justify-center gap-2 px-2 shadow-xl w-[6rem] ">
                  <FaCss3Alt className=" bg-[#1359bc] rounded text-[#ffffff] " />{" "}
                  CSS
                </span>
              </div>
              <textarea
                className="w-full p-2 outline-none border-none bg-[#1d1e22] resize-none text-white h-[18.9rem]"
                value={css}
                onChange={handleCSS}
              />
            </div>
            <div className="flex-1 p-2 h-full">
              <div className="w-full">
                <span className="text-white bg-[#1d1e22] py-2 flex items-center justify-center gap-2 px-2 shadow-xl w-[6rem] ">
                  <DiJavascript className=" bg-[#F0DB4F] rounded text-[#ffffff] " />{" "}
                  JS
                </span>
              </div>
              <textarea
                className="w-full p-2 outline-none border-none bg-[#1d1e22] resize-none text-white h-[18.9rem]"
                value={js}
                onChange={handleJS}
              />
            </div>
          </div>
        </div>
        <div className=" h-[50vh]">
          <iframe
            className="bg-white-700"
            srcDoc={srcDoc}
            title="output"
            sandbox="allow-scripts"
            width="100%"
            height="100%"
            style={{ background: "white" }}
          />
        </div>
      </div>
    </>
  );
}

export default Editor;
