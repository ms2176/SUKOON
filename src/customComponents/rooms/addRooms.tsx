import React, { useState } from 'react';
import { doc, setDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage functions
import './addRooms.css';
import { getFirestore } from 'firebase/firestore';

interface AddRoomProps {
  onClose: () => void;
}

const AddRoom: React.FC<AddRoomProps> = ({ onClose }) => {
  const [roomName, setRoomName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); // Track upload state

  const defaultImageUrl = '@/images/noImage.png'; // Use a local fallback image

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

    setIsUploading(true); // Start loading state

    try {
      const db = getFirestore();
      const storage = getStorage(); // Initialize Firebase Storage

      // Create a reference to a new document with a unique auto-generated ID
      const newRoomRef = doc(collection(db, 'rooms'));

      let imageUrl = null;

      // Upload the image to Firebase Storage if a file is selected
      if (imageFile) {
        const storageRef = ref(storage, `room-images/${newRoomRef.id}`); // Use room ID as the file name
        await uploadBytes(storageRef, imageFile); // Upload the file
        imageUrl = await getDownloadURL(storageRef); // Get the download URL
      }

      // Prepare the room data
      const roomData = {
        roomId: newRoomRef.id, // Use the auto-generated ID as the roomId
        roomName: roomName,
        devices: [], // Initially empty array for devices
        hubCode: '333ttt', // Replace with the actual hubCode if dynamic
        pinned: false, // Default value for pinned
        image: imageUrl || defaultImageUrl, // Store the image URL (or fallback if no image)
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
      setIsUploading(false); // End loading state
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
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isUploading} // Disable button while uploading
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