import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonButton, IonFooter } from '@ionic/react';
import MessageService from '../services/MessageService';
import { useParams } from 'react-router-dom';
import './Chat.css'; // Assurez-vous que le fichier CSS est importé

const ChatGroup: React.FC = () => {
    const { userId, groupId } = useParams<{ userId: string; groupId: string }>();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');

    useEffect(() => {
        console.log("test")

        const fetchMessages = async () => {
            try {
                const fetchedMessages = await MessageService.getGroupMessages(groupId);
                console.log("Fetched messages:", fetchedMessages);
                setMessages(fetchedMessages);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        fetchMessages();
    }, [userId, groupId]);

    const sendMessage = async () => {
        if (newMessage.trim() === '') return;
        try {
            const message = await MessageService.sendMessage(userId, groupId, newMessage);
            setMessages([...messages, message]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Chat</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonList className="chat-list">
                    {messages.length > 0 ? messages.map((msg, index) => (
                        <IonItem key={msg._id || index} className={msg.sender === userId ? 'my-message' : 'friend-message'}>
                            <IonLabel className="message-bubble">
                                <p><strong>{msg.sender === userId ? "Me" : "Friend"}</strong>: {msg.content}</p>
                            </IonLabel>
                        </IonItem>
                    )) : (
                        <p>No messages to display</p>
                    )}
                </IonList>
            </IonContent>
            <IonFooter>
                <IonItem>
                    <IonInput
                        value={newMessage}
                        placeholder="Type a message"
                        onIonChange={(e) => setNewMessage(e.detail.value!)}
                    />
                    <IonButton onClick={sendMessage}>Send</IonButton>
                </IonItem>
            </IonFooter>
        </IonPage>
    );
};

export default ChatGroup;
