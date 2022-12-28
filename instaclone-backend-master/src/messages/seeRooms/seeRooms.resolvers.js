import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    seeRooms: protectedResolver(async (_, __, { loggedInUser }) =>
      client.room.findMany({
        where: {
          users: {
            some: {
              id: loggedInUser.id, //현재 로그인한 아이의 id가 some으로 하나라도 포함되어 있는 room들을 찾아내는 것이다.
            },
          },
        },
      })
    ),
  },
};
