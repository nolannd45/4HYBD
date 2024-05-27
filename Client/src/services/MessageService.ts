import axios from 'axios';
import { isPlatform } from '@ionic/react';

if(isPlatform('hybrid')){
    var url = "http://10.0.2.2:3000";
}else{
    var url = "http://localhost:3000";
}

const MessageService = {
    getMessages: async (userId : String, friendId : String) => {
        try {
            const response = await axios.get(url + `/commentaire/get/${userId}/${friendId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching messages:", error);
            return [];
        }
    },

    getGroupMessages: async (groupId : String) => {
        try {
            const response = await axios.get(url + `/commentaire/get/${groupId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching messages:", error);
            return [];
        }
    },

    getMediaByGroup: async (groupId : String) => {
        try {
            const response = await axios.get(url + `/media/readByGroup/${groupId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching messages:", error);
            return [];
        }
    },

    getStories: async () => {
        try {
            const response = await axios.get(url + `/media/readStory`);
            return response.data;
        } catch (error) {
            console.error("Error fetching messages:", error);
            return [];
        }
    },

    sendMessage: async (sender: string, receiver: string, content: string) => {
        try {
            const response = await axios.post(url + '/commentaire/create', {
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

    sendMedia: async (mediaData: FormData) => {
        try {
            const token = localStorage.getItem('token'); // Assurez-vous que le token est bien stocké dans le localStorage
            const response = await axios.post(url + '/media/create', {mediaData}, {
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

    sendMedia2: async (mediaData: FormData) => {
        try {
            const token = localStorage.getItem('token'); // Assurez-vous que le token est bien stocké dans le localStorage
            const response = await axios.post(url + '/media/create', mediaData, {
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
            const response = await axios.get(url + `/media/status/${userId}/${friendId}`, {
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
            const response = await axios.post(url + `/media/markasread/${mediaId}`, null, {
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
