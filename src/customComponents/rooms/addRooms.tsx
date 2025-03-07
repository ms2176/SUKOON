import React, { useState } from 'react';
import { doc, setDoc, collection } from 'firebase/firestore';
import './addRooms.css';
import { getFirestore, query, where, getDocs, addDoc } from 'firebase/firestore';

interface AddRoomProps {
  onClose: () => void;
}

const AddRoom: React.FC<AddRoomProps> = ({ onClose }) => {
  const [roomName, setRoomName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const defaultImageUrl = '/path/to/local/fallback-image.png'; // Use a local fallback image

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Generate a preview URL for the selected image
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleImageError = () => {
    // Fallback to default image if uploaded image fails to load
    setPreviewUrl(defaultImageUrl);
  };

  const handleSubmit = async () => {
    if (!roomName) {
      alert('Please provide a room name before adding.');
      return;
    }

    try {
      const db = getFirestore();
      // Create a reference to a new document with a unique auto-generated ID
      const newRoomRef = doc(collection(db, 'rooms'));

      // Prepare the room data
      const roomData = {
        roomId: newRoomRef.id, // Use the auto-generated ID as the roomId
        roomName: roomName,
        devices: [], // Initially empty array for devices
        hubCode: '333ttt', // Replace with the actual hubCode if dynamic
        pinned: false, // Default value for pinned
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
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-header">Add a New Room</h2>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
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
              src={previewUrl || defaultImageUrl} // Use uploaded image or default
              alt="Room Preview"
              onError={handleImageError} // Handle image load failure
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
          <button className="btn btn-primary" onClick={handleSubmit}>
            Add Room
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