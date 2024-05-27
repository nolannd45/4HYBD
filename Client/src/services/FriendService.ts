import axios from 'axios';
import { isPlatform } from '@ionic/react';

if(isPlatform('hybrid')){
    var url = "http://10.0.2.2:3000";
}else{
    var url = "http://localhost:3000";
}

const FriendService = {
    getUser: async (id: string) => {
        try {
            const response = await axios.get(url + `/user/read/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getFriend: async (id: string) => {
        try {
            const response = await axios.get(url + `/user/read/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default FriendService;
