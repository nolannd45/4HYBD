import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import {
    IonBackButton,
    IonButton, IonButtons,
    IonContent,
    IonFooter,
    IonHeader, IonIcon,
    IonInput,
    IonItem, IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import ChatService from "../services/ChatService";
import { chevronBack, send } from "ionicons/icons";

const Messages = () => {
    const { idM } = useParams<{ idM: string }>();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            const chatMessages = await ChatService.getChat(idM);
            setMessages(chatMessages);
        };

        fetchMessages();
    }, [idM]);

    const handleSendMessage = async () => {
        await ChatService.sendMessage(idM, message);
        setMessage("");
        const updatedMessages = await ChatService.getChat(idM);
        setMessages(updatedMessages);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton routerLink={"/app"} routerDirection={"back"} slot={"start"} fill={"clear"}>
                            <IonIcon slot={"start"} icon={chevronBack} /> Back
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Messages</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </IonContent>
            <IonFooter>
                <IonToolbar>
                    <IonItem lines="none">
                        <IonInput
                            spellCheck={true}
                            value={message}
                            type={"text"}
                            onIonChange={(e) => setMessage(e.detail.value!)}
                        />
                        <IonIcon slot={"end"} icon={send} onClick={handleSendMessage} />
                    </IonItem>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default Messages;
