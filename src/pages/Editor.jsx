import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../App.js";
import io from "socket.io-client";
import { AiFillCloud, AiFillHtml5 } from "react-icons/ai";
import { FaCss3Alt } from "react-icons/fa";
import { DiJavascript } from "react-icons/di";
import { BsGear } from "react-icons/bs";
const socket = io.connect("http://localhost:5000");

function Editor() {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [srcDoc, setSrcDoc] = useState("");
  const [forwardedContent, setForwardedContent] = useState([]);
  const [isHeld, setIsHeld] = useState(false);

  const { roomId } = useContext(AppContext);

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

  useEffect(() => {
    socket.on("received_message", (data) => {
      if (data.lang == "html") {
        setHtml(data.message);
      } else if (data.lang == "css") {
        setCss(data.message);
      } else if (data.lang == "js") {
        setJs(data.message);
      }
    });
  }, [socket]);

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
    if (lang === "html") {
      setForwardedContent([html, "html"]);
      if (forwardedContent != "") {
        socket.emit("send_message", {
          message: forwardedContent[0],
          lang: forwardedContent[1],
        });
      }
    } else if (lang === "css") {
      setForwardedContent([css, "css"]);
      if (forwardedContent != "") {
        socket.emit("send_message", {
          message: forwardedContent[0],
          lang: forwardedContent[1],
        });
      }
    } else if (lang === "js") {
      setForwardedContent([js, "js"]);
      if (forwardedContent != "") {
        socket.emit("send_message", {
          message: forwardedContent[0],
          lang: forwardedContent[1],
        });
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
