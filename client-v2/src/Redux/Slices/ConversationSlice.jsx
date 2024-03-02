import { faker } from "@faker-js/faker";
import { createSlice } from "@reduxjs/toolkit";

const user_id = window.localStorage.getItem("user_id");
const initialState = {
  isLoading: false,
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  group_chat: {},
};

const ConversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    // fetch direct conversations
    getDirectConversations(state, action) {
      const list = action.payload.conversations.map((ele) => {
        const this_user = ele.participants.find(
          (ele) => ele._id.toString() !== user_id
        );
        return {
          id: ele._id,
          user_id: this_user._id,
          name: `${this_user.firstName} ${this_user.lastName}`,
          img: faker.image.url(),
          msg: faker.music.songName(),
          time: "9:30",
          online: this_user.status === "Online",
          unread: 0,
          pinned: false,
        };
      });

      state.direct_chat.conversations = list;
    },

    // update direct convesation
    updateDirectConversationReducer(state, action) {
      const this_conversation = action.payload.conversation;

      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (ele) => {
          if (ele.id === this_conversation._id) {
            const user = this_conversation.participants.find((elm) => {
              return elm._id.toString() !== user_id;
            });

            return {
              id: this_conversation._id,
              user_id: user._id,
              name: `${user.firstName} ${user.lastName}`,
              img: faker.image.url(),
              msg: faker.music.songName(),
              time: "9:30",
              online: user.status === "Online",
              unread: 0,
              pinned: false,
            };
          } else {
            return ele;
          }
        }
      );
    },

    // add new direct conversation
    adddirectConversationReducer(state, action) {
      const this_conversation = action.payload.conversation;
      const user = this_conversation.participants.find(
        (ele) => ele._id.toString() !== user_id
      );
      state.direct_chat.conversations.push({
        id: this_conversation._id,
        user_id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        img: faker.image.url(),
        msg: faker.music.songName(),
        time: "9:30",
        online: user.status === "Online",
        unread: 0,
        pinned: false,
      });
    },

    // set current conversation
    setCurrentConversation(state, action) {
      state.direct_chat.current_conversation = action.payload;
    },

    // fetch current conversation messages reducer
    fetchCurrentMessages(state, action) {
      const messages = action.payload.messages;
      const formatted_messages = messages.map((el) => ({
        id: el._id,
        type: "msg",
        subtype: el.type,
        message: el.text,
        incoming: el.to === user_id,
        outgoing: el.from === user_id,
        file: el?.file,
        img: el?.file?.url,
      }));
      state.direct_chat.current_messages = formatted_messages;
    },

    // add new incoming message
    addDirectMessage(state, action) {
      state.direct_chat.current_messages.push(action.payload.message);
    },
  },
});

export default ConversationSlice.reducer;

// thunk actions
export const FetchDirectConversations = ({ conversations }) => {
  return async (dispatch, getState) => {
    dispatch(
      ConversationSlice.actions.getDirectConversations({ conversations })
    );
  };
};

// updating the existing convesation
export const updateDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(
      ConversationSlice.actions.updateDirectConversationReducer({
        conversation,
      })
    );
  };
};

// add direct conversation thunk
export const addDirectConversation = ({ conversation }) => {
  console.log(conversation);
  return async (dispatch, getState) => {
    dispatch(
      ConversationSlice.actions.adddirectConversationReducer({
        conversation,
      })
    );
  };
};

// set urrent Conversation
export const SetCurrentConversation = (current_conversation) => {
  // console.log(current_conversation);
  return async (dispatch, getState) => {
    dispatch(
      ConversationSlice.actions.setCurrentConversation(current_conversation)
    );
  };
};

//fetch current messages  of a particular conversation
export const FetchCurrentMessages = ({ messages }) => {
  return async (dispatch, getState) => {
    dispatch(ConversationSlice.actions.fetchCurrentMessages({ messages }));
  };
};

// add the new Message that send
export const AddDirectMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(ConversationSlice.actions.addDirectMessage({ message }));
  };
};
