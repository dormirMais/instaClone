import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

const TOKEN = "token";
//리프레쉬를 해도 토큰을 기억할 수 있어야 한다. 그래서 이렇게 로컬스토리지를 확인하게 해줘야 한다.
//어플리케이션이 동작할 때 로컬스토리지를 확인해서 있으면 true를 반환하니까 되는건데.... 개인적으로 이게 좋은건가? 라는 생각은든다... 그냥 거기에 뭐가 들어있든 로그인인데?... 추가적으로 토큰 확인이 필요할 듯
export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));
//로그인이 되는 경우에 토큰을 저장해주고 로그인 정보를 true로 만들어준다.
export const logUserIn = (token) => {
  localStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
};

//같은 로직으로 로그아웃 하는 경우 저장된 토큰을 삭제해주고 로그인 정보를 flase로 변경해주어야 한다.
export const logUserOut = (token) => {
  localStorage.removeItem(TOKEN);
  isLoggedInVar(false);
};

export const darkModeVar = makeVar(false);
export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});
