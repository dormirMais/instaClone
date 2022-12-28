import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    sendMessage: protectedResolver(
      async (_, { payload, roomId, userId }, { loggedInUser }) => {
        let room = null;
        if (userId) {
          //userId를 받은경우 해당 user를찾아준다.
          const user = await client.user.findUnique({
            where: {
              id: userId,
            },
            select: {
              id: true, //select의 사용은 최적화에 많은 도움을 준다. 해당 영역만 불러오기 때문에 whole room을 불러올 필요가 없다.
            },
          });
          if (!user) {
            return {
              ok: false,
              error: "This user does not exist.",
            };
          }
          room = await client.room.create({
            //유저를 찾은 경우에는 room을 만들어주면된다. 그리고 roomd에는 users가 있는데 거기에 찾은 userId를 연결해 주면 된다.
            data: {
              users: {
                connect: [
                  {
                    id: userId,
                  },
                  {
                    id: loggedInUser.id, //users는 배열이기 대문에 이렇게 여러개를 만들어주는 것 같다. 위의 userId는 보내는 대상의 아이디고 이줄은 보내는 사람의 아이디.
                  },
                ],
              },
            },
          });
        } else if (roomId) {
          //그러니까. arg로 roomId를 넣어준 경우이다. 룸이 이미 만들어져 있어서 방에 들어간다. room안에는 users가 이미 있을 것!
          room = await client.room.findUnique({
            // 방이 이미 있는 경우에는 해당 방을 찾으면 된다.
            where: {
              id: roomId,
            },
            select: {
              id: true,
            },
          });
          if (!room) {
            // 파라미터로 roomId가 들어왔지만 실제로 room이 존재하지 않는 경우이다.
            return {
              ok: false,
              error: "Room not found.",
            };
          }
        }
        const message = await client.message.create({
          // 메시지를 보내는 사람의 아이디와 페이로드를  넣어준다.
          data: {
            payload,
            room: {
              connect: {
                id: room.id, //이렇게 하면 room필드에서 쓰는 reference로 연결을 해준다.
              },
            },
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
          },
        });
        console.log(message);
        pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
        return {
          ok: true,
          id: message.id,
        };
      }
    ),
  },
};
