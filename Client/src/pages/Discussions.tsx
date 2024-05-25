import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import React from "react";
import {createOutline} from "ionicons/icons";
import Groupes from "../components/Groupes";

const Discussions: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className={"ion-padding-top"}>
                    <IonButtons slot="end">
                        <IonButton>
                            <IonIcon slot="end" icon={createOutline}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
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
