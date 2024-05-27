// src/components/MyForm.tsx
import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonList, IonModal } from '@ionic/react';

interface MyFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
}

const MyForm: React.FC<MyFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '' });

  const handleInputChange = (e: CustomEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <form onSubmit={handleSubmit}>
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Name</IonLabel>
            <IonInput
              name="name"
              value={formData.name}
              onIonChange={handleInputChange}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              name="email"
              type="email"
              value={formData.email}
              onIonChange={handleInputChange}
              required
            />
          </IonItem>
        </IonList>
        <IonButton expand="block" type="submit">Submit</IonButton>
        <IonButton expand="block" color="medium" onClick={onClose}>Close</IonButton>
      </form>
    </IonModal>
  );
};

export default MyForm;
