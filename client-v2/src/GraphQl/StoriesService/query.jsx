import { gql } from "@apollo/client";

export const GET_ALL_STORIES = gql`
  query GetAllStories($userIds: [String]) {
    getAllStories(userIds: $userIds) {
      message
      success
      userStories {
        user {
          email
          id
          name
          avatar
        }
        stories {
          id
          expirationTime
          createdAt
          storyData {
            url
            publicId
            text
          }
          storyType
          updatedAt
        }
      }
    }
  }
`;

export const GET_MY_STORIES = gql`
  query GetMyStories($userIds: [String]) {
    getAllStories(userIds: $userIds) {
      success
      message
      userStories {
        stories {
          id
          expirationTime
          isSeen {
            name
            id
            email
            avatar
          }
          reactions {
            user {
              avatar
              email
              id
              name
            }
          }
          storyData {
            url
            text
            publicId
          }
          storyType
          updatedAt
        }
      }
    }
  }
`;

export const GET_MYSTORY_VIEWS_REACTION = gql`
  query GETSeenAndReactions($storyIds: [ID!]!) {
    getUserStorySeensAndReactions(storyIds: $storyIds) {
      error
      seenUsers {
        email
        avatar
        id
        name
      }
      reactions {
        reactionType
        user {
          avatar
          email
          id
          name
        }
      }
    }
  }
`;
