import React, { useState } from 'react';
import { doc, setDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './addRooms.css';
import { getFirestore } from 'firebase/firestore';
import NoImage from '@/images/noImage.png';
import { Box } from '@chakra-ui/react';
import { VscClose } from 'react-icons/vsc';

interface AddRoomProps {
  onClose: () => void;
}

const AddRoom: React.FC<AddRoomProps> = ({ onClose }) => {
  const [roomName, setRoomName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleImageError = () => {
    setPreviewUrl(NoImage);
  };

  const handleSubmit = async () => {
    if (!roomName) {
      alert('Please provide a room name before adding.');
      return;
    }

    setIsUploading(true);

    try {
      const db = getFirestore();
      const storage = getStorage();

      // Get the selected home from localStorage
      const selectedHome = localStorage.getItem('selectedHome')
        ? JSON.parse(localStorage.getItem('selectedHome') as string)
        : null;

      if (!selectedHome || !selectedHome.hubCode) {
        alert('No home selected. Please select a home first.');
        return;
      }

      // Create a reference to a new document with a unique auto-generated ID
      const newRoomRef = doc(collection(db, 'rooms'));

      let imageUrl = null;

      // Upload the image to Firebase Storage if a file is selected
      if (imageFile) {
        const storageRef = ref(storage, `room-images/${newRoomRef.id}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Prepare the room data
      const roomData = {
        roomId: newRoomRef.id,
        roomName: roomName,
        devices: [],
        hubCode: selectedHome.hubCode,
        pinned: false,
        image: imageUrl || NoImage,
      };

      // Add the new room document to Firestore
      await setDoc(newRoomRef, roomData);

      // Reset the form fields
      setRoomName('');
      setImageFile(null);
      setPreviewUrl(null);

      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error adding room:', error);
      alert('An error occurred while adding the room. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{width: '80%', height: 'auto', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'transparent'}} >
      <div className="modal-container">
        <h2 className="modal-header">Add a New Room</h2>
        <Box bg={'transparent'} pos={'absolute'} right={'5%'} top={'5%'}>
          <VscClose color="#21334a" style={{ background: 'transparent' }} onClick={onClose} />
        </Box>
        <div className="modal-body">
          <div className="form-control">
            <label>Room Name</label>
            <input
              type="text"
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              style={{ color: '#333' }}
            />
          </div>
          <div className="form-control">
            <label>Upload Room Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ color: '#333' }}
            />
            <img
              src={previewUrl || NoImage}
              alt="Room Preview"
              onError={handleImageError}
              style={{
                width: '100%',
                maxHeight: '200px',
                marginTop: '10px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Add Room'}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;