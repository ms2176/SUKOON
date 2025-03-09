import React, { useState } from 'react';
import { doc, setDoc, collection, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './addRooms.css'; // Reuse the same CSS for styling
import { getFirestore } from 'firebase/firestore';

interface AddUnitProps {
  onClose: () => void;
}

const AddUnit: React.FC<AddUnitProps> = ({ onClose }) => {
  const [unitName, setUnitName] = useState('');
  const [hubCode, setHubCode] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); // Track upload state
  const [error, setError] = useState<string | null>(null); // Track validation errors

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
    if (!unitName || !hubCode) {
      alert('Please provide a unit name and hub code before adding.');
      return;
    }
  
    setIsUploading(true); // Start loading state
    setError(null); // Reset error state
  
    try {
      const db = getFirestore();
      const storage = getStorage(); // Initialize Firebase Storage
  
      // Step 1: Validate the hubCode by querying the userHubs collection
      const userHubsRef = collection(db, 'userHubs');
      const q = query(userHubsRef, where('hubCode', '==', hubCode)); // Query for the hubCode
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        setError('Invalid hub code. No tenant hub found with this code.');
        return;
      }
  
      // Step 2: Get the admin hub's document
      const selectedHome = localStorage.getItem('selectedHome')
        ? JSON.parse(localStorage.getItem('selectedHome') as string)
        : null;
  
      if (!selectedHome || !selectedHome.hubCode) {
        setError('No admin hub selected. Please select an admin hub first.');
        return;
      }
  
      // Query the userHubs collection to find the admin hub document with the matching hubCode
      const adminHubQuery = query(userHubsRef, where('hubCode', '==', selectedHome.hubCode));
      const adminHubSnapshot = await getDocs(adminHubQuery);
  
      if (adminHubSnapshot.empty) {
        setError('Admin hub not found. Please try again.');
        return;
      }
  
      const adminHubDoc = adminHubSnapshot.docs[0]; // There should only be one document with this hubCode
      const adminHubData = adminHubDoc.data();
  
      // Ensure the selected hub is an admin hub
      if (adminHubData.homeType !== 'admin') {
        setError('Selected hub is not an admin hub.');
        return;
      }
  
      // Step 3: Upload the image (if provided)
        let imageUrl = null;
        if (imageFile) {
        try {
            const storageRef = ref(storage, `unit-images/${hubCode}`); // Use hubCode as the file name
            await uploadBytes(storageRef, imageFile); // Upload the file
            imageUrl = await getDownloadURL(storageRef); // Get the download URL
            console.log('Image uploaded successfully. URL:', imageUrl); // Log the image URL
        } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
            setError('Failed to upload image. Please try again.');
            return;
        }
        }
  
      // Step 4: Create the new unit document
      const newUnitRef = doc(collection(db, 'userHubs')); // Create a new document in userHubs
      const unitData = {
        id: newUnitRef.id,
        unitName: unitName,
        hubCode: hubCode,
        image: imageUrl || defaultImageUrl, // Store the image URL (or fallback if no image)
      };
  
      await setDoc(newUnitRef, unitData);
  
      // Step 5: Update the admin hub's units array
      const updatedUnits = [...(adminHubData.units || []), hubCode]; // Add the new hubCode to the units array
  
      await updateDoc(adminHubDoc.ref, {
        units: updatedUnits,
      });
  
      // Reset the form fields
      setUnitName('');
      setHubCode('');
      setImageFile(null);
      setPreviewUrl(null);
  
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error adding unit:', error);
      setError('An error occurred while adding the unit. Please try again.');
    } finally {
      setIsUploading(false); // End loading state
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-header">Add a New Unit</h2>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="modal-body">
          <div className="form-control">
            <label>Unit Name</label>
            <input
              type="text"
              placeholder="Enter unit name"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              style={{ color: '#333' }}
            />
          </div>
          <div className="form-control">
            <label>Hub Code</label>
            <input
              type="text"
              placeholder="Enter hub code"
              value={hubCode}
              onChange={(e) => setHubCode(e.target.value)}
              style={{ color: '#333' }}
            />
          </div>
          <div className="form-control">
            <label>Upload Unit Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ color: '#333' }}
            />
            <img
              src={previewUrl || defaultImageUrl} // Use uploaded image or default
              alt="Unit Preview"
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
          {error && <p className="error-message">{error}</p>}
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isUploading} // Disable button while uploading
          >
            {isUploading ? 'Uploading...' : 'Add Unit'}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUnit;