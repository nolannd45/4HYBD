import axios from "axios";

const ChatService = {
    getChat: async (id: string) => {
        try {
            const response = await axios.get(`/api/chatroom/${id}`);
            return response.data;
        } catch (error) {
            //throw error;
            return null;
        }
    },

    sendMessage: async (id: string, message: string) => {
        try {
            const response = await axios.post(`/api/chatroom/${id}`, {
                message,
            });
            return response.data;
        } catch (error) {
            //throw error;
            return null;
        }
    },

    createChat: async (name: string) => {
        try {
            const response = await axios.post('/api/chatroom', {
                name,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

}

export default ChatService;
