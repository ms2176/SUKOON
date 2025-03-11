import React, { useState, useEffect } from 'react';
import './dailyconfig.css';
import Slidebar from './slidebar';
import { Box, Button, Heading, Stack } from '@chakra-ui/react';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

interface DailyConfigProps {
  closeDailyConfig: () => void;
  currentDailyGoal: number;
  onGoalUpdate: (newGoal: number) => void;
}

const DailyConfig: React.FC<DailyConfigProps> = ({
  closeDailyConfig,
  currentDailyGoal,
  onGoalUpdate,
}) => {
  const [sliderValue, setSliderValue] = useState<number>(currentDailyGoal);

  useEffect(() => {
    // Ensure the slider shows the current saved value when the component loads
    setSliderValue(currentDailyGoal);
  }, [currentDailyGoal]);

  const updateDailyGoal = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);

      try {
        await updateDoc(userDocRef, {
          dailyGoal: sliderValue,
        });
        console.log('Daily goal updated successfully!');
        // Update the parent's state with the new goal value
        onGoalUpdate(sliderValue);
        closeDailyConfig();
      } catch (error) {
        console.error('Error updating daily goal:', error);
      }
    } else {
      console.error('No user is signed in.');
    }
  };

  return (
    <div>
      <Box className='dailyConfigCont'>
        <Stack bg={'transparent'} className='dailyConfigStack'>
          <Heading className='dailyConfigHead'>Edit daily goal:</Heading>
          {/* Pass initialValue so the slider starts at the current daily goal */}
          <Slidebar
            max={5}
            allowDecimals={true}
            initialValue={sliderValue}
            onChange={(value) => setSliderValue(value)}
          />
          <Button className='dailyconfigButton' onClick={updateDailyGoal}>
            Done
          </Button>
        </Stack>
      </Box>
    </div>
  );
};

export default DailyConfig;
