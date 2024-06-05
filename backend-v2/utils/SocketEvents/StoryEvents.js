import StoryServices from "../../GraphQl/Services/StoryServices.js";

class StorySocketEvents {
  handleNewStoryUpload(socket) {
    socket.broadcast.emit("NEW_STORY_UPLOAD");
  }

  async uploadImageStory(socket, data, callback) {
    try {
      const { storyFile } = data;

      // Check if the file size is greater than 1MB
      if (storyFile.size > 1 * 1024 * 1024) {
        // 1MB in bytes
        return callback({
          success: false,
          message: "File size should not exceed 1MB",
        });
      }

      const res = await StoryServices.createStory(data); // Pass dataSources if needed
      callback(res);

      // Emit new story upload event if story creation is successful
      if (res.success) {
        this.handleNewStoryUpload(socket);
      }
    } catch (error) {
      console.error("Error uploading image story:", error);
      callback({
        success: false,
        message: "Failed to create story",
      });
    }
  }
}

const StoryEvents = new StorySocketEvents();
export default StoryEvents;
