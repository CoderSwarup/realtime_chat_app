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
  group_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
};

const ConversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    // ++++++++++++++ DIRECT CHAT +++++++++++++++++++++++
    // fetch direct conversations
    getDirectConversations(state, action) {
      const list = action.payload.conversations.map((ele) => {
        const this_user = ele.participants.find(
          (ele) => ele._id.toString() !== user_id
        );

        const dateObject = new Date(this_user.updatedAt);
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();

        return {
          id: ele._id,
          user_id: this_user._id,
          email: this_user?.email,
          name: `${this_user.firstName} ${this_user.lastName}`,
          img: faker.image.url(),
          msg: faker.music.songName(),
          time: hours + ":" + minutes,
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

    // delete The Message
    deleteGroupMessage(state, action) {
      const indexToDelete = state.group_chat.current_messages.findIndex(
        (msg) => msg.id === action.payload.message_id
      );
      if (indexToDelete === -1) {
        return;
      }
      state.group_chat.current_messages.splice(indexToDelete, 1);
    },

    deleteOneOnOneChat(state, action) {
      const FilteredList = state.direct_chat.conversations.filter(
        (item) => item.id !== action.payload.room_id
      );
      state.direct_chat.conversations = FilteredList;
    },
    // ++++++++++++++ DIRECT CHAT END+++++++++++++++++++++++

    // ++++++++++++++ Group CHAT +++++++++++++++++++++++
    getGroupConversations(state, action) {
      const list = action.payload.conversations.map((ele) => {
        const dateObject = new Date(ele.updatedAt);
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();

        return {
          id: ele._id,
          name: ele.groupName,
          img: faker.image.url(),
          msg: faker.music.songName(),
          time: hours + ":" + minutes,
          unread: 0,
          pinned: false,

          participants: ele?.participants,
          admins: ele?.admins,
        };
      });

      state.group_chat.conversations = list;
    },

    // add new direct conversation
    addGroupConversationReducer(state, action) {
      const this_conversation = action.payload.conversation;
      const dateObject = new Date(this_conversation.updatedAt);
      const hours = dateObject.getHours();
      const minutes = dateObject.getMinutes();

      state.group_chat.conversations.push({
        id: this_conversation._id,
        name: this_conversation.groupName,
        img: faker.image.url(),
        msg: faker.music.songName(),
        time: hours + ":" + minutes,
        unread: 0,
        pinned: false,
        participants: this_conversation?.participants,
        admins: this_conversation.admins,
      });
    },
    // fetch Group Message
    fetchCurrentGroupChatMessages(state, action) {
      const messages = action.payload.messages;
      const formatted_messages = messages.map((el) => ({
        id: el._id,
        type: "msg",
        subtype: el.type,
        message: el.text,
        incoming: el.from !== user_id,
        outgoing: el.from === user_id,
        file: el?.file,
        img: el?.file?.url,
      }));
      state.group_chat.current_messages = formatted_messages;
    },

    setCurrentGroupConversation(state, action) {
      state.group_chat.current_conversation = action.payload;
    },

    addDirectGroupMessage(state, action) {
      state.group_chat.current_messages.push(action.payload.message);
    },

    deleteMessage(state, action) {
      const indexToDelete = state.direct_chat.current_messages.findIndex(
        (msg) => msg.id === action.payload.message_id
      );
      if (indexToDelete === -1) {
        return;
      }
      state.direct_chat.current_messages.splice(indexToDelete, 1);
    },

    removeGroup(state, action) {
      const FilteredList = state.group_chat.conversations.filter(
        (item) => item.id !== action.payload.room_id
      );
      state.group_chat.conversations = FilteredList;
    },
  },
});

export default ConversationSlice.reducer;

// thunk actions
export const FetchDirectConversations = ({ conversations }) => {
  return async (dispatch, getState) => {
    dispatch(
      ConversationSlice.actions.getDirectConversations({
        conversations,
      })
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

// Delete the message
export const DeleteMessage = (message_id) => {
  return async (dispatch, getState) => {
    dispatch(ConversationSlice.actions.deleteMessage({ message_id }));
  };
};
export const DeleteOneOnOneChat = (room_id) => {
  return async (disoacth, getstate) => {
    disoacth(ConversationSlice.actions.deleteOneOnOneChat({ room_id }));
  };
};

//  +++++++++++++++++ GROUP CHAT ACTIONS +++++++

export const FetchGroupConversations = ({ conversations }) => {
  return async (dispatch, getState) => {
    dispatch(
      ConversationSlice.actions.getGroupConversations({
        conversations,
      })
    );
  };
};

export const addNewGroupCreatedConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(
      ConversationSlice.actions.addGroupConversationReducer({
        conversation,
      })
    );
  };
};

export const FetchCurrentGroupChatMessages = ({ messages }) => {
  return async (dispatch, getState) => {
    dispatch(
      ConversationSlice.actions.fetchCurrentGroupChatMessages({ messages })
    );
  };
};
export const SetCurrentGroupConversation = (current_conversation) => {
  // console.log(current_conversation);
  return async (dispatch, getState) => {
    dispatch(
      ConversationSlice.actions.setCurrentGroupConversation(
        current_conversation
      )
    );
  };
};

export const AddDirectGroupMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(ConversationSlice.actions.addDirectGroupMessage({ message }));
  };
};

export const DeleteGroupMessage = (message_id) => {
  return async (dispatch, getState) => {
    dispatch(ConversationSlice.actions.deleteGroupMessage({ message_id }));
  };
};

export const RemoveTheGroup = (room_id) => {
  return async (disoacth, getstate) => {
    disoacth(ConversationSlice.actions.removeGroup({ room_id }));
  };
};
