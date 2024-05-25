import React from "react";
import {
    IonButton,
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonNavLink, IonTabButton,
    IonText
} from "@ionic/react";
import {ellipsisHorizontal} from "ionicons/icons";
import Messages from "../pages/Messages";
import ActionSheetComponent from "./ActionSheetComponent";


const AllContacts = [
    {
        id: 1,
        name: "Groupe mercredi soir",
        time: "18h30",
        lastMessage: "Salut les gars, vous êtes chauds pour ce soir ?",
    },
    {
        id: 2,
        name: "Groupe jeudi soir",
        time: "18h30",
        lastMessage: "Salut les gars, vous êtes chauds pour ce soir ?",
    },
    {
        id: 3,
        name: "Groupe vendredi soir",
        time: "18h30",
        lastMessage: "Salut les gars, vous êtes chauds pour ce soir ?",
    },
    {
        id: 4,
        name: "Groupe samedi soir",
        time: "18h30",
        lastMessage: "Salut les gars, vous êtes chauds pour ce soir ?",
    }
];

const Groupes: React.FC = () => {

    const [isOpen, setIsOpen] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [id, setId] = React.useState(0);



    return (
        <>
            <IonList>
                {AllContacts.map((contact) => (
                    <IonItem key={contact.id} >
                        <IonItemSliding>
                                <IonItem button routerLink={"/messages/" + contact.id}>
                                    <IonLabel>
                                        <IonText color={"primary"}>
                                            {contact.name}
                                        </IonText>
                                        <p>{contact.lastMessage}</p>
                                    </IonLabel>
                                </IonItem>
                                <IonItemOptions side="end" onClick={() => {
                                    setIsOpen(true)
                                    setTitle(contact.name)
                                    setId(contact.id)
                                }}>
                                    <IonItemOption color="medium" >
                                            <IonIcon slot="icon-only" icon={ellipsisHorizontal}>Options</IonIcon>
                                    </IonItemOption>
                                </IonItemOptions>
                        </IonItemSliding>
                    </IonItem>
                ))}
            </IonList>
            <ActionSheetComponent isOpen={isOpen} onDidDismiss={() => setIsOpen(false)} title={title} id={id}/>

        </>
    )
}


export default Groupes;
