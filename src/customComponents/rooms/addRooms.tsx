import React, { useState } from 'react';
import './addRooms.css';

interface AddRoomProps {
  onClose: () => void;
  onAddRoom: (newRoom: { name: string; image?: string }) => void; // Callback to update the UI
}

const AddRoom: React.FC<AddRoomProps> = ({ onClose, onAddRoom }) => {
  const [roomName, setRoomName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const defaultImageUrl = 'https://via.placeholder.com/150?text=Room+Image'; // Default placeholder image

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

  const handleSubmit = () => {
    if (!roomName) {
      alert('Please provide a room name before adding.');
      return;
    }

    // Pass the room name and image URL (if available) to the parent component
    onAddRoom({
      name: roomName,
      image: previewUrl || undefined, // Pass the image URL if available
    });

    setRoomName(''); // Reset the fields
    setImageFile(null);
    setPreviewUrl(null);
    onClose(); // Close the modal
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