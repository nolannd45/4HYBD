import axios from 'axios';
import { isPlatform } from '@ionic/react';

if(isPlatform('hybrid')){
    var url = "http://10.0.2.2:3000";
}else{
    var url = "http://localhost:3000";
}

const AuthService = {
    login: async (pseudo: string, password: string) => {
        try {
            const response = await axios.post(url + '/login', {
                pseudo,
                password,
            });
            const token = await response.data.token;
            const user = await response.data.user;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return token;
        } catch (error) {
            throw error;
        }
    },

    register: async (pseudo: string, password: string) => {
        try {
            const response = await axios.post(url + '/user/create', {
                pseudo,
                password,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            localStorage.removeItem('token');
        } catch (error) {
            throw error;
        }
    },

    isAuthenticated: () => {
        try {
            const token = localStorage.getItem('token');
            /*return token !== null;*/
            return true;
        } catch (error) {
            throw error;
        }
    }
}

export default AuthService;
