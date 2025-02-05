import React, { useState } from 'react';
import { Listbox, ListboxItem } from '@heroui/react';
import { ListboxWrapper } from './ListboxWrapper.tsx'; // Adjust the path as needed

interface ListboxCompProps {
  onSelectHome: (homeName: string) => void; // Callback to pass selected home name
}

// Define the Homes object
const Homes = {
  Home1: 'Myhome1',
  Home2: 'Myhome2',
  Home3: 'Myhome3',
  Home4: 'Myhome4',
  Home5: 'Myhome5',
  Home6: 'Myhome6',
};

const ListboxComp: React.FC<ListboxCompProps> = ({ onSelectHome }) => {
  const [selectedHome, setSelectedHome] = useState<string | null>(null);

  const handleSelection = (key: string) => {
    const homeName = Homes[key as keyof typeof Homes]; // Get the home name from the Homes object
    setSelectedHome(homeName);
    onSelectHome(homeName); // Pass the selected home name to the parent
  };

  return (
    <div>
      <ListboxWrapper>
        <Listbox aria-label="Actions" onAction={(key) => handleSelection(key as string)}>
          {/* Dynamically generate ListboxItem components */}
          {Object.entries(Homes).map(([key, value]) => (
            <ListboxItem key={key}>{value}</ListboxItem>
          ))}
        </Listbox>
      </ListboxWrapper>
    </div>
  );
};

export default ListboxComp;