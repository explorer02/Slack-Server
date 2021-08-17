const { readJSONFIle, writeJSONFIle } = require("./utils");

exports.ChatController = class {
  async getChatRoom(id) {
    const data = await readJSONFIle(
      __dirname + `/../storage/chat_rooms/${id}.json`
    );
    return data;
  }
  async createChatRoom(chatRoom) {
    return (await writeJSONFIle(
      __dirname + `/../storage/chat_rooms/${chatRoom.id}.json`,
      chatRoom
    ))
      ? chatRoom
      : false;
  }
  async addMessage(roomId, message) {
    const chatRoom = await this.getChatRoom(roomId);
    chatRoom.messages.push(message);
    return await this.createChatRoom(chatRoom);
  }
};
