import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchFriendRequestList,
  FetchFriendsList,
  FetchUsersList,
} from "../../Redux/Slices/AppSlice";
import {
  FriendElement,
  FriendRequestElement,
  UserComponent,
} from "../../components/FriendsComponent";
import { XCircle } from "phosphor-react";

// All Users List
const UserListComponent = () => {
  const { users } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchUsersList());
  }, []);

  return (
    <>
      {users.map((user, i) => {
        return <UserComponent key={i} {...user} />;
      })}
    </>
  );
};

const FriendsListComponent = () => {
  const { friends } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchFriendsList());
  }, []);

  return (
    <>
      {friends.map((user, i) => {
        return <FriendElement key={i} {...user} />;
      })}
    </>
  );
};

const FriendRequestComponent = () => {
  const { friendRequestList } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchFriendRequestList());
  }, []);

  return (
    <>
      {friendRequestList.map((user, i) => {
        return <FriendRequestElement key={i} id={user._id} {...user.sender} />;
      })}
    </>
  );
};
export default function Friends({ open, handleclose }) {
  const [value, setValue] = useState(0);

  const HandleChangeTab = (e, newValue) => {
    setValue(newValue);
  };
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      handleClose={handleclose}
      keepMounted
      sx={{ p: 1 }}
    >
      <DialogTitle>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="h4">Manage Contacts</Typography>
          <IconButton onClick={handleclose}>
            <XCircle />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Stack width={"100%"} padding={1}>
        <Tabs value={value} onChange={HandleChangeTab} centered>
          <Tab label="Explore"></Tab>
          <Tab label="Friends"></Tab>
          <Tab label="Requests"></Tab>
        </Tabs>
      </Stack>

      {/* All Dialog Content */}
      <DialogContent>
        <Stack height={"100%"} width={"100%"}>
          <Stack spacing={1}>
            {(() => {
              switch (value) {
                case 0: //All users
                  return <UserListComponent />;
                case 1: // all Friends
                  return <FriendsListComponent />;
                case 2: //all requests
                  return <FriendRequestComponent />;
                default:
                  break;
              }
            })()}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
