const express = require("express");
const { DEFAULT_AVATAR } = require("../constants");
const { ChatController } = require("../controller/chat-controller");
const { UserController } = require("../controller/user-controller");
const { extractFields, checkFields, responseType } = require("./utils");

const router = express.Router();

const chatController = new ChatController();
const userController = new UserController();

router.get("/", (req, res) => {
  responseType.sendUnauthorized(res);
});
//get chatroom by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const chatRoom = await chatController.getChatRoom(id);

  if (!chatRoom) {
    return responseType.sendResourceNotFound(res, "ChatRoom");
  }

  let fields = req.query.fields;

  if (fields === undefined) {
    fields = ["id"];
  } else fields = fields.split(",");

  const result = extractFields(chatRoom, fields);

  //pagination
  if (fields.includes("messages")) {
    const lastId = req.query.lastId;
    const count = req.query.count || 10;
    if (lastId === undefined) {
      result.messages = result.messages.slice(-count);
    } else {
      const index = result.messages.findIndex(
        (messages) => messages.id === lastId
      );
      if (index !== -1) {
        result.messages = result.messages.slice(
          Math.max(index - count, 0),
          index
        );
      } else {
        result.messages = result.messages.slice(-count);
      }
    }
  }
  responseType.sendSuccess(res, undefined, { result });
});

//create new chatroom
router.post("/", async (req, res) => {
  const requiredFields = ["id", "members", "type"];
  const chatRoom = req.body.chatRoom;
  const isValidChatRoom = chatRoom && checkFields(chatRoom, requiredFields);

  if (!isValidChatRoom) {
    return responseType.sendBadRequest(res, "Please provide all the fields!!", {
      requiredFields,
    });
  }
  const exists = await chatController.getChatRoom(chatRoom.id);
  if (exists)
    return responseType.sendBadRequest(res, "ChatRoom already exists!!");

  const result = await chatController.createChatRoom({
    ...chatRoom,
    messages: [],
    roomImage: chatRoom.roomImage || DEFAULT_AVATAR,
  });
  if (result) {
    userController.addChatRoom(chatRoom.members, result.id);
    return responseType.sendSuccess(res, undefined, { result });
  }
  return responseType.sendUnknownError(res);
});

//add message to chatroom
router.post("/:id/message", async (req, res) => {
  const requiredFields = ["timestamp", "text", "senderId"];
  const roomId = req.params.id;
  const message = req.body.message;
  if (!message) {
    return responseType.sendBadRequest(
      res,
      "Error!!  message object is missing"
    );
  }
  const isMessageValid = message && checkFields(message, requiredFields);
  if (!isMessageValid) {
    return responseType.sendBadRequest(res, "Please provide all the fields!!", {
      requiredFields,
    });
  }
  const isValidChatRoom = await chatController.getChatRoom(roomId);
  if (!isValidChatRoom) {
    return responseType.sendResourceNotFound(res, "ChatRoom");
  }

  const result = await chatController.addMessage(roomId, {
    ...message,
    id: roomId + "_" + message.timestamp,
  });
  if (result) return responseType.sendSuccess(res);
  return responseType.sendUnknownError(res);
});

//get all users of a chat room
router.get("/:id/users", async (req, res) => {
  const id = req.params.id;
  const chatRoom = await chatController.getChatRoom(id);

  if (!chatRoom) {
    return responseType.sendResourceNotFound(res, "ChatRoom");
  }

  const users = await Promise.all(
    chatRoom.members.map((uid) => userController.getUser(uid))
  );

  let fields = req.query.fields;

  if (fields === undefined) {
    fields = ["id"];
  } else fields = fields.split(",");

  const result = users.map((user) => extractFields(user, fields));

  responseType.sendSuccess(res, undefined, { result });
});

exports.chatRoutes = router;
