import axios from 'axios';

const MessageService = {
    getMessages: async (userId : String, friendId : String) => {
        try {
            const response = await axios.get(`http://localhost:3000/commentaire/get/${userId}/${friendId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching messages:", error);
            return [];
        }
    },
    sendMessage: async (sender: string, receiver: string, content: string) => {
        try {
            const response = await axios.post('http://localhost:3000/commentaire/create', {
                sender,
                receiver,
                content
            });
            return response.data;
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    },

    sendMedia: async (mediaData: FormData, friendId : string) => {
        try {
            const token = localStorage.getItem('token'); // Assurez-vous que le token est bien stocké dans le localStorage
            const response = await axios.post('http://localhost:3000/media/create', mediaData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error sending media:", error);
            throw error;
        }
    },

    getMediaStatus: async (userId: string, friendId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/media/status/${userId}/${friendId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching media status:", error);
            return [];
        }
    },
    markMediaAsSeen: async (mediaId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:3000/media/markasread/${mediaId}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error marking media as seen:", error);
            throw error;
        }
    }
};

export default MessageService;