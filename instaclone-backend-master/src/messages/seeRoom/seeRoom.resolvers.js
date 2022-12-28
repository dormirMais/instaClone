import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    seeRoom: protectedResolver((_, { id }, { loggedInUser }) =>
      client.room.findFirst({
        where: {
          // 해당 roomId를 갖고 있는 room을 찾아야 하고, 해당 users들은 지금 로그인한 아이가 있어야 한다.
          // 여기서 findUnique를 안쓰는 이유는 fincdUnique는 하나만 존재하는 것들만 검색해준다. 그래서 users를 사용할 수 없다
          id,
          users: {
            some: {
              id: loggedInUser.id,
            },
          },
        },
      })
    ),
  },
};
