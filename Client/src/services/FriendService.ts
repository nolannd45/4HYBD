import axios from 'axios';

const FriendService = {
    getUser: async (id: string) => {
        try {
            const response = await axios.get(`http://localhost:3000/user/read/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getFriend: async (id: string) => {
        try {
            const response = await axios.get(`http://localhost:3000/user/read/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default FriendService;
