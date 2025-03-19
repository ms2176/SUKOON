import { Box, Button, Heading, HStack, Stack } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import './beatiMain.css';
import CircularProgress from './circularProgress';
import GreenhouseC from '@/images/greenhouseCartoon.jpg';
import NormalProgress from './normalProgress';
import { FaPen } from 'react-icons/fa';
import { PiPottedPlantFill } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import Dailyconfig from './dailyconfig';
import TotalConfig from './totalConfig';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import StaticGoalDropdown from './StaticGoalDropdown';

const BeatiMain = () => {
  const navigate = useNavigate();
  const [dailyGoal, setDailyGoal] = useState(0);
  const [dailyGoalProgress, setDailyGoalProgress] = useState(0);
  const [totalEnergySavingGoal, setTotalEnergySavingGoal] = useState(0);
  const [totalCostGoal, setTotalCostGoal] = useState(0);
  const [totalCarbonSavingGoal, setTotalCarbonSavingGoal] = useState(0);
  const [totalEnergySavingProgress, setTotalEnergySavingProgress] = useState(0);
  const [totalCostGoalProgress, setTotalCostGoalProgress] = useState(0);
  const [totalCarbonSavingGoalProgress, setTotalCarbonSavingGoalProgress] = useState(0);
  const [isDailyVisible, setIsDailyVisible] = useState(false);
  const [isTotalVisible, setIsTotalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Total Energy Conservation Goal');

  const [selectedProgress, setSelectedProgress] = useState({
    value: 0,
    color: '#76c7c0', // Default color
  });

  const goToGreenhouse = () => {
    navigate('/myGreenhouse');
  };

  const toggleDailyConfig = () => {
    setIsDailyVisible(!isDailyVisible);
  };

  const toggleTotalConfig = () => {
    setIsTotalVisible(!isTotalVisible);
  };

  // Callback function to update total goals in BeatiMain
  const updateTotalGoals = (newEnergyGoal: number, newCostGoal: number, newCarbonGoal: number) => {
    setTotalEnergySavingGoal(newEnergyGoal);
    setTotalCostGoal(newCostGoal);
    setTotalCarbonSavingGoal(newCarbonGoal);
  };

  

  // Handle selection from StaticGoalDropdown
  const handleDropdownSelect = (selectedOption: string) => {
    let progress = 0;
    let color = '#76c7c0'; 

    switch (selectedOption) {
      case 'Total Energy Conservation Goal':
        progress = totalEnergySavingProgress;
        color = '#F7567C'; 
        break;
      case 'Total Cost Goal':
        progress = totalCostGoalProgress;
        color = '#89AAE6'; 
        break;
      case 'Total Carbon Savings Goal':
        progress = totalCarbonSavingGoalProgress;
        color = '#6cc358'; 
        break;
      default:
        break;
    }

    setSelectedProgress({ value: progress, color });
    setSelectedOption(selectedOption);

  };

  const getProgressDetails = () => {
    switch (selectedOption) {
      case 'Total Energy Conservation Goal':
        return { value: totalEnergySavingProgress, color: '#F7567C' };
      case 'Total Cost Goal':
        return { value: totalCostGoalProgress, color: '#89AAE6' };
      case 'Total Carbon Savings Goal':
        return { value: totalCarbonSavingGoalProgress, color: '#6cc358' };
      default:
        return { value: 0, color: '#76c7c0' };
    }
  };

  const options = [
    { label: 'Total Energy Conservation Goal', value: `${totalEnergySavingGoal} kW` },
    { label: 'Total Cost Goal', value: `$${totalCostGoal}` },
    { label: 'Total Carbon Savings Goal', value: `${totalCarbonSavingGoal} kg` },
  ];
  
  useEffect(() => {
    const fetchUserGoals = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.dailyGoal !== undefined) setDailyGoal(data.dailyGoal);
          if (data.dailyGoalProgress !== undefined) setDailyGoalProgress(data.dailyGoalProgress);
          if (data.totalEnergySavingGoal !== undefined) setTotalEnergySavingGoal(data.totalEnergySavingGoal);
          if (data.totalCostGoal !== undefined) setTotalCostGoal(data.totalCostGoal);
          if (data.totalCarbonSavingGoal !== undefined) setTotalCarbonSavingGoal(data.totalCarbonSavingGoal);
          if (data.totalEnergySavingProgress !== undefined) setTotalEnergySavingProgress(data.totalEnergySavingProgress);
          if (data.totalCostGoalProgress !== undefined) setTotalCostGoalProgress(data.totalCostGoalProgress);
          if (data.totalCarbonSavingGoalProgress !== undefined) setTotalCarbonSavingGoalProgress(data.totalCarbonSavingGoalProgress);
        }
      }
    };
    fetchUserGoals();
    handleDropdownSelect(options[0].label); // Use the options array here
  }, []);

  return (
    <div className='beatiCont'>
      {isDailyVisible && (
        <Dailyconfig
          currentDailyGoal={dailyGoal}
          onGoalUpdate={(newGoal) => setDailyGoal(newGoal)}
          closeDailyConfig={toggleDailyConfig}
        />
      )}
      {isTotalVisible && (
        <TotalConfig
          closeTotalConfig={toggleTotalConfig}
          updateTotalGoals={updateTotalGoals}
        />
      )}

      <Box className='beatiTop'>
        <Heading
          bg={'transparent'}
         margin={'25px 0px 35px 15px'}
          fontSize={'250%'}
          className='beatiHead'
        >
          Be'ati
        </Heading>
      </Box>

      <Stack className='beatiContentCont' spaceY={3} style={{ marginTop: '80px' }}>
        <Box className='dailyGoal' spaceY={3}>
          <Stack bg={'transparent'} className='dailyGoalStack'>
            <Heading bg={'transparent'} color={'#3627ba'} mt={'10px'}>
              Daily Goal
            </Heading>

            <div style={{ width: '80%', margin: '0 auto' }}>
              <NormalProgress progress={dailyGoalProgress} />
            </div>

            <Heading bg={'transparent'} color={'#3627ba'}>
              {dailyGoal} kWh
            </Heading>
            <Box className='editBox' onClick={toggleDailyConfig}>
              <FaPen
                style={{ background: 'transparent', margin: '10px' }}
                color='#3627ba'
                size={'70%'}
              />
            </Box>
          </Stack>
        </Box>

        <div style={{ width: '80%', marginTop: '5px', background: 'transparent' }}>
          <StaticGoalDropdown
            totalEnergySavingGoal={totalEnergySavingGoal}
            totalCostGoal={totalCostGoal}
            totalCarbonSavingGoal={totalCarbonSavingGoal}
            onSelect={handleDropdownSelect}
          />
        </div>

        <CircularProgress
            progress={getProgressDetails().value}          
            size={250}
          strokeWidth={15}
          color={getProgressDetails().color}
          image={GreenhouseC}
          showPercentage={true}
          onImageClick={goToGreenhouse}
        
          
        />

        <HStack className='buttonCont' spaceX={3}>
          <Button className='myCollection' onClick={goToGreenhouse}>
            <PiPottedPlantFill
              style={{ background: 'transparent', margin: '10px' }}
              color='#6cce58'
              size={'170px'}
            />
          </Button>
          <Button className='editGoal' onClick={toggleTotalConfig}>
            <FaPen
              style={{ background: 'transparent', margin: '10px' }}
              color='#3627ba'
              size={'170px'}
            />
          </Button>
        </HStack>
      </Stack>
    </div>
  );
};

export default BeatiMain;