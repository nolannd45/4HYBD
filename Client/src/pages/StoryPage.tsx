import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonImg, IonButton, IonIcon, IonProgressBar } from '@ionic/react';
import { addCircleOutline } from 'ionicons/icons';
import MessageService from '../services/MessageService';
import './Story.css';

type Story = {
    _id: string;
    imageUrl: string;
    user: string;
    latitude: number;
    longitude: number;
    // Ajoutez d'autres champs si nécessaire
};

const StoryPage: React.FC = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [mediaToShow, setMediaToShow] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [mediaQueue, setMediaQueue] = useState<Story[]>([]);
    const [userPosition, setUserPosition] = useState<{ latitude: number, longitude: number } | null>(null);
    const userId = JSON.parse(localStorage.getItem('user') || '{}')._id;
    const MAX_DISTANCE = 10; // Distance maximale en kilomètres

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const fetchedStories = await MessageService.getStories();
                setStories(fetchedStories);
            } catch (err) {
                setError('Failed to fetch stories');
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    useEffect(() => {
        if (mediaQueue.length > 0) {
            const firstStory = mediaQueue[0];
            setMediaToShow(firstStory.imageUrl);
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

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserPosition({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting user position:', error);
                }
            );
        }
    }, []);

    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRad = (x: number) => (x * Math.PI) / 180;

        const R = 6371; // Earth radius in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const filteredStories = stories.filter((story) => {
        if (userPosition) {
            const distance = haversineDistance(
                userPosition.latitude,
                userPosition.longitude,
                story.latitude,
                story.longitude
            );
            return distance <= MAX_DISTANCE;
        }
        return false;
    });

    const handleStoryPhotoClick = async () => {
        if (userPosition) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (event: any) => {
                const file = event.target.files[0];
                if (file) {
                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('user', userId);
                    formData.append('story', 'true'); // Indiquer que c'est une story
                    formData.append('latitude', userPosition.latitude.toString());
                    formData.append('longitude', userPosition.longitude.toString());

                    try {
                        await MessageService.sendMedia2(formData);
                        alert('Story posted successfully!');
                        // Refresh the stories after posting
                        const updatedStories = await MessageService.getStories();
                        setStories(updatedStories);
                    } catch (error) {
                        console.error("Failed to post story:", error);
                    }
                }
            };
            input.click();
        } else {
            alert('Unable to get your location. Please try again.');
        }
    };

    const handleImageClick = (story: Story) => {
        setMediaQueue([story]);
    };

    const closeMedia = () => {
        setMediaToShow(null);
        setMediaQueue([]);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Stories</IonTitle>
                    <div slot="end">
                        <IonButton onClick={handleStoryPhotoClick}>
                            <IonIcon icon={addCircleOutline} />
                        </IonButton>
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="story-grid">
                        {filteredStories.map((story, index) => (
                            <div className="story-grid-item" key={index} onClick={() => handleImageClick(story)}>
                                <IonImg src={story.imageUrl} alt={`Story from ${story.user}`} />
                            </div>
                        ))}
                    </div>
                )}
                {error && <p>{error}</p>}
                {mediaToShow && (
                    <div className="media-overlay" onClick={closeMedia}>
                        <IonProgressBar value={progress}></IonProgressBar>
                        <img src={mediaToShow} alt="Enlarged story" onError={() => console.error("Failed to load image: " + mediaToShow)} />
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default StoryPage;
