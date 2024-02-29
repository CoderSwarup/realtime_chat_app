import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, socket } from "../../Socket";
import { SelectConversation, ShowSnackbar } from "../../Redux/Slices/AppSlice";
import {
  AddDirectMessage,
  addDirectConversation,
  updateDirectConversation,
} from "../../Redux/Slices/ConversationSlice";

// const isAutenticated = false;
const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { conversations, current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );

  const user_id = window.localStorage.getItem("user_id");

  useEffect(() => {
    if (isLoggedIn) {
      window.onload = function () {
        if (!window.location.hash) {
          window.location = window.location + "#loaded";
          window.location.reload();
        }
      };

      // window.onload();

      if (!socket) {
        connectSocket(user_id);
      }
      // Socket Listeners

      // Event for the Send the friend request
      socket.on("friend_request_send", (data) => {
        dispatch(ShowSnackbar("success", data.message));
      });

      // event listener for the get Notification on new friend request is come
      socket.on("new_friend_request", (data) => {
        dispatch(ShowSnackbar("success", data.message));
      });

      // event listener for the accespt the friend request
      socket.on("request_accepted", (data) => {
        dispatch(ShowSnackbar("success", data.message));
      });

      //Event Lsitener for the new message
      socket.on("new_message", (data) => {
        console.log(data);
        const message = data.message;
        // console.log(current_conversation, data);
        // check if msg we got is from currently selected conversation
        if (current_conversation?.id === data.conversation_id) {
          dispatch(
            AddDirectMessage({
              id: message._id,
              type: "msg",
              subtype: message.type,
              message: message.text,
              incoming: message.to === user_id,
              outgoing: message.from === user_id,
            })
          );
        }
      });

      // event listener for start new chat
      socket.on("start_chat", (data) => {
        const existing_conversation = conversations.find(
          (ele) => ele.id === data._id
        );

        if (existing_conversation) {
          dispatch(updateDirectConversation({ conversation: data }));
        } else {
          // add new direct Conversation
          dispatch(addDirectConversation({ conversation: data }));
        }

        // update the selected Chat
        dispatch(SelectConversation({ room_id: data._id }));
      });
    }
    // clear listeners
    return () => {
      socket?.off("friend_request_send");
      socket?.off("new_friend_request");
      socket?.off("accept_request");
      socket?.off("start_chat");
      socket?.off("new_message");
    };
  }, [isLoggedIn, socket]);

  if (!isLoggedIn) {
    return <Navigate to={"/auth/login"} />;
  }

  return (
    <Stack direction="row">
      {/* Side Bar */}
      <Sidebar />

      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
