import React, { useState } from "react";
import { Avatar } from "@chakra-ui/react";
import "./Chat.style.css";
export default function GroupChatImg({ users }) {
  const avatars = users.map((user) => user.avatar); // Get all avatars
  const uniqueAvatars = [...new Set(avatars)]; // Remove duplicates

  // Ensure there are at least 3 unique avatars
  while (uniqueAvatars.length < 3) {
    uniqueAvatars.push("default-avatar-url"); // Add a default avatar or handle as needed
  }

  const usersWithUniqueAvatars = users.map((user, index) => ({
    ...user,
    uniqueAvatars: uniqueAvatars.slice(index * 3, (index + 1) * 3),
  }));

  const [user1avatar, setUser1Avatar] = useState(usersWithUniqueAvatars[0]);
  const [user2avatar, setUser2Avatar] = useState(usersWithUniqueAvatars[1]);
  const [user3avatar, setUser3Avatar] = useState(usersWithUniqueAvatars[2]);

  return (
    <div className="GroupChatImgContainer">
      <Avatar
        className="GroupChatimgOne"
        size="sm"
        cursor="pointer"
        objectFit="cover"
        name={user1avatar?.username}
        src={user1avatar?.avatar}
      />
      <div>
        <Avatar
          className="GroupChatimgTwo"
          size="sm"
          cursor="pointer"
          objectFit="cover"
          name={user2avatar?.username}
          src={user2avatar?.avatar}
        />
        <Avatar
          className="GroupChatimgThree"
          size="sm"
          cursor="pointer"
          objectFit="cover"
          name={user3avatar?.username}
          src={user3avatar?.avatar}
        />
      </div>
    </div>
  );
}

/* <div>
{usersWithUniqueAvatars.map((user) => (
  <div key={user._id} className="GroupChatImgContainer">
    {user.uniqueAvatars.map((avatar, avatarIndex) => (
      <Avatar
        key={`${user._id}-avatar-${avatarIndex}`}
        className={`GroupChatimg${avatarIndex + 1}`}
        background="transparent"
        size="sm"
        cursor="pointer"
        objectFit="cover"
        src={avatar}
      />
    ))}
  </div>
))}
</div> */
