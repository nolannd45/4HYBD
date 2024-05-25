import React, {FC} from "react";
import {
    IonBackButton, IonButton, IonButtons,
    IonContent,
    IonHeader, IonIcon,
    IonPage,
    IonTitle,
    IonToolbar, useIonRouter
} from "@ionic/react";
import {chevronBack} from "ionicons/icons";

interface Props {
    data?: any
}

const Informations: FC<Props> = () => {

    const navigation = useIonRouter();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar mode={"ios"}>
                    <IonTitle>Infos du groupe</IonTitle>
                    <IonButtons slot="start">
                        <IonButton fill={"clear"} onClick={() => navigation.goBack()}>
                            <IonIcon slot={"start"} icon={chevronBack}/> Back
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle>Infos du groupe</IonTitle>
                    </IonToolbar>
                </IonHeader>
            </IonContent>
        </IonPage>
    )
}

export default Informations;
