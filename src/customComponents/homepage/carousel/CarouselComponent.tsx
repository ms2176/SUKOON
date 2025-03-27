import { background } from "@chakra-ui/system";
import { Carousel } from "flowbite-react";
import Logo from '@/images/logo.png';
import Intro from '@/images/tutorial/1.png'

const CarouselComponent = () => {
  return (
    <div className="relative w-full h-56 sm:h-64 xl:h-80 2xl:h-96 overflow-hidden">
      <Carousel
        slide={false}
        indicators={false}
        leftControl={
          <div style={{background: 'transparent'}} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 backdrop-blur-sm shadow-lg hover:bg-white/50 transition-all duration-200 ml-2 z-10">
            <svg style={{background: 'transparent'}} className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path style={{background: 'transparent'}} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        }
        rightControl={
          <div style={{background: 'transparent'}} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 backdrop-blur-sm shadow-lg hover:bg-white/50 transition-all duration-200 mr-2 z-10">
            <svg style={{background: 'transparent'}} className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path style={{background: 'transparent'}} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        }
        className="h-full [&_.group]:!relative [&_.group]:!inset-0 [&_.group]:!translate-y-0"
      >
        <div className="relative h-full" style={{background: 'transparent'}}>
          <img className="h-full w-full object-cover" src={Intro} alt="Slide 1"/>
        </div>
        <div className="relative h-full" style={{background: 'transparent'}}>
          <img className="h-full w-full object-cover" src="https://flowbite.com/docs/images/carousel/carousel-2.svg" alt="Slide 2" />
        </div>
        <div className="relative h-full" style={{background: 'transparent'}}>
          <img className="h-full w-full object-cover" src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="Slide 3" />
        </div>
        <div className="relative h-full" style={{background: 'transparent'}}>
          <img className="h-full w-full object-cover" src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="Slide 4" />
        </div>
        <div className="relative h-full" style={{background: 'transparent'}}>
          <img className="h-full w-full object-cover" src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="Slide 5" />
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
