let authorization;
let admin;
let wallet;
const AuthService = {
  setAuthorizationHeader: (auth) => {
    authorization = auth;
  },
  getAuthorizationHeader: () => {
    return authorization;
  },
  setAuthAdmin: (obj) => {
    admin = obj;
  },
  getAuthAdmin: () => {
    return admin;
  },
  setAuthWallet: (obj) => {
    wallet = obj;
  },
  getAuthWallet: () => {
    return wallet;
  },
}

export default AuthService;