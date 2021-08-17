type Message = {
  id: string;
  timestamp: number;
  text: string;
  senderId: string;
};

type User = {
  id: string;
  password: string;
  name: string;
  profilePicture: string;
  chatRooms: string[];
};

type ChatRoom = {
  id: string;
  name?: string;
  type: "dm" | "channel";
  members: string[];
  messages: Message[];
  roomImage: string;
};
