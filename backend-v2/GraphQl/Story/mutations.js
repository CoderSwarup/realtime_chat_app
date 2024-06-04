export const Mutations = `

  createStory(
    createdUser: String!
    storyType: String!
    storyFile: Upload
    FileName: String
    text: String
  ): StoryResponse

  markStoryAsSeen(storyId: String!, userId: String!): Boolean!
`;
