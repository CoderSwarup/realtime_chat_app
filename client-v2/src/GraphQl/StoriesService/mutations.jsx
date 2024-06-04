import { gql } from "@apollo/client";

export const CREATE_TEXT_STORY_MUTATION = gql`
  mutation CreateTextStory(
    $createdUser: String!
    $storyType: String!
    $text: String
  ) {
    createStory(createdUser: $createdUser, storyType: $storyType, text: $text) {
      message
      success
    }
  }
`;

export const CREATE_IMAGE_STORY_MUTATION = gql`
  mutation CreateImageStory(
    $createdUser: String!
    $storyType: String!
    $fileName: String
    $storyFile: Upload
  ) {
    createStory(
      createdUser: $createdUser
      storyType: $storyType
      FileName: $fileName
      storyFile: $storyFile
    ) {
      message
    }
  }
`;

export const MARK_STORY_AS_SEEN = gql`
  mutation MarkStoryAsSeen($storyId: String!, $userId: String!) {
    markStoryAsSeen(storyId: $storyId, userId: $userId)
  }
`;
