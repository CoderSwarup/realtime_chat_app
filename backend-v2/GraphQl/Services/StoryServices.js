import StoryModel from "../../models/story.model.js";
import { uploadFileOnCloudinary } from "../../utils/Services/CloudinaryServices.js";

class StoryServices {
  // Function to create a new story
  static async createStory(data) {
    try {
      const { createdUser, storyType, storyFile, FileName, text } = data;
      let story;

      if (storyFile) {
        const res = await uploadFileOnCloudinary(storyFile, FileName);
        if (res === null) {
          return {
            success: false,
            message: "Something went wrong uploading the file",
          };
        }
        story = await StoryModel.create({
          createdUser,
          storyType,
          storyData: {
            public_id: res?.public_id,
            url: res?.url,
          },
        });
      } else {
        story = await StoryModel.create({
          createdUser,
          storyType,
          storyData: {
            text: text,
          },
        });
      }

      return {
        success: true,
        message: "Story created successfully",
      };
    } catch (error) {
      console.error("Error creating story:", error);
      return {
        success: false,
        message: "Failed to create story",
      };
    }
  }

  // Function to fetch all stories of a specific user or users
  static async getUserStories(userIds) {
    try {
      if (!Array.isArray(userIds) || userIds.length === 0) {
        return { success: false, message: "Invalid user IDs" };
      }
      const currentTime = new Date();
      // Find all stories created by the users
      const stories = await StoryModel.find({
        createdUser: { $in: userIds },
        expirationTime: { $gt: currentTime },
      })
        .populate("createdUser")
        .populate("isSeen")
        .populate("reactions.user"); // Populate reactions.user as well

      if (stories.length === 0) {
        return {
          success: true,
          message: "Stories retrieved successfully",
          userStories: [],
        };
      }
      // Organize stories by user
      const userStories = userIds.map((userId) => {
        const userSpecificStories = stories.filter(
          (story) => story.createdUser._id.toString() === userId
        );
        const user = userSpecificStories[0]
          ? {
              id: userSpecificStories[0].createdUser._id.toString(),
              name: userSpecificStories[0].createdUser.firstName || "",
              email: userSpecificStories[0].createdUser.email,
              avatar: userSpecificStories[0].createdUser?.avatar?.url || "",
            }
          : { id: userId, name: "", email: "" };

        return {
          user,
          stories: userSpecificStories.map((story) => {
            return {
              id: story._id.toString(),
              createdUser: {
                id: story.createdUser._id.toString(),
                name: story.createdUser.firstName,
                email: story.createdUser.email,
              },
              storyType: story.storyType,
              storyData: {
                public_id: story.storyData.public_id || null,
                url: story.storyData.url || null,
                text: story.storyData.text || null,
              },
              expirationTime: story.expirationTime,
              isSeen: story.isSeen.map((user) => ({
                id: user._id.toString(),
                name: user.firstName,
                email: user.email,
              })),
              reactions: story.reactions.map((reaction) => ({
                user: {
                  id: reaction.user._id.toString(),
                  name: reaction.user.name,
                  email: reaction.user.email,
                },
                reactionType: reaction.reactionType,
              })),
              createdAt: story.createdAt.toISOString(),
              updatedAt: story.updatedAt.toISOString(),
            };
          }),
        };
      });

      // Send response
      return {
        success: true,
        message: "Stories retrieved successfully",
        userStories,
      };
    } catch (error) {
      return {
        success: false,
        message: "Server error",
      };
    }
  }

  // Get Story Seen And Reactions
  static async GetStorySeenAndReaction(storyIds) {
    try {
      const stories = await StoryModel.find({ _id: { $in: storyIds } })
        .select("isSeen reactions")
        .populate("isSeen", "firstName email avatar")
        .populate("reactions.user", "firstName email avatar");

      const seenUsers = new Set();
      const reactions = [];

      stories.forEach((story) => {
        story.isSeen.forEach((user) => {
          const transformedUser = {
            id: user._id,
            name: user.firstName,
            email: user.email,
            avatar: user.avatar.url,
          };
          seenUsers.add(JSON.stringify(transformedUser));
        });

        story.reactions.forEach((reaction) => {
          const transformedUser = {
            id: reaction.user._id,
            name: reaction.user.firstName,
            email: reaction.user.email,
            avatar: reaction.user.avatar.url,
          };
          reactions.push({
            user: transformedUser,
            reactionType: reaction.reactionType,
          });
        });
      });

      return {
        seenUsers: Array.from(seenUsers).map((user) => JSON.parse(user)),
        reactions,
        error: null,
      };
    } catch (error) {
      console.error(error);
      return {
        seenUsers: [],
        reactions: [],
        error: "Something went wrong while fetching stories.",
      };
    }
  }

  // Function to mark a story as seen by a user
  static async markStoryAsSeen(storyId, userId) {
    try {
      if (!storyId || !userId) {
        return "";
      }
      const story = await StoryModel.findOne({ _id: storyId, isSeen: userId });
      if (story) {
        // User has already seen the story
        return true;
      }
      await StoryModel.updateOne(
        { _id: storyId },
        {
          $push: {
            isSeen: userId,
          },
        }
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // Function to delete a story
  // deleteStory(storyId) { ... }

  // Function to add a reaction to a story
  // addReaction(storyId, userId, reactionType) { ... }
}

export default StoryServices;
