let authorization;
let user;
let wallet;
const AuthService = {
  setAuthorizationHeader: (auth) => {
    authorization = auth;
  },
  getAuthorizationHeader: () => {
    return authorization;
  },
  setAuthUser: (obj) => {
    user = obj;
  },
  getAuthUser: () => {
    return user;
  },
  setAuthWallet: (obj) => {
    wallet = obj;
  },
  getAuthWallet: () => {
    return wallet;
  },
}

export default AuthService;