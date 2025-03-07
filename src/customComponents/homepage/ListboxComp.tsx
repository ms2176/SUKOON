import React, { useState, useEffect } from 'react';
import { Listbox, ListboxItem } from '@heroui/react';
import { ListboxWrapper } from './ListboxWrapper.tsx'; // Adjust the path as needed
import { getAuth, onAuthStateChanged, User } from "firebase/auth"; // Import User type
import { getFirestore, collection, query, where, getDocs, QueryDocumentSnapshot } from "firebase/firestore"; // Import QueryDocumentSnapshot

interface Home {
  homeName: string;
  homeType: string;
  hubCode: string;
}

interface ListboxCompProps {
  onSelectHome: (homeName: string) => void; // Callback to pass selected home name
  homes: Home[]; // Add the homes prop
}

const ListboxComp: React.FC<ListboxCompProps> = ({ onSelectHome, homes }) => {
  const [selectedHome, setSelectedHome] = useState<string | null>(null);

  // Convert the homes array to a key-value object
  const homesData = homes.reduce((acc, home, index) => {
    acc[`Home${index + 1}`] = home.homeName;
    return acc;
  }, {} as { [key: string]: string });

  const handleSelection = (key: string) => {
    const homeName = homesData[key]; // Get the home name from the homesData object
    setSelectedHome(homeName);
    onSelectHome(homeName); // Pass the selected home name to the parent
  };

  return (
    <div>
      <ListboxWrapper>
        <Listbox aria-label="Actions" onAction={(key) => handleSelection(key as string)}>
          {/* Dynamically generate ListboxItem components */}
          {Object.entries(homesData).map(([key, value]) => (
            <ListboxItem key={key}>{value}</ListboxItem>
          ))}
        </Listbox>
      </ListboxWrapper>
    </div>
  );
};

export default ListboxComp;