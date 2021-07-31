import { injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { ChatRoom } from "../schemas/ChatRoom";

injectable()
class CreateChatRoomService {
  async execute(idUsers: string[]) {
    const room = await ChatRoom.create({ idUsers, idChatRoom: uuidv4() });

    return room;
  }
}

export { CreateChatRoomService };
