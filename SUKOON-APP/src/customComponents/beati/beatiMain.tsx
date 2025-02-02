import { Box, Button, Heading, HStack, Stack } from '@chakra-ui/react'
import React from 'react'
import './beatiMain.css'
import CircularProgress from './circularProgress'
import Roses from './gardenflowers/roses.png'
import NormalProgress from './normalProgress'
import { FaPen } from "react-icons/fa";
import { PiPottedPlantFill } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';

const BeatiMain = () => {

    const progressTotal = 25;
    const progressDaily = 60;
    const navigate = useNavigate(); // Initialize useNavigate

    const goToGreenhouse = () => {
        navigate('/myGreenhouse')
    }

  return (
    <div className='beatiCont'>

        <Box className='beatiTop'>
            <Heading bg={'transparent'} margin={'25px 0px 25px 15px'} fontSize={'250%'} className='beatiHead'>
                Be'ati
            </Heading>
        </Box>

        <Stack className='beatiContentCont' spaceY={3}>

            <Box className='dailyGoal' spaceY={3}>
                <Stack bg={'transparent'} className='dailyGoalStack'>
                    <Heading bg={'transparent'} color={'#3627ba'} mt={'10px'}>
                        Daily Goal
                    </Heading>

                    <NormalProgress progress={progressDaily}/>
                    <Heading bg={'transparent'} color={'#3627ba'}>
                        {progressDaily}%
                    </Heading>

                    <Box className='editBox'>
                        <FaPen style={{background: 'transparent', margin: '10px 10px 10px 10px'}} color='#3627ba' size={'70%'}/>

                    </Box>
                </Stack>

            </Box>

            <CircularProgress progress={progressTotal} size={250} strokeWidth={15} color="#76c7c0" image={Roses}/>

            <HStack className='buttonCont' spaceX={3}>
                <Button className='myCollection' onClick={goToGreenhouse}>
                    <PiPottedPlantFill style={{background: 'transparent', margin: '10px 10px 10px 10px'}} color='#6cce58' size={'170px'}/>
                </Button>
                <Button className='editGoal'>
                    <FaPen style={{background: 'transparent',  margin: '10px 10px 10px 10px'}} color='#3627ba' size={'170px'}/>

                </Button>
            </HStack>
            
        </Stack>
      
    </div>
  )
}

export default BeatiMain
