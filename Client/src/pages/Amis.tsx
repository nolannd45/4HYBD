import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonIcon, IonProgressBar, IonSearchbar } from '@ionic/react';
import { cameraOutline, addOutline } from 'ionicons/icons';
import FriendService from '../services/FriendService';
import MessageService from '../services/MessageService';
import { useHistory } from 'react-router-dom';
import './Amis.css'; // Assurez-vous d'importer le fichier CSS

type Friend = {
    _id: string;
    pseudo: string;
    // Ajoutez d'autres champs si nécessaire
};

type Media = {
    _id: string;
    vu: boolean;
    imageUrl: string;
    // Ajoutez d'autres champs si nécessaire
};

const Amis: React.FC = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Friend[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [mediaStatus, setMediaStatus] = useState<{ [key: string]: boolean }>({});
    const [mediaToShow, setMediaToShow] = useState<string | null>(null);
    const [mediaQueue, setMediaQueue] = useState<Media[]>([]);
    const history = useHistory();
    const userId = JSON.parse(localStorage.getItem('user') || '{}')._id;

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const user = await FriendService.getUser(userId);
                const friendPromises = user.listFriends.map((friendId: string) => FriendService.getFriend(friendId));
                const friendsData = await Promise.all(friendPromises);
                setFriends(friendsData);

                // Fetch media status for each friend
                const statusPromises = friendsData.map((friend: Friend) => MessageService.getMediaStatus(userId, friend._id));
                const statuses = await Promise.all(statusPromises);
                const statusMap: { [key: string]: boolean } = {};
                statuses.forEach((status, index) => {
                    statusMap[friendsData[index]._id] = status.some((media: Media) => !media.vu);
                });
                setMediaStatus(statusMap);
            } catch (err) {
                setError('Failed to fetch friends');
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [userId]);

    useEffect(() => {
        if (mediaQueue.length > 0) {
            const firstUnseen = mediaQueue[0];
            setMediaToShow(firstUnseen.imageUrl);
            setProgress(0);
            const startTime = Date.now();
            const duration = 2000; // 10 secondes

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

    const openChat = (friendId: string) => {
        history.push(`/app/chat/${userId}/${friendId}`);
    };

    const handlePhotoClick = async (friendId: string) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (event: any) => {
            const file = event.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('user', userId);
                formData.append('receiver', friendId);
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

    const handleFriendClick = async (friendId: string) => {
        if (mediaStatus[friendId]) {
            const unseenMedia = await MessageService.getMediaStatus(userId, friendId);
            setMediaQueue(unseenMedia.filter((media: Media) => !media.vu));
        } else {
            openChat(friendId);
        }
    };

    const closeMedia = async () => {
        setMediaToShow(null);
        setMediaQueue([]);
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length > 2) {
            try {
                const results = await FriendService.searchUsers(query);
                setSearchResults(results);
            } catch (error) {
                console.error("Failed to search users:", error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const addFriend = async (friendId: string) => {
        try {
            console.log(friendId);
            await FriendService.addFriend(friendId);
            const newFriend = await FriendService.getFriend(friendId);
            setFriends(prevFriends => [...prevFriends, newFriend]);
            alert('Friend added successfully!');
        } catch (error) {
            console.error("Failed to add friend:", error);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Amis</IonTitle>
                </IonToolbar>
                <IonSearchbar 
                    value={searchQuery} 
                    onIonInput={(e: any) => handleSearch(e.target.value)} 
                    placeholder="Search for a user"
                />
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Amis</IonTitle>
                    </IonToolbar>
                </IonHeader>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <IonList>
                            {friends.map((friend, index) => (
                                <IonItem
                                    key={index}
                                    button
                                    onClick={() => handleFriendClick(friend._id)}
                                    className={mediaStatus[friend._id] ? 'new-media' : ''}
                                >
                                    <IonLabel>{friend.pseudo}</IonLabel>
                                    <IonButton
                                        slot="end"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePhotoClick(friend._id);
                                        }}
                                    >
                                        <IonIcon icon={cameraOutline} />
                                    </IonButton>
                                </IonItem>
                            ))}
                        </IonList>
                        <IonList>
                            {searchResults.map((user, index) => (
                                <IonItem key={index}>
                                    <IonLabel>{user.pseudo}</IonLabel>
                                    <IonButton
                                        slot="end"
                                        onClick={() => addFriend(user._id)}
                                    >
                                        <IonIcon icon={addOutline} />
                                    </IonButton>
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

export default Amis;
