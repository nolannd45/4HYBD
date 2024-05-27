import axios from 'axios';
import { isPlatform } from '@ionic/react';

const url = isPlatform('hybrid') ? "http://10.0.2.2:3000" : "http://localhost:3000";

const GroupService = {
    getGroups: async (id: string) => {
        try {
            const response = await axios.get(`${url}/groups/getUsers/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createGroup: async (titre: string, users: Array<String>) => {
        try {
            const response = await axios.post(`${url}/groups/create`, {
                titre,users
            });
            return response.data;
        } catch (error) {
            //throw error;
            return null;
        }
    }

};

export default GroupService;
