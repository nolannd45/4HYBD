import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import React, { useState } from "react";
import {createOutline} from "ionicons/icons";
import Groupes from "../components/Groupes";
import MyForm from './MyForm';

const Discussions: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleIconClick = () => {
        console.log("test")
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
    
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className={"ion-padding-top"}>
                    <IonButtons slot="end">
                        <IonButton onClick={handleIconClick}>
                            <IonIcon slot="end" icon={createOutline} ></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <MyForm isOpen={isModalOpen} onClose={handleCloseModal} />
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Discussions</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <Groupes/>
            </IonContent>
        </IonPage>
    );
};

export default Discussions;
