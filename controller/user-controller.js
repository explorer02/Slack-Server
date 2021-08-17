const { readJSONFIle, writeJSONFIle } = require("./utils");

exports.UserController = class {
  async readAllUsers() {
    return await readJSONFIle(__dirname + "/../storage/Users.json");
  }
  async writeAllUsers(data) {
    return await writeJSONFIle(__dirname + "/../storage/Users.json", data);
  }
  async getAllUsers() {
    const data = await this.readAllUsers();
    return Object.keys(data).map((id) => ({ id, ...data[id] }));
  }

  async getUser(id) {
    const data = await this.readAllUsers();
    if (!data) return;
    if (id in data) return { ...data[id], id };
  }
  async saveUser(user) {
    const data = await this.readAllUsers();
    if (!data) return false;
    data[user.id] = { ...user };
    return await this.writeAllUsers(data);
  }
  async addChatRoom(members, room_id) {
    const data = await this.readAllUsers();
    if (!data) return false;
    members.forEach((member) => {
      const user = data[member];
      if (user) user.chatRooms.push(room_id);
    });
    return await this.writeAllUsers(data);
  }
};
