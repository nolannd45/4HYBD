import React, {FC} from 'react';
import {IonActionSheet, useIonRouter} from "@ionic/react";

interface ActionSheetProps {
    isOpen: any;
    onDidDismiss: () => void;
    title: string;
    id: number;
}

const ActionSheetComponent: FC<ActionSheetProps> = ({isOpen, onDidDismiss, title, id}) => {

    const navigate = useIonRouter();
    const handleOpenInformationGroupes = () => {
        navigate.push('/app/informations', 'forward', 'push')
    };

    return (
        <IonActionSheet
            isOpen={isOpen}
            header={title}
            buttons={[
                {
                    text: 'Infos du groupe',
                    handler: () => {
                        handleOpenInformationGroupes();
                    },
                },
                {
                    text: 'Quitter le groupe',
                    role: 'destructive',
                    data: {
                        action: 'delete',
                    },
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    data: {
                        action: 'cancel',
                    },
                },
            ]}
            onDidDismiss={onDidDismiss}
        />
    )
}

export default ActionSheetComponent;
