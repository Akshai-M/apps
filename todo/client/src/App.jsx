import React, { useState } from "react";
import chat_icon from "./assets/react.svg"
const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { name: "User", message: inputValue };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = await response.json();
      const botMessage = { name: "Sam", message: data.answer };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching the response:", error);
    } finally {
      setInputValue("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* Chatbox Button */}
      <div className="chatbox__button">
        <button
          onClick={toggleChatbox}
          className="p-3 bg-white shadow-lg rounded-full"
        >
          <img src={chat_icon} alt="Chat" />
        </button>
      </div>

      {/* Chatbox Content */}
      {isOpen && (
        <div className="chatbox__support bg-gray-100 shadow-lg rounded-lg w-80 h-96 flex flex-col">
          {/* Header */}
          <div className="chatbox__header bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 rounded-t-lg flex items-center">
            <img
              src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png"
              alt="Chat Support"
              className="mr-3"
            />
            <div>
              <h4 className="text-lg font-semibold">Chat Support</h4>
              <p className="text-sm">Hi! My name is Sam. How can I help you?</p>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbox__messages flex-grow p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`messages__item ${
                  msg.name === "Sam"
                    ? "bg-purple-600 text-white rounded-l-lg self-start"
                    : "bg-gray-200 rounded-r-lg self-end"
                } p-2 max-w-xs mb-2`}
              >
                {msg.message}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="chatbox__footer bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 rounded-b-lg flex items-center">
            <input
              type="text"
              placeholder="Write a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow p-2 rounded-full bg-gray-200 text-black mr-3"
            />
            <button
              onClick={sendMessage}
              className="bg-purple-800 text-white px-4 py-2 rounded-full"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
