import { useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import {
  GET_ALL_STORIES,
  GET_MYSTORY_VIEWS_REACTION,
  GET_MY_STORIES,
} from "../query";
import { SetTheStories } from "../../../Redux/Slices/StorySlice";
import {
  CREATE_IMAGE_STORY_MUTATION,
  CREATE_TEXT_STORY_MUTATION,
} from "../mutations";
import { socket } from "../../../Socket";
const user = localStorage.getItem("user_id");

export const useFriendsId = () => {
  const { friends } = useSelector((state) => state.app);
  const FriendsIds = friends?.map((ele) => ele._id);
  return FriendsIds;
};

export const NotifyOthersAboutStories = () => {
  socket.emit("NEW_STORY_UPLOAD");

  socket.off("NEW_STORY_UPLOAD");
};

export const useFetchUserStories = () => {
  const dispatch = useDispatch();
  const friends = useFriendsId();
  const { selectedStoryId } = useSelector((state) => state.story);
  const { loading, error, data, refetch } = useQuery(GET_ALL_STORIES, {
    variables: { userIds: friends },
  });

  useEffect(() => {
    if (data && data.getAllStories && data.getAllStories.success) {
      dispatch(SetTheStories(data.getAllStories.userStories));
    }
  }, [data, dispatch, selectedStoryId]);

  return {
    loading,
    error,
    stories: data?.getAllStories?.userStories || [],
    refetchUserStories: refetch,
  };
};

export const useFetchMystories = () => {
  const dispatch = useDispatch();
  const { selectedStoryId } = useSelector((state) => state.story);
  const { loading, error, data, refetch } = useQuery(GET_MY_STORIES, {
    variables: { userIds: [user] },
  });

  return {
    loading,
    error,
    stories: data?.getAllStories?.userStories || [],
    refetch,
  };
};

export const useCreateTextStory = () => {
  const [createStory, { data, loading, error }] = useMutation(
    CREATE_TEXT_STORY_MUTATION
  );
  const { refetch } = useFetchMystories();

  const createTextStory = async (createdUser, text) => {
    try {
      const response = await createStory({
        variables: {
          createdUser,
          storyType: "Text",
          text,
        },
        refetchQueries: [{ query: GET_MY_STORIES }],
      });
      await refetch();
      NotifyOthersAboutStories();
      return response;
    } catch (err) {
      console.error("Error creating story:", err);
      return { error: err };
    }
  };

  return { createTextStory, data, loading, error };
};

export const useCreateImageStory = () => {
  const [createStory, { data, error, loading }] = useMutation(
    CREATE_IMAGE_STORY_MUTATION
  );

  const createImageStory = async (createdUser, fileName, storyFile) => {
    console.log(createdUser, fileName, storyFile);
    try {
      const response = await createStory({
        variables: {
          createdUser,
          storyType: "Image",
          fileName,
          storyFile,
        },
      });
      return response;
    } catch (err) {
      console.error("Error creating story:", err);
      return { error: err };
    }
  };

  return { createImageStory, data, loading, error };
};

export const useGetMyStoryViewsAndReactions = () => {
  const { selectedStory } = useSelector((state) => state.story);

  const { loading, error, data, refetch } = useQuery(
    GET_MYSTORY_VIEWS_REACTION,
    {
      variables: {
        storyIds: selectedStory?.stories
          ? selectedStory.stories.map((story) => story.id)
          : [],
      },
    }
  );

  return {
    loading,
    error,
    data: data?.getUserStorySeensAndReactions || {},
    refetch,
  };
};
