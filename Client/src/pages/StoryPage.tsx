import React, { useEffect, useState, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonProgressBar, IonImg } from '@ionic/react';
import { addCircleOutline } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import { isPlatform } from '@ionic/react';
import MessageService from '../services/MessageService';
import './Story.css';

type Story = {
    _id: string;
    imageUrl: string;
    sender: string;
    latitude: number;
    longitude: number;
};

const StoryPage: React.FC = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [mediaToShow, setMediaToShow] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [mediaQueue, setMediaQueue] = useState<Story[]>([]);
    const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
    const [userPosition, setUserPosition] = useState<{ latitude: number, longitude: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
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
            const currentStory = mediaQueue[currentStoryIndex];
            setMediaToShow(currentStory.imageUrl);
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
                setProgress(0);
                if (currentStoryIndex < mediaQueue.length - 1) {
                    setCurrentStoryIndex(currentStoryIndex + 1);
                } else {
                    setMediaToShow(null);
                    setMediaQueue([]);
                }
            }, duration);

            return () => {
                clearInterval(progressInterval);
                clearTimeout(timeout);
            };
        }
    }, [mediaQueue, currentStoryIndex]);

    useEffect(() => {
        const requestPermissionsAndPosition = async () => {
            try {
                if (isPlatform('hybrid')) {
                    const permissions = await Geolocation.requestPermissions();
                    if (permissions.location === 'granted') {
                        const position = await Geolocation.getCurrentPosition();
                        setUserPosition({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    } else {
                        console.error('Permission to access location was denied');
                    }
                } else {
                    navigator.geolocation.getCurrentPosition((position) => {
                        setUserPosition({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    }, (error) => {
                        console.error('Error getting user position:', error);
                    });
                }
            } catch (error) {
                console.error('Error getting user position:', error);
            }
        };

        requestPermissionsAndPosition();
    }, []);

    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRad = (x: number) => (x * Math.PI) / 180;

        const R = 6371; // Earth radius in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon1 - lon2);
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

    // Grouper les stories par utilisateur
    const storiesByUser = filteredStories.reduce((acc, story) => {
        if (!acc[story.sender]) {
            acc[story.sender] = [];
        }
        acc[story.sender].push(story);
        return acc;
    }, {} as { [key: string]: Story[] });

    console.log("filteredStories: ", filteredStories);  // Log to debug
    console.log("storiesByUser: ", storiesByUser);      // Log to debug

    const handleStoryPhotoClick = async () => {
        if (userPosition) {
            // Ouvrir le sélecteur de fichiers sur le web
            fileInputRef.current?.click();
        } else {
            alert('Unable to get your location. Please try again.');
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && userPosition) {
            const formData = new FormData();
            formData.append('image', selectedFile);
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

    const handleImageClick = (user: string) => {
        const userStories = storiesByUser[user];
        setMediaQueue(userStories);
        setCurrentStoryIndex(0); // Reset to the first story of the user
    };

    const closeMedia = () => {
        setMediaToShow(null);
        setMediaQueue([]);
        setCurrentStoryIndex(0);
    };

    const handleNextStory = () => {
        if (currentStoryIndex < mediaQueue.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
        } else {
            closeMedia();
        }
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
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="story-grid">
                        {Object.keys(storiesByUser).map((user, index) => (
                            <div className="story-grid-item" key={index} onClick={() => handleImageClick(user)}>
                                <IonImg src={storiesByUser[user][0].imageUrl} alt={`Story from ${user}`} />
                            </div>
                        ))}
                    </div>
                )}
                {error && <p>{error}</p>}
                {mediaToShow && (
                    <div className="media-overlay" onClick={handleNextStory}>
                        <IonProgressBar value={progress}></IonProgressBar>
                        <img src={mediaToShow} alt="Enlarged story" onError={() => console.error("Failed to load image: " + mediaToShow)} />
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default StoryPage;
