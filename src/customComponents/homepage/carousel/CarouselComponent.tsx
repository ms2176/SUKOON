import { Carousel } from "flowbite-react";
import { Box, Button, Heading, HStack, Stack } from "@chakra-ui/react";
import AdminHub from "./images/adminhub.png";
import TenantHub from "./images/tenanthub.png";
import Pin from "./images/pin.png";
import Gendata from "./images/gendata.png";
import Rooms from "./images/room.png";
import AC from "./images/ac.png";
import Beati from "./images/beati.png";
import GH from "./images/greenhouse.png";
import Stats from "./images/stats.png";
import ACC from "./images/ACC.png";
import CB from "./images/CB.png";
import { IoCloseCircleSharp } from "react-icons/io5";
import React from "react";

interface CCProps {
  onClose: () => void;
}

const CarouselComponent: React.FC<CCProps> = ({ onClose }) => {
  return (
    <div
      className="relative w-full h-full"
      style={{
        background: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        position={"absolute"}
        top={"5%"}
        right={"5%"}
        width={"auto"}
        height={"auto"}
        zIndex={99999}
        bg={"transparent"}
        onClick={onClose}
      >
        <IoCloseCircleSharp
          style={{
            background: "transparent",
            color: "#43eb7f",
            fontSize: "30px",
          }}
        />
      </Button>
      <Carousel
        slide={false}
        indicators={false}
        leftControl={
          <div
            style={{
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-transparent hover:bg-green-100 transition-all duration-200 ml-2 z-10"
          >
            <svg
              style={{ background: "transparent" }}
              className="w-6 h-6 text-[#43eb7f]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                style={{ background: "transparent" }}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        }
        rightControl={
          <div
            style={{
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-transparent hover:bg-green-100 transition-all duration-200 mr-2 z-10"
          >
            <svg
              style={{ background: "transparent" }}
              className="w-6 h-6 text-[#43eb7f]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                style={{ background: "transparent" }}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        }
        className="w-full max-w-[800px] h-full [&_.group]:!relative [&_.group]:!inset-0 [&_.group]:!translate-y-0"
      >
        {/* Slide 1: Welcome */}
        <div className="relative h-full" style={{ background: "transparent" }}>
          <Box
            width={"100%"}
            height={"100%"}
            bg={"white"}
            display={"flex"}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            py={10}
          >
            <Stack
              spaceY={5}
              bg={"transparent"}
              display={"flex"}
              justifyContent={"center"}
              alignContent={"center"}
              alignItems={"center"}
              width={"80%"}
              maxWidth={"600px"}
            >
              <Heading
                className={"bold"}
                color={"#43eb7f"}
                bg={"transparent"}
                fontSize={"300%"}
                textAlign={"center"}
              >
                SUKOON
              </Heading>
              <Heading
                color={"black"}
                bg={"transparent"}
                textAlign={"center"}
                fontSize={"120%"}
                lineHeight={1.5}
              >
                Hello! Thank you for downloading Sukoon! This is your guide to
                get started on connecting your hub and managing your home!
              </Heading>
            </Stack>
          </Box>
        </div>

        {/* Slide 2: Hubs */}
        <div className="relative h-full" style={{ background: "transparent" }}>
          <Box
            width={"100%"}
            height={"100%"}
            bg={"white"}
            display={"flex"}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            py={10}
          >
            <Stack
              spaceY={-1}
              bg={"transparent"}
              display={"flex"}
              justifyContent={"center"}
              alignContent={"center"}
              alignItems={"center"}
              width={"80%"}
              maxWidth={"600px"}
            >
              <Heading
                className={"bold"}
                color={"#43eb7f"}
                bg={"transparent"}
                fontSize={"250%"}
                mb={6}
              >
                Hubs
              </Heading>
              <Heading
                color={"black"}
                bg={"transparent"}
                textAlign={"center"}
                fontSize={"120%"}
                lineHeight={1.5}
                mb={6}
              >
                Your hub can either be a tenant hub, or an admin hub.
              </Heading>

              <HStack
                bg={"transparent"}
                spacing={10}
                mb={6}
                justifyContent={"center"}
                width={"100%"}
              >
                <Stack
                  bg={"transparent"}
                  spaceY={2}
                  align={"center"}
                  maxWidth={"250px"}
                >
                  <img
                    src={TenantHub}
                    style={{
                      background: "transparent",
                      maxWidth: "100%",
                      maxHeight: "250px",
                      objectFit: "contain",
                    }}
                  />
                  <Heading
                    color={"black"}
                    bg={"transparent"}
                    fontSize={"70%"}
                    textAlign={"center"}
                  >
                    Tenant Hub
                  </Heading>
                </Stack>

                <Stack
                  bg={"transparent"}
                  spaceY={2}
                  align={"center"}
                  maxWidth={"250px"}
                >
                  <img
                    src={AdminHub}
                    style={{
                      background: "transparent",
                      maxWidth: "100%",
                      maxHeight: "250px",
                      objectFit: "contain",
                    }}
                  />
                  <Heading
                    bg={"transparent"}
                    color={"black"}
                    fontSize={"70%"}
                    textAlign={"center"}
                  >
                    Admin Hub
                  </Heading>
                </Stack>
              </HStack>

              <Heading
                bg={"transparent"}
                color={"black"}
                textAlign={"center"}
                fontSize={"120%"}
                lineHeight={1.5}
              >
                Look at the back of the hub to find the hub's linking code, and
                click on the add home button or the + button next to your list
                of homes to connect the hub to your account. Just give it a
                name, write down its code, and you're ready to go.
              </Heading>
            </Stack>
          </Box>
        </div>

        {/* Slide 3: Home */}
        <div className="relative h-full" style={{ background: "transparent" }}>
          <Box
            width={"100%"}
            height={"100%"}
            bg={"white"}
            display={"flex"}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            py={10}
          >
            <Stack
              spaceY={-1}
              bg={"transparent"}
              display={"flex"}
              justifyContent={"center"}
              alignContent={"center"}
              alignItems={"center"}
              width={"80%"}
              maxWidth={"600px"}
            >
              <Heading
                className={"bold"}
                color={"#43eb7f"}
                bg={"transparent"}
                fontSize={"250%"}
                mb={6}
              >
                Home
              </Heading>

              <HStack
                bg={"transparent"}
                spacing={10}
                mb={6}
                justifyContent={"center"}
                width={"100%"}
              >
                <Stack
                  bg={"transparent"}
                  spaceY={2}
                  align={"center"}
                  maxWidth={"250px"}
                >
                  <img
                    src={Gendata}
                    style={{
                      background: "transparent",
                      maxWidth: "100%",
                      maxHeight: "250px",
                      objectFit: "contain",
                      borderRadius: "20px",
                    }}
                  />
                </Stack>

                <Stack
                  bg={"transparent"}
                  spaceY={2}
                  align={"center"}
                  maxWidth={"250px"}
                >
                  <img
                    src={Pin}
                    style={{
                      background: "transparent",
                      maxWidth: "100%",
                      maxHeight: "250px",
                      objectFit: "contain",
                      borderRadius: "20px",
                    }}
                  />
                </Stack>
              </HStack>

              <Heading
                bg={"transparent"}
                color={"black"}
                textAlign={"center"}
                fontSize={"120%"}
                lineHeight={1.5}
              >
                The homepage is where you find yourself every time you log into
                your app after connecting a hub to your account. This is where
                basic information is displayed such as the amount of devices
                connected, and your total consumption. You can even pin devices
                for quick access!
              </Heading>
            </Stack>
          </Box>
        </div>

        {/* Slide 4: Rooms */}
        <div className="relative h-full" style={{ background: "transparent" }}>
          <Box
            width={"100%"}
            height={"100%"}
            bg={"white"}
            display={"flex"}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            py={10}
          >
            <Stack
              spaceY={-1}
              bg={"transparent"}
              display={"flex"}
              justifyContent={"center"}
              alignContent={"center"}
              alignItems={"center"}
              width={"80%"}
              maxWidth={"600px"}
            >
              <Heading
                className={"bold"}
                color={"#43eb7f"}
                bg={"transparent"}
                fontSize={"250%"}
                mb={6}
              >
                Rooms
              </Heading>

              <HStack
                bg={"transparent"}
                spacing={10}
                mb={6}
                justifyContent={"center"}
                width={"100%"}
              >
                <Stack
                  bg={"transparent"}
                  spaceY={2}
                  align={"center"}
                  maxWidth={"250px"}
                >
                  <img
                    src={Rooms}
                    style={{
                      background: "transparent",
                      maxWidth: "100%",
                      maxHeight: "250px",
                      objectFit: "contain",
                      borderRadius: "20px",
                    }}
                  />
                </Stack>

                <Stack
                  bg={"transparent"}
                  spaceY={2}
                  align={"center"}
                  maxWidth={"250px"}
                >
                  <img
                    src={AC}
                    style={{
                      background: "transparent",
                      maxWidth: "100%",
                      maxHeight: "250px",
                      objectFit: "contain",
                      borderRadius: "20px",
                    }}
                  />
                </Stack>
              </HStack>

              <Heading
                bg={"transparent"}
                color={"black"}
                textAlign={"center"}
                fontSize={"120%"}
                lineHeight={1.5}
              >
                The Rooms page is where you can organize and manage all of your
                devices. Create new custom rooms by clicking on the + button!
                Add new devices to your hub by linking them through their
                linking codes in the All Devices module! Enter your rooms and
                assign different devices to different rooms!
              </Heading>
            </Stack>
          </Box>
        </div>

        {/* Slide 5: Be'ati (continued) */}
        <div className="relative h-full" style={{ background: "transparent" }}>
          <Box
            width={"100%"}
            height={"100%"}
            bg={"white"}
            display={"flex"}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            py={10}
          >
            <Stack
              spaceY={-1}
              bg={"transparent"}
              display={"flex"}
              justifyContent={"center"}
              alignContent={"center"}
              alignItems={"center"}
              width={"80%"}
              maxWidth={"600px"}
            >
              <Heading
                className={"bold"}
                color={"#43eb7f"}
                bg={"transparent"}
                fontSize={"250%"}
                mb={6}
              >
                Be'ati
              </Heading>

              <HStack
                bg={"transparent"}
                spacing={10}
                mb={6}
                justifyContent={"center"}
                width={"100%"}
              >
                <Stack
                  bg={"transparent"}
                  spaceY={2}
                  align={"center"}
                  maxWidth={"250px"}
                >
                  <img
                    src={Beati}
                    style={{
                      background: "transparent",
                      maxWidth: "100%",
                      maxHeight: "250px",
                      objectFit: "contain",
                      borderRadius: "20px",
                    }}
                  />
                </Stack>

                <Stack
                  bg={"transparent"}
                  spaceY={2}
                  align={"center"}
                  maxWidth={"250px"}
                >
                  <img
                    src={GH}
                    style={{
                      background: "transparent",
                      maxWidth: "100%",
                      maxHeight: "250px",
                      objectFit: "contain",
                      borderRadius: "20px",
                    }}
                  />
                </Stack>
              </HStack>

              <Heading
                bg={"transparent"}
                color={"black"}
                textAlign={"center"}
                fontSize={"120%"}
                lineHeight={1.5}
              >
                Be'ati is our way of turning energy conservation into a game.
                Here is where you can set your own personal goals to try and
                save more energy everyday and make the world a cleaner place. We
                encourage you to save more energy by giving you a range of
                plants in your garden to unlock! The more energy you save, the
                more plants you unlock!
              </Heading>
            </Stack>
          </Box>
        </div>

        {/* Slide 6: Stats */}
        <div className="relative h-full" style={{ background: "transparent" }}>
          <Box
            width={"100%"}
            height={"100%"}
            bg={"white"}
            display={"flex"}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            py={10}
          >
            <Stack
              spaceY={-1}
              bg={"transparent"}
              display={"flex"}
              justifyContent={"center"}
              alignContent={"center"}
              alignItems={"center"}
              width={"80%"}
              maxWidth={"600px"}
            >
              <Heading
                className={"bold"}
                color={"#43eb7f"}
                bg={"transparent"}
                fontSize={"250%"}
                mb={6}
              >
                Stats
              </Heading>

              <Stack
                bg={"transparent"}
                spacing={10}
                mb={6}
                justifyContent={"center"}
                width={"100%"}
                align={"center"}
              >
                <img
                  src={Stats}
                  style={{
                    background: "transparent",
                    maxWidth: "250px",
                    maxHeight: "250px",
                    objectFit: "contain",
                    borderRadius: "20px",
                  }}
                />
              </Stack>

              <Heading
                bg={"transparent"}
                color={"black"}
                textAlign={"center"}
                fontSize={"120%"}
                lineHeight={1.5}
              >
                The statistics page is where you can view your energy
                consumption statistics. Here, you can see how much energy is
                being consumed for this hub, how much each room is consuming,
                and the energy statistics of each device per room. Download a
                report and share with friends!
              </Heading>
            </Stack>
          </Box>
        </div>

        {/* Slide 7: Account */}
        <div className="relative h-full" style={{ background: "transparent" }}>
          <Box
            width={"100%"}
            height={"100%"}
            bg={"white"}
            display={"flex"}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            py={10}
          >
            <Stack
              spaceY={-1}
              bg={"transparent"}
              display={"flex"}
              justifyContent={"center"}
              alignContent={"center"}
              alignItems={"center"}
              width={"80%"}
              maxWidth={"600px"}
            >
              <Heading
                className={"bold"}
                color={"#43eb7f"}
                bg={"transparent"}
                fontSize={"250%"}
                mb={6}
              >
                Account
              </Heading>

              <Stack
                bg={"transparent"}
                spacing={10}
                mb={6}
                justifyContent={"center"}
                width={"100%"}
                align={"center"}
              >
                <img
                  src={ACC}
                  style={{
                    background: "transparent",
                    maxWidth: "250px",
                    maxHeight: "250px",
                    objectFit: "contain",
                    borderRadius: "20px",
                  }}
                />
              </Stack>

              <Heading
                bg={"transparent"}
                color={"black"}
                textAlign={"center"}
                fontSize={"120%"}
                lineHeight={1.5}
              >
                The account page is where you can customize your account, submit
                enquiries, log out, delete your account, and view this tutorial
                again in case you need assistance.
              </Heading>
            </Stack>
          </Box>
        </div>

        {/* Slide 8: Chatbot */}
        <div className="relative h-full" style={{ background: "transparent" }}>
          <Box
            width={"100%"}
            height={"100%"}
            bg={"white"}
            display={"flex"}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            py={10}
          >
            <Stack
              spaceY={-1}
              bg={"transparent"}
              display={"flex"}
              justifyContent={"center"}
              alignContent={"center"}
              alignItems={"center"}
              width={"80%"}
              maxWidth={"600px"}
            >
              <Heading
                className={"bold"}
                color={"#43eb7f"}
                bg={"transparent"}
                fontSize={"250%"}
                mb={6}
              >
                Chatbot
              </Heading>

              <Stack
                bg={"transparent"}
                spacing={10}
                mb={6}
                justifyContent={"center"}
                width={"100%"}
                align={"center"}
              >
                <img
                  src={CB}
                  style={{
                    background: "transparent",
                    maxWidth: "250px",
                    maxHeight: "250px",
                    objectFit: "contain",
                    borderRadius: "20px",
                  }}
                />
              </Stack>

              <Heading
                bg={"transparent"}
                color={"black"}
                textAlign={"center"}
                fontSize={"120%"}
                lineHeight={1.5}
              >
                We provide instant assistance at the touch of a button on our
                homepage. Simply click the chatbot to receive expert advice on
                energy-saving techniques and quick insights into your energy
                statistics!
              </Heading>
            </Stack>
          </Box>
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
