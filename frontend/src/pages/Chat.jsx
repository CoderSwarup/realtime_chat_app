import axios from "axios";
import React, { useEffect } from "react";

export default function Chat() {
  const GetChats = async () => {
    const response = await axios.get("/api/v1/chats");
    console.log(response);
  };
  useEffect(() => {
    GetChats();
  }, []);
  return (
    <div>
      <h1>Chats</h1>
    </div>
  );
}
