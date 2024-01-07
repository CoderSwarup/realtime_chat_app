export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id
    ? users[1].username
    : users[0].username;
};

export const getSenderImg = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].avatar : users[0].avatar;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};
