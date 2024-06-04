import StoryServices from "../Services/StoryServices.js";

const query = {
  getAllStories: (_, { userIds }) => StoryServices.getUserStories(userIds),
  getUserStorySeensAndReactions: (_, { storyIds }) =>
    StoryServices.GetStorySeenAndReaction(storyIds),
};

const mutations = {
  createStory: async (_, data) => StoryServices.createStory(data),
  markStoryAsSeen: async (_, { storyId, userId }) => {
    return await StoryServices.markStoryAsSeen(storyId, userId);
  },
};

export const resolvers = { query, mutations };
