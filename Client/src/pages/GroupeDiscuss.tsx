import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonButton, IonFooter, IonIcon } from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';
import MessageService from '../services/MessageService';
import { useParams } from 'react-router-dom';
import './Chat.css'; // Assurez-vous que le fichier CSS est importé

const ChatGroup: React.FC = () => {
    const { userId, groupId } = useParams<{ userId: string; groupId: string }>();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');

    useEffect(() => {
        const fetchMessagesAndMedia = async () => {
            try {
                const fetchedMessages = await MessageService.getGroupMessages(groupId);
                const fetchedMedia = await MessageService.getMediaByGroup(groupId);
                console.log(fetchedMedia)
                const allMessages = [...fetchedMessages, ...fetchedMedia];

                // Sort by creation date assuming each message/media has a `createdAt` field
                allMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                console.log(allMessages)
                setMessages(allMessages);
            } catch (error) {
                console.error("Failed to fetch messages and media:", error);
            }
        };

        fetchMessagesAndMedia();
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

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('user', userId);
            formData.append('receiver', groupId);
            formData.append('story', 'false');

            try {
                const mediaMessage = await MessageService.sendMedia2(formData);
                setMessages([...messages, mediaMessage]);
            } catch (error) {
                console.error("Failed to send image:", error);
            }
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
                                {msg.content ? (
                                    <p><strong>{msg.sender === userId ? "Me" : "Friend"}</strong>: {msg.content}</p>
                                ) : (
                                    <img src={msg.imageUrl} alt="sent media" />
                                )}
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
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="fileInput"
                        onChange={handleImageUpload}
                    />
                    <IonButton
                        onClick={() => document.getElementById('fileInput')?.click()}
                    >
                        <IonIcon icon={cameraOutline} />
                    </IonButton>
                </IonItem>
            </IonFooter>
        </IonPage>
    );
};

export default ChatGroup;
