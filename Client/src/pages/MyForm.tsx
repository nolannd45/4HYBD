// src/components/MyForm.tsx
import React, { useState, useEffect } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonList, IonModal, IonSelect, IonSelectOption } from '@ionic/react';
import GroupService from '../services/GroupService';
import FriendService from '../services/FriendService';

interface MyFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
}

interface Friend {
  id: string;
  name: string;
}

const MyForm: React.FC<MyFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
  const [selectedFriends, setSelectedFriends] = useState<Array<string>>([]);
  const [friends, setFriends] = useState<Array<Friend>>([]);
  const [loading, setLoading] = useState(true);

  // Retrieve the user ID from localStorage safely
  const user = localStorage.getItem('user');
  const userId = user ? JSON.parse(user)._id : null;

  useEffect(() => {
    const fetchFriends = async () => {
      if (userId) {
        try {
          const userData = await FriendService.getFriend(userId);
          if (userData && Array.isArray(userData.listFriends)) {
            const friendIds = userData.listFriends;
            const friendDetailsPromises = friendIds.map((id: string) => FriendService.getFriend(id));
            const friendsData = await Promise.all(friendDetailsPromises);
            const formattedFriends = friendsData.map((friend) => ({ id: friend._id, name: friend.pseudo }));
            setFriends(formattedFriends);
          } else {
            console.error('Invalid data format:', userData);
          }
        } catch (error) {
          console.error('Error fetching friends:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFriends();
  }, [userId]);

  const handleInputChange = (e: CustomEvent) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFriendChange = (e: CustomEvent) => {
    const value = (e.target as HTMLIonSelectElement).value;
    setSelectedFriends(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      selectedFriends.push(userId)
      const response = await GroupService.createGroup(formData.name, selectedFriends);
      console.log(response);
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <form onSubmit={handleSubmit}>
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Titre</IonLabel>
            <IonInput
              name="name"
              value={formData.name}
              onIonChange={handleInputChange}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Friends</IonLabel>
            <IonSelect
              multiple
              value={selectedFriends}
              onIonChange={handleFriendChange}
            >
              {friends.map(friend => (
                <IonSelectOption key={friend.id} value={friend.id}>
                  {friend.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </IonList>
        <IonButton expand="block" type="submit">Submit</IonButton>
        <IonButton expand="block" color="medium" onClick={onClose}>Close</IonButton>
      </form>
    </IonModal>
  );
};

export default MyForm;
