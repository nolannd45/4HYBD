import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonIcon, IonProgressBar, IonSearchbar, IonText } from '@ionic/react';
import { cameraOutline, peopleOutline } from 'ionicons/icons';
import GroupService from '../services/GroupService';
import MessageService from '../services/MessageService';
import { useHistory } from 'react-router-dom';
import './Chat.css'; // Assurez-vous d'importer le fichier CSS

type Group = {
    _id: string;
    titre: string;
    lastMessage: string;
};

type Media = {
    _id: string;
    vu: boolean;
    imageUrl: string;
    // Ajoutez d'autres champs si nécessaire
};

const Groupes: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Group[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [mediaStatus, setMediaStatus] = useState<{ [key: string]: boolean }>({});
    const [mediaToShow, setMediaToShow] = useState<string | null>(null);
    const [mediaQueue, setMediaQueue] = useState<Media[]>([]);
    const history = useHistory();
    const userId = JSON.parse(localStorage.getItem('user') || '{}')._id;

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const groupsData = await GroupService.getGroups(userId);
                setGroups(groupsData);

                // Fetch media status for each group
                const statusPromises = groupsData.map((group: Group) => MessageService.getMediaStatus(userId, group._id));
                const statuses = await Promise.all(statusPromises);
                const statusMap: { [key: string]: boolean } = {};
                statuses.forEach((status, index) => {
                    statusMap[groupsData[index]._id] = status.some((media: Media) => !media.vu);
                });
                setMediaStatus(statusMap);
            } catch (err) {
                setError('Failed to fetch groups');
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [userId]);

    useEffect(() => {
        if (mediaQueue.length > 0) {
            const firstUnseen = mediaQueue[0];
            setMediaToShow(firstUnseen.imageUrl);
            setProgress(0);
            const startTime = Date.now();
            const duration = 10000; // 10 secondes

            const progressInterval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const newProgress = Math.min(elapsedTime / duration, 1);
                setProgress(newProgress);

                if (newProgress >= 1) {
                    clearInterval(progressInterval);
                }
            }, 100);

            const timeout = setTimeout(async () => {
                clearInterval(progressInterval);
                await MessageService.markMediaAsSeen(firstUnseen._id);
                setMediaToShow(null);
                setMediaQueue(queue => queue.slice(1)); // Remove the first media from the queue
                setProgress(0);
            }, duration);

            return () => {
                clearInterval(progressInterval);
                clearTimeout(timeout);
            };
        }
    }, [mediaQueue]);

    const openGroupChat = (groupId: string) => {
        history.push(`/app/groupes/${userId}/${groupId}`);
    };

    const handleGroupPhotoClick = async (groupId: string) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (event: any) => {
            const file = event.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('user', userId);
                formData.append('receiver', groupId);
                formData.append('story', 'false'); // Ajoutez d'autres champs si nécessaire

                try {
                    await MessageService.sendMedia2(formData);
                    alert('Photo sent successfully!');
                } catch (error) {
                    console.error("Failed to send photo:", error);
                }
            }
        };
        input.click();
    };

    const handleGroupClick = async (groupId: string) => {
        if (mediaStatus[groupId]) {
            const unseenMedia = await MessageService.getMediaStatus(userId, groupId);
            setMediaQueue(unseenMedia.filter((media: Media) => !media.vu));
        } else {
            openGroupChat(groupId);
        }
    };

    const closeMedia = async () => {
        setMediaToShow(null);
        setMediaQueue([]);
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Groupes</IonTitle>
                </IonToolbar>

            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Groupes</IonTitle>
                    </IonToolbar>
                </IonHeader>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <IonList>
                            {groups.map((group, index) => (
                                <IonItem
                                    key={index}
                                    button
                                    onClick={() => handleGroupClick(group._id)}
                                    className={mediaStatus[group._id] ? 'new-media' : ''}
                                >
                                    <IonIcon icon={peopleOutline} slot="start" />
                                    <IonLabel>
                                        <IonText color={"primary"}>
                                            {group.titre}
                                        </IonText>
                                        <p>{group.lastMessage}</p>
                                    </IonLabel>

                                </IonItem>
                            ))}
                        </IonList>
                    </>
                )}
                {error && <p>{error}</p>}
                {mediaToShow && (
                    <div className="media-overlay" onClick={closeMedia}>
                        <IonProgressBar value={progress}></IonProgressBar>
                        <img src={mediaToShow} alt="Unseen media" onError={() => console.error("Failed to load image: " + mediaToShow)} />
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Groupes;
