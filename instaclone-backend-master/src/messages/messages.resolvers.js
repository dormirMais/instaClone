import client from "../client";

export default {
  Room: {
    //여기서 id는 roomId이다.
    users: ({ id }) => client.room.findUnique({ where: { id } }).users(), //computed field
    messages: ({ id }) =>
      client.message.findMany({
        where: {
          roomId: id,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    unreadTotal: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      }
      return client.message.count({
        where: {
          read: false,
          roomId: id,
          user: {
            id: {
              not: loggedInUser.id,
            },
          },
        },
      });
    },
  },
  Message: {
    user: ({ id }) => client.message.findUnique({ where: { id } }).user(),
  },
};
