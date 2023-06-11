import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../App.js";
import { AiFillCloud, AiFillHtml5 } from "react-icons/ai";
import { FaCss3Alt } from "react-icons/fa";
import { DiJavascript } from "react-icons/di";
import { BsGear } from "react-icons/bs";
import { databases } from "../AppWrite.js";
import { Query } from "appwrite";

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
  const [isHeld, setIsHeld] = useState(false);

  console.log(roomId);
  //This useEffect executes when the page first loads and gets the value of html,css,js from the database

  useEffect(() => {
    async function fetchData (){
      try{
        const contents = await databases.listDocuments("6471d0c7a377ea50a9e7","6471d37c47aba841fc16",[
          Query.equal("roomID", [roomId])]);
          console.log(contents);
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

  useEffect(() => {
    if (!isHeld) {
      return;
    }
    if (isHeld) {
      document.addEventListener("mousemove", function (event) {
        var cursorTopPosition = event.clientY;
        console.log("Cursor Top Position:", cursorTopPosition);
      });
    }
  }, [isHeld]);

  async function updateData(e,val){
    e.preventDefault();// Create an empty object to hold the payload data
    if (val === "html") {
      try{
        await databases.updateDocument(
          "6471d0c7a377ea50a9e7",
          "6471d37c47aba841fc16",
          roomId,
          {html:html}
        )
      }
      catch(error){
        console.log("Error2 :",error);
      }  // Assign the HTML value to the payload object
    } else if (val === "css") {
      try{
        await databases.updateDocument(
          "6471d0c7a377ea50a9e7",
          "6471d37c47aba841fc16",
          roomId,
          {css:css}
        )
      }
      catch(error){
        console.log("Error2 :",error);
      }  // Assign the CSS value to the payload object
    } else if (val === "js") {
      try{
        await databases.updateDocument(
          "6471d0c7a377ea50a9e7",
          "6471d37c47aba841fc16",
          roomId,
          {js:js}
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
    setHtml(newHtml);
    updateData(event,"html");
  }

  function handleCSS(event) {
    event.preventDefault();
    const newCss = event.target.value;
    setCss(newCss);
    updateData(event,"css");
  }

  function handleJS(event) {
    event.preventDefault();
    const newJs = event.target.value;
    setJs(newJs);
    updateData(event,"js");
  }

  const handleExpand = () => {
    console.log("Expanding");
  };

  return (
    <>
      <div className="w-full flex justify-between items-center py-3 px-3">
        <div className="">
          <p className="text-white bg-transparent font-semibold font-mono text-2xl">
            Code Editor
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <span className="text-white bg-[#1d1e22] py-2 flex items-center justify-center gap-2 px-2 rounded shadow-xl hover:scale-110 transition-all cursor-pointer w-[6rem] ">
            <AiFillCloud className=" bg-[#fff0] text-[#ffffff]" /> Save
          </span>
          <span className="text-white bg-[#1d1e22] py-2 flex items-center justify-center gap-2 px-2 rounded shadow-xl hover:scale-110 transition-all cursor-pointer w-[6rem] ">
            <BsGear className=" bg-[#fff0] text-[#ffffff]" /> Setting
          </span>
          <span className="text-white bg-[#1d1e22] py-2 flex items-center justify-center gap-2 px-2 rounded shadow-xl hover:scale-110 transition-all cursor-pointer w-[6rem] ">
            C
          </span>
          <span className="text-white bg-[#1d1e22] py-2 flex items-center justify-center gap-2 px-2 rounded shadow-xl hover:scale-110 transition-all cursor-pointer w-[6rem] ">
            Sign Up
          </span>
          <span className="text-white bg-[#1d1e22] py-2 flex items-center justify-center gap-2 px-2 rounded shadow-xl hover:scale-110 transition-all cursor-pointer w-[6rem] ">
            Login
          </span>
        </div>
      </div>
      <div className="flex flex-col">
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
        <div
          className="p-1 mt-1 mb-1 bg-white cursor-row-resize"
          onMouseDown={() => setIsHeld(true)}
          onMouseUp={() => setIsHeld(false)}
        ></div>
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
