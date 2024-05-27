import axios from 'axios';
import { isPlatform } from '@ionic/react';

const url = isPlatform('hybrid') ? "http://10.0.2.2:3000" : "http://localhost:3000";

const FriendService = {
    getUser: async (id: string) => {
        try {
            const response = await axios.get(`${url}/user/read/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getFriend: async (id: string) => {
        try {
            const response = await axios.get(`${url}/user/read/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    searchUsers: async (query: string) => {
        try {
            const response = await axios.get(`${url}/user/search`, { params: { q: query } });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    addFriend: async (friendId: string) => {
        try {
            console.log(friendId);
            const token = localStorage.getItem('token'); // Assurez-vous que le token est bien stocké dans le localStorage
            const response = await axios.post(`${url}/user/addFriend`, { friendId }, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    

    getMediaStatus: async (userId: string, friendId: string) => {
        try {
            const response = await axios.get(`${url}/media/status`, { params: { userId, friendId } });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default FriendService;
