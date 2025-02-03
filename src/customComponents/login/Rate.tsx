import React from 'react';
import {
  Box,
  Heading,
  HStack,
  Icon,
  RatingGroup
} from '@chakra-ui/react';
"use client"

import { Button, Stack } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field } from "@/components/ui/field"
import Rating from "react-rating";
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  rating: z.number({ required_error: "Rating is required" }).min(1).max(5),
})

type FormValues = z.infer<typeof formSchema>

import { FiSettings, FiArrowLeft} from 'react-icons/fi';


const Rate = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = handleSubmit((data) => console.log(data))

  return (
    <Box minH="100vh" bg="gray">
    <Box p={0} m={0}>
      <Box 
      as="header" 
      bgColor="white"
      p={4}
      textAlign="center"
      position="relative"
      height="100vh">
      
      
        <HStack justify="space-evenly">
          <Icon boxSize={6} color={'black'}>
                <FiArrowLeft />
            </Icon>
          <Heading size="lg" flex="1" color={'black'}>
            Rate Us
          </Heading>
          <Icon boxSize={6} >
                <FiSettings />
            </Icon>        
        </HStack>

        <form onSubmit={onSubmit}>
        <Stack gap="4" align="flex-start">
        <Field
          label="Rating"
          invalid={!!errors.rating}
          errorText={errors.rating?.message}
        >
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <Rating
                name={field.name}
                value={field.value}
                onValueChange={({ value }) => field.onChange(value)}
              />
            )}
          />
        </Field>
        <Button size="sm" type="submit">
          Submit
        </Button>
      </Stack>
      </form>

      </Box>
      </Box>
      
      
    </Box>
  );
};


export default Rate;
