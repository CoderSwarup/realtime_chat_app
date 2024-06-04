export const Query = `
    getAllStories(userIds :[String]):StoryResponse
    getUserStorySeensAndReactions(storyIds: [ID!]!): SeenReactionResponse
`;
