"use client";

import useEmblaCarousel from "embla-carousel-react";
import React, {
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  
} from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "src/components/ui/carousel";

interface CustomCarouselProps {
  items: React.ReactNode[];
  loop?: boolean;
  prevButton?: React.ReactElement; // Ensure it's a React Element
  nextButton?: React.ReactElement; // Ensure it's a React Element
}

export function CustomCarousel({
  items,
  loop = true,
  prevButton,
  nextButton,
}: CustomCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setCurrent(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect(); // Set initial slide

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // ** Handle navigation with looping **
  const goPrev = () => {
    if (!emblaApi) return;
    if (loop && current === 0) {
      emblaApi.scrollTo(items.length - 1); // Jump to last slide
    } else {
      emblaApi.scrollTo(current - 1);
    }
  };

  const goNext = () => {
    if (!emblaApi) return;
    if (loop && current === items.length - 1) {
      emblaApi.scrollTo(0); // Jump to first slide
    } else {
      emblaApi.scrollTo(current + 1);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Carousel Wrapper */}
      <div className="overflow-hidden w-full max-w-lg" ref={emblaRef}>
        <Carousel className="w-full">
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem key={index} className="flex justify-center items-center p-4 min-w-full">
                {item}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Navigation Buttons (Customizable) */}
      <div className="flex gap-3 mt-4">
        {prevButton && isValidElement(prevButton)
          ? cloneElement(prevButton, {
              onClick: goPrev, // ✅ Correctly adds onClick
              disabled: !loop && current === 0,
            })
          : (
            <button
              onClick={goPrev}
              disabled={!loop && current === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              ⬅️
            </button>
          )}

        {nextButton && isValidElement(nextButton)
          ? cloneElement(nextButton, {
              onClick: goNext, // ✅ Correctly adds onClick
              disabled: !loop && current === items.length - 1,
            })
          : (
            <button
              onClick={goNext}
              disabled={!loop && current === items.length - 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              ➡️
            </button>
          )}
      </div>

      {/* Display Current Slide */}
      <p className="mt-2 text-lg font-semibold">
        Slide {current + 1} of {items.length}
      </p>
    </div>
  );
}