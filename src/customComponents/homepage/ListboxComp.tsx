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
  // Convert homes to items with unique keys
  const homeItems = homes.map((home, index) => ({
    key: `home-${index}-${home.hubCode}`, // Unique key based on hubCode
    name: home.homeName
  }));

  const handleSelection = (key: string) => {
    const selected = homeItems.find(item => item.key === key);
    if (selected) onSelectHome(selected.name);
  };

  return (
    <ListboxWrapper>
      <Listbox aria-label="Homes list" onAction={handleSelection}>
        {homeItems.map((item) => (
          <ListboxItem key={item.key}>{item.name}</ListboxItem>
        ))}
      </Listbox>
    </ListboxWrapper>
  );
};

export default ListboxComp;