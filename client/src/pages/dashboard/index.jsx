import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import UserCard from "../../components/UserCard";
import { io } from "socket.io-client";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";

const Dashboard = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user:details"))
  );
  const [people, setPeople] = useState();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [currentChat, setCurrentChat] = useState();
  const [message, setMessage] = useState("");
  const socket = io("http://localhost:8000");
  const mesRef = useRef(null);
  const [showLogOut, setShowLogOut] = useState(false);
  const navigate = useNavigate();
  const [claudeReply, setClaudeReply] = useState("");
  const [claudeLoading, setClaudeLoading] = useState(false);

  useEffect(() => {
    socket?.emit("addUser", user?.id);
    socket?.on("getUsers", (users) => console.log("Active Users", users));
    socket?.on("getMessage", (data) => {
      setMessages((prev) => ({
        ...prev,
        messages: [
          ...prev?.messages,
          {
            user: data?.user,
            message: data?.message,
          },
        ],
      }));
    });
  }, [socket]);

  useEffect(() => {
    mesRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.messages]);

  console.log("user: ", user);
  console.log("conversations: ", conversations);
  console.log("messages: ", messages);
  console.log("people: ", people);

  const fetchMessages = async (convoId, userB) => {
    const res = await axios.get(`http://localhost:3000/api/message/${convoId}`);
    const messagesRes = res.data;
    console.log("resData: ", res.data);
    console.log("USER ID: ", user);
    setMessages({ messages: messagesRes, receiver: userB, convoId });
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user:details"));
    console.log("loggedInuser: ", loggedInUser);
    const fetchConversations = async () => {
      const res = await axios.get(
        `http://localhost:3000/api/conversation/${loggedInUser?.id}`
      );
      const conversationsRes = res.data;
      console.log("conversationsRes: ", res.data);
      setConversations(conversationsRes);
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchPeople = async () => {
      const res = await axios.get("http://localhost:3000/api/users");
      const peopleRes = res.data;
      console.log("peopleRes: ", peopleRes);
      const filteredPeople = peopleRes.filter(
        (person) => person.userId !== user?.id
      );
      setPeople(filteredPeople);
    };
    fetchPeople();
  }, []);

  const sendMessage = async () => {
    socket?.emit("sendMessage", {
      conversationId: messages?.convoId,
      senderId: user?.id,
      message,
      receiverId: messages?.receiver?.receiverId,
    });
    await axios.post("http://localhost:3000/api/message", {
      conversationId: messages?.convoId,
      senderId: user?.id,
      message,
      receiverId: messages?.receiver?.receiverId,
    });
    setMessage("");
  };

  const handleLogOut = () => {
    localStorage.removeItem("user:details");
    localStorage.removeItem("user:token");
    navigate("/user/signin");
  };

  const handleBusy = async (currentChat) => {
    const res = await axios.post("http://localhost:3000/api/claude", {
      username: currentChat.name,
    });
    const reply = res.data;
    console.log("CLAUDE AI REPLY: ", reply.content[0].text);
    setClaudeLoading(false);
    setClaudeReply(reply.content[0].text);
  };

  useEffect(() => {
    setClaudeReply("");
    if (currentChat?.status === "busy") {
      setClaudeLoading(true);
      handleBusy(currentChat);
    }
  }, [currentChat]);

  return (
    <main className="flex flex-row">
      {/* user dash and recently chatted section */}
      <section className="w-1/5 h-screen p-4 shadow-lg">
        <div className="flex flex-row items-center justify-between">
          <UserCard user={user} isProfile={true} />
          <div onClick={() => setShowLogOut(!showLogOut)}>
            <BsThreeDotsVertical size={20} />
          </div>
        </div>
        {showLogOut && (
          <div
            onClick={handleLogOut}
            className="bg-neutral-200 p-2 rounded-md mt-2 flex flex-row items-center justify-between"
          >
            <span>Log Out</span>
            <IoIosLogOut size={20} />
          </div>
        )}
        <hr className="mb-10 mt-5" />

        {/* recently chatted section below */}
        <section className="flex flex-col gap-6 overflow-y-scroll scrollbar scrollbar-none">
          <span className="font-semibold">Your Messages</span>
          {conversations.length > 0 ? (
            conversations.map((convo, ind) => {
              // console.log(convo);
              return (
                <div
                  key={ind}
                  onClick={() => {
                    fetchMessages(convo.conversationId, convo.user);
                    setCurrentChat(convo.user);
                    setMessage("");
                  }}
                >
                  <UserCard user={convo.user} />
                </div>
              );
            })
          ) : (
            <span>No Conversations</span>
          )}
        </section>
      </section>
      {/* chatting section */}
      <section className="w-1/2 h-screen flex flex-col items-center relative">
        <div className="flex flex-row items-center gap-2 bg-neutral-200 p-2 w-full">
          {currentChat?.name ? (
            <UserCard user={currentChat} />
          ) : (
            <span>Open Chat</span>
          )}
        </div>
        {/* Chat section below */}
        <section className=" w-full">
          <div className="h-[470px] p-4 w-full overflow-y-scroll scrollbar scrollbar-none  ">
            {messages?.messages?.length > 0 ? (
              messages.messages.map((message, index) => {
                return (
                  <div key={index}>
                    <p
                      className={`max-w-[40%]  p-2 ${
                        message.user.id === user.id
                          ? "ml-auto bg-blue-300"
                          : "bg-neutral-200"
                      } rounded-md text-sm mb-5`}
                    >
                      {message.message}
                    </p>
                    <div ref={mesRef}></div>
                  </div>
                );
              })
            ) : (
              <span className="text-center w-full my-5">No Conversation</span>
            )}
            {claudeLoading ? (
              <div className="flex flex-row items-center gap-2">
                <ImSpinner3 className="animate-spin" size={20} />
                <span className="text-xs italic">Claude AI Replying</span>
              </div>
            ) : (
              claudeReply && (
                <div className="flex flex-col items-center bg-neutral-200 p-2 rounded-md gap-2">
                  <span className="text-xs italic">Claude AI Reply</span>
                  <span className="text-sm text-center">{claudeReply}</span>
                </div>
              )
            )}
          </div>
          {currentChat && (
            <div className="flex flex-row items-center gap-2 p-4">
              <input
                type="text"
                className="rounded-full p-2 outline-none w-full"
                placeholder={
                  currentChat.status === "busy"
                    ? "Cannot send message as user is busy"
                    : "message"
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={currentChat.status === "busy"}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white p-2 px-4 rounded-full disabled:bg-neutral-300"
                disabled={message === ""}
              >
                Send
              </button>
            </div>
          )}
        </section>
      </section>
      {/* people section */}
      <section className="w-1/4 flex-grow h-screen p-4 flex flex-col gap-5 shadow-lg overflow-y-scroll scrollbar scrollbar-none">
        <span className="font-semibold">People</span>
        {people?.map((person, ind) => {
          return (
            <div
              key={ind}
              onClick={() => {
                const convoExist = conversations.find(
                  (convo) => convo.user.receiverId === person.userId
                );
                if (convoExist) {
                  fetchMessages(convoExist.conversationId, person.user);
                } else {
                  fetchMessages("new", person.user);
                }
                setCurrentChat(person.user);
                setMessage("");
              }}
            >
              <UserCard user={person.user} />
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default Dashboard;
