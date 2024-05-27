import React, { useState } from "react";
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonToolbar, IonTitle, useIonRouter, IonAlert } from "@ionic/react";
import AuthService from "../services/AuthService";

const Login: React.FC = () => {
    const [pseudo, setPseudo] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>("");

    const navigation = useIonRouter();

    const doLogin = async () => {
        // Forcer la mise à jour des entrées avant la soumission
        setTimeout(async () => {
            console.log("Login attempt:", pseudo, password); // Log the values to check if they are updated
            if (!pseudo || !password) {
                setAlertMessage("Please enter both pseudo and password.");
                setShowAlert(true);
                return;
            }
            try {
                await AuthService.login(pseudo, password);
                navigation.push("/app", "root", "replace");
            } catch (error) {
                setAlertMessage("Login failed. Please check your credentials.");
                setShowAlert(true);
            }
        }, 0);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonItem>
                    <IonLabel position="floating">Pseudo</IonLabel>
                    <IonInput
                        type="text"
                        value={pseudo}
                        onIonChange={(e) => setPseudo(e.detail.value!)}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput
                        type="password"
                        value={password}
                        onIonChange={(e) => setPassword(e.detail.value!)}
                    />
                </IonItem>
                <IonButton expand="block" onClick={doLogin}>Connexion</IonButton>
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header={'Error'}
                    message={alertMessage}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
};

export default Login;
