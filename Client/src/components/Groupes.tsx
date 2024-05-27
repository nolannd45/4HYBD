import React, { useEffect, useState } from "react";
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
import GroupService from '../services/GroupService';


type Groups = {
    _id: string;
    titre: string;
    lastMessage: string;
};


const Groupes: React.FC = () => {
    const [groups, setGroups] = useState<Groups[]>([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [id, setId] = React.useState(0);
    const userId = JSON.parse(localStorage.getItem('user') || '{}')._id;

    useEffect(() => {
    const fetchGroup = async ()=>{
        try{
            const groupsGet = await GroupService.getGroups(userId);
            setGroups(groupsGet);
        }catch(err){
            console.log("Failed get all groups");
        } 
    }
    
    // const createGroup = async()=>{

    //     try{
    //         const groupeCreate = await GroupService.createGroup("test",[userId]);
    //     }catch(err){
    //         console.log("failed create groupe");
    //     }
    // }
    
    
    // createGroup();
    fetchGroup();

}, []);

    return (
        <>
            <IonList>
                {groups.map((contact, key) => (
                    <IonItem key={key} >
                        <IonItemSliding>
                                <IonItem button routerLink={"groupes/" + userId + "/" + contact._id}>
                                    <IonLabel>
                                        <IonText color={"primary"}>
                                            {contact.titre}
                                        </IonText>
                                        <p>{contact.lastMessage}</p>
                                    </IonLabel>
                                </IonItem>
                                <IonItemOptions side="end" onClick={() => {
                                    setIsOpen(true)
                                    setTitle(contact.titre)
                                    setId(key)
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
