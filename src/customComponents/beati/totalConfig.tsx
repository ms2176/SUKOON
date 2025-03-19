import { Box, Button, Heading, Stack } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import './totalConfig.css';
import './dailyconfig.css';
import Slidebar from './slidebar';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

interface TotalConfigProps {
    closeTotalConfig: () => void;
    updateTotalGoals: (newEnergyGoal: number, newCostGoal: number, newCarbonGoal: number) => void;
  }
  
  const TotalConfig: React.FC<TotalConfigProps> = ({ closeTotalConfig, updateTotalGoals }) => {
    const [totalEnergySavingGoal, setTotalEnergySavingGoal] = useState(0);
    const [totalCostGoal, setTotalCostGoal] = useState(0);
    const [totalCarbonSavingGoal, setTotalCarbonSavingGoal] = useState(0);
  
    useEffect(() => {
      const fetchTotalGoals = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const db = getFirestore();
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.totalEnergySavingGoal !== undefined) {
              setTotalEnergySavingGoal(data.totalEnergySavingGoal);
            }
            if (data.totalCostGoal !== undefined) {
              setTotalCostGoal(data.totalCostGoal);
            }
            if (data.totalCarbonSavingGoal !== undefined) {
              setTotalCarbonSavingGoal(data.totalCarbonSavingGoal);
            }
          }
        }
      };
      fetchTotalGoals();
    }, []);
  
    const handleUpdateTotalGoals = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, 'users', user.uid);
        try {
          await updateDoc(userDocRef, {
            totalEnergySavingGoal,
            totalCostGoal,
            totalCarbonSavingGoal,
          });
          console.log('Total goals updated successfully!');
          // Call the callback to update the state in BeatiMain
          updateTotalGoals(totalEnergySavingGoal, totalCostGoal, totalCarbonSavingGoal);
          closeTotalConfig();
        } catch (error) {
          console.error('Error updating total goals:', error);
        }
      } else {
        console.error('No user is signed in.');
      }
    };
  
    return (
      <div>
        <Box className='totalConfigCont'>
          <Stack className='totalConfigStack' spaceY={'5%'}>
            <Heading className='totalConfigHeader'>
              Total Goal Configuration
            </Heading>
  
            <Stack className='TCChildStack'>
              <Heading className='TCChildH'>
                Total Energy Conservation Goal:
              </Heading>
              <Slidebar
                initialValue={totalEnergySavingGoal}
                onChange={(value) => setTotalEnergySavingGoal(value)}
                max={2000}
                unit="KW"
                allowDecimals={false}
              />
            </Stack>
  
            <Stack className='TCChildStack'>
              <Heading className='TCChildH'>
                Total Cost Savings Goal:
              </Heading>
              <Slidebar
                unit="$"
                initialValue={totalCostGoal}
                onChange={(value) => setTotalCostGoal(value)}
                max={1000}
                allowDecimals={false}
              />
            </Stack>
  
            <Stack className='TCChildStack'>
              <Heading className='TCChildH'>
                Carbon Footprint Reduction Goal:
              </Heading>
              <Slidebar
                unit="kg"
                initialValue={totalCarbonSavingGoal}
                onChange={(value) => setTotalCarbonSavingGoal(value)}
                max={1500}
                allowDecimals={false}
              />
            </Stack>
  
            <Button className='dailyconfigButton' onClick={handleUpdateTotalGoals}>
              Done
            </Button>
          </Stack>
        </Box>
      </div>
    );
  };
  
  export default TotalConfig;