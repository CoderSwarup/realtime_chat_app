import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, socket } from "../../Socket";
import { SelectConversation, ShowSnackbar } from "../../Redux/Slices/AppSlice";
import {
  AddDirectGroupMessage,
  AddDirectMessage,
  DeleteGroupMessage,
  DeleteMessage,
  SetDirectChatAlertMsg,
  SetGroupAlertMsg,
  addDirectConversation,
  updateDirectConversation,
} from "../../Redux/Slices/ConversationSlice";
import { useFetchUserStories } from "../../GraphQl/StoriesService/apis/query_api";

// const isAutenticated = false;
const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { conversations, current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { conversations: GC, current_conversation: GCC } = useSelector(
    (state) => state.conversation.group_chat
  );

  const { room_id } = useSelector((s) => s.app);

  const user_id = window.localStorage.getItem("user_id");
  const { refetchUserStories } = useFetchUserStories();
  useEffect(() => {
    if (isLoggedIn) {
      // window.onload = function () {
      //   if (!window.location.hash) {
      //     window.location = window.location + "#loaded";
      //     window.location.reload();
      //   }
      // };

      // window.onload();

      if (!socket) {
        connectSocket(user_id);
      }
      // Socket Listeners

      // Event for the Send the friend request
      socket?.on("friend_request_send", (data) => {
        dispatch(ShowSnackbar("success", data.message));
      });

      // event listener for the get Notification on new friend request is come
      socket?.on("new_friend_request", (data) => {
        dispatch(ShowSnackbar("success", data.message));
      });

      // event listener for the accespt the friend request
      socket?.on("request_accepted", (data) => {
        dispatch(ShowSnackbar("success", data.message));
      });

      //Event Lsitener for the new message
      socket?.on("new_message", (data) => {
        // console.log(data);
        const message = data.message;
        // console.log(room_id);

        // check if msg we got is from currently selected conversation
        if (room_id === data.conversation_id) {
          dispatch(
            AddDirectMessage({
              id: message._id,
              type: "msg",
              subtype: message.type,
              message: message.text,
              incoming: message.to === user_id,
              outgoing: message.from === user_id,
              file: message?.file,
              img: message?.file?.url,
            })
          );
        } else {
          dispatch(
            SetDirectChatAlertMsg(
              data.conversation_id,
              message?.text || "",
              message.type
            )
          );
          let userChat = JSON.parse(
            window.localStorage.getItem(data.conversation_id)
          );
          if (userChat == null) {
            localStorage.setItem(
              data.conversation_id,
              message.type === "Text" || message.type === "Link"
                ? JSON.stringify({
                    letestMessage: message.text || "",
                    count: 1,
                  })
                : JSON.stringify({
                    letestMessage: "File Message 📂",
                    count: 1,
                  })
            );
          } else {
            localStorage.setItem(
              data.conversation_id,
              message.type === "Text" || message.type === "Link"
                ? JSON.stringify({
                    letestMessage: message.text || "",
                    count: userChat.count + 1,
                  })
                : JSON.stringify({
                    letestMessage: "File Message 📂",
                    count: userChat.count + 1,
                  })
            );
          }
        }
      });

      // event listener for start new chat
      socket?.on("start_chat", (data) => {
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

      // user Offline
      socket?.on("user_offline", (data) => {
        console.log(data, "USER OFFLINE");
      });

      // Delete Message
      socket?.on("delete-message", (data) => {
        dispatch(DeleteMessage(data.message_id));
      });

      // Group Enevnts
      socket?.on("group_message_receive", (data) => {
        const { message } = data;

        if (room_id === data.room_id) {
          dispatch(
            AddDirectGroupMessage({
              id: data.room_id,
              type: "msg",
              subtype: message.type,
              message: message.text,
              incoming: message.from !== user_id,
              outgoing: message.from === user_id,
              file: message?.file,
              img: message?.file?.url,
            })
          );
        } else {
          dispatch(
            SetGroupAlertMsg(data.room_id, message?.text || "", message.type)
          );

          let GroupChat = JSON.parse(window.localStorage.getItem(data.room_id));
          if (GroupChat == null) {
            localStorage.setItem(
              data.room_id,
              message.type === "Text" || message.type === "Link"
                ? JSON.stringify({
                    letestMessage: message.text || "",
                    count: 1,
                  })
                : JSON.stringify({
                    letestMessage: "File Message 📂",
                    count: 1,
                  })
            );
          } else {
            localStorage.setItem(
              data.room_id,
              message.type === "Text" || message.type === "Link"
                ? JSON.stringify({
                    letestMessage: message.text || "",
                    count: GroupChat.count + 1,
                  })
                : JSON.stringify({
                    letestMessage: "File Message 📂",
                    count: GroupChat.count + 1,
                  })
            );
          }
        }
      });

      socket?.on("delete-group-message", (data) => {
        dispatch(DeleteGroupMessage(data.message_id));
      });

      // STORY EVENTS
      socket?.on("NEW_STORY_UPLOAD", async () => {
        await refetchUserStories();
      });
    }

    // clear listeners
    return () => {
      socket?.off("friend_request_send");
      socket?.off("new_friend_request");
      socket?.off("accept_request");
      socket?.off("start_chat");
      socket?.off("new_message");
      socket?.off("new_media_message");
      socket?.off("user_offline");
      socket?.off("delete-message");
      socket?.off("group_message_receive");
      socket?.off("NEW_STORY_UPLOAD");
      // socket?.off("SINGLE_CHAT_TYPING");
      // socket?.off("SINGLE_CHAT_TYPING_STOP");
    };
  }, [isLoggedIn, socket, room_id]);

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
