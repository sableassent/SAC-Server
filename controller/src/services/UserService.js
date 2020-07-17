import * as Server from '../Server';

const AdminService = {
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
  logout: async () => {
    try {
      let response = await Server.request({
        url: '/logout',
        method: 'POST'
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

export default AdminService;