const AuthService = {
  setAuthorizationHeader: (authorization) => {
    localStorage.setItem('authorization', authorization);
  },
  setAuthUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  getAuthUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },
  setAuthWallet: (wallet) => {
    localStorage.setItem('wallet', JSON.stringify(wallet));
  },
  getAuthWallet: () => {
    return JSON.parse(localStorage.getItem("wallet"));
  },
}

export default AuthService;