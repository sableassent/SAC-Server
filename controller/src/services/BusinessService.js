import * as Server from '../Server';

const BusinessService = {
    getByStatus: async (obj) => {
        try {
            let response = await Server.request({
                url: '/business/getByStatus',
                method: 'GET',
                params: obj || {}
            });
            return response;
        } catch (error) {
            throw Error(error.message);
        }
    },
    verifyBusiness: async (obj) => {
        try {
            let response = await Server.request({
                url: '/business/verify',
                method: 'POST',
                data: obj || {}
            });
            return response;
        } catch (error) {
            throw Error(error.message);
        }
    },
    getUser: async (userId) => {
        let obj = { userId: userId }
        try {
            let response = await Server.request({
                url: '/getUser',
                method: 'GET',
                params: obj || {}
            });
            return response;
        } catch (error) {
            throw Error(error.message);
        }
    }
}

export default BusinessService