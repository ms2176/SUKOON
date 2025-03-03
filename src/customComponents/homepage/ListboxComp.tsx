import React, { useState, useEffect } from 'react';
import { Listbox, ListboxItem } from '@heroui/react';
import { ListboxWrapper } from './ListboxWrapper.tsx'; // Adjust the path as needed
import { getAuth, onAuthStateChanged, User } from "firebase/auth"; // Import User type
import { getFirestore, collection, query, where, getDocs, QueryDocumentSnapshot } from "firebase/firestore"; // Import QueryDocumentSnapshot

interface ListboxCompProps {
  onSelectHome: (homeName: string) => void; // Callback to pass selected home name
}

const ListboxComp: React.FC<ListboxCompProps> = ({ onSelectHome }) => {
  const [selectedHome, setSelectedHome] = useState<string | null>(null);
  const [homes, setHomes] = useState<{ [key: string]: string }>({}); // State to store hub names

  // Fetch the user's hubs when the component mounts
  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => { // Explicitly type the user parameter
      if (user) {
        const userId = user.uid;

        // Query the `hubs` collection for hubs associated with the user
        const hubsRef = collection(db, "userHubs");
        const q = query(hubsRef, where("userId", "==", userId));

        try {
          const querySnapshot = await getDocs(q);
          const homesData: { [key: string]: string } = {};

          let index = 0; // Track the index manually
          querySnapshot.forEach((doc: QueryDocumentSnapshot) => { // Use a single parameter
            const data = doc.data();
            homesData[`Home${index + 1}`] = data.homeName; // Use a unique key for each home
            index++; // Increment the index
          });

          setHomes(homesData); // Update the state with the fetched hubs
        } catch (error) {
          console.error("Error fetching user hubs:", error);
        }
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  const handleSelection = (key: string) => {
    const homeName = homes[key]; // Get the home name from the homes state
    setSelectedHome(homeName);
    onSelectHome(homeName); // Pass the selected home name to the parent
  };

  return (
    <div>
      <ListboxWrapper>
        <Listbox aria-label="Actions" onAction={(key) => handleSelection(key as string)}>
          {/* Dynamically generate ListboxItem components */}
          {Object.entries(homes).map(([key, value]) => (
            <ListboxItem key={key}>{value}</ListboxItem>
          ))}
        </Listbox>
      </ListboxWrapper>
    </div>
  );
};

export default ListboxComp;