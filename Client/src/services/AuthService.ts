import axios from 'axios';

const AuthService = {
    login: async (pseudo: string, password: string) => {
        try {
            const response = await axios.post('http://localhost:3000/login', {
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
            const response = await axios.post('http://localhost:3000/user/create', {
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
