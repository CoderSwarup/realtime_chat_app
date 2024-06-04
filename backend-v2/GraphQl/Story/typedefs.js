export const typeDefs = `

type UserStory {
  user: User
  stories: [Story]!
}


type StoryResponse {
  success: Boolean!
  message: String!
  userStories: [UserStory]
}

type Story {
  id: ID!
  createdUser: User
  storyType: String
  storyData: StoryData
  expirationTime: String
  isSeen: [User]
  reactions: [Reaction]
  createdAt: String
  updatedAt: String
}

type StoryData {
  publicId: String
  url: String
  text:String
}

type Reaction {
  user: User
  reactionType: String
}

type User {
  id: ID
  name: String
  email: String
  avatar:String
}

type SeenReactionResponse {
  seenUsers: [User]
  reactions: [Reaction]
  error: String
}
`;
