import * as Server from '../Server';

const UserService = {
  login: async (obj) => {
    try {
      let response = await Server.request({
        url: '/login',
        method: 'POST',
        data: obj || {}
      });
      return response;
    } catch (error) {
      throw Error(error);
    }
  },
  me: async (obj) => {
    try {
      let response = await Server.request({
        url: '/me',
        method: 'GET'
      });
      return response;
    } catch (error) {
      throw Error(error);
    }
  },
  changePassword: async (obj) => {
    try {
      let response = await Server.request({
        url: '/changePassword',
        method: 'POST',
        data: obj || {}
      });
      return response;
    } catch (error) {
      throw Error(error);
    }
  },
}

export default UserService;