import * as Server from '../Server';

const EthereumService = {
    isActivated: async (obj) => {
        try {
            let response = await Server.request({
                url: '/isActivated',
                method: 'GET'
            });
            return response;
        } catch (error) {
            throw Error(error.message);
        }
    },
    activate: async (obj) => {
        try {
            let response = await Server.request({
                url: '/activate',
                method: 'POST',
                data: obj || {}
            });
            return response;
        } catch (error) {
            throw Error(error.message);
        }
    },
    withdraw: async (obj) => {
        try {
            let response = await Server.request({
                url: '/withdraw',
                method: 'POST',
                data: obj || {}
            });
            return response;
        } catch (error) {
            throw Error(error.message);
        }
    },
    setFees: async (obj) => {
        try {
            let response = await Server.request({
                url: '/fees',
                method: 'POST',
                data: obj || {}
            });
            return response;
        } catch (error) {
            throw Error(error.message);
        }
    },
    search: async (obj) => {
        try {
            let response = await Server.request({
                url: '/search',
                method: 'POST',
                data: obj || {}
            });
            return response;
        } catch (error) {
            throw Error(error.message);
        }
    },
    downloadCSV: async (obj) => {
        try {
            let response = await Server.request({
                url: '/downloadAsCsv',
                method: 'POST',
                data: obj || {}
            });
            return response;
        } catch (error) {
            throw Error(error.message);
        }
    }
}

export default EthereumService;