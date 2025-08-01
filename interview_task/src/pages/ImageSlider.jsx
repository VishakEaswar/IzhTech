import React, { useRef, useState, useEffect, useCallback } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

const baseTestimonials = [
  {
    id: 1,
    name: "Ashley Right",
    title: "Pinterest",
    image: "https://tse4.mm.bing.net/th/id/OIP.IGNf7GuQaCqz_RPq5wCkPgHaLH?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    quote: "Professionals in their craft! All products were super amazing with strong attention to details, comps and overall vibe"
  },
  {
    id: 2,
    name: "Daniel Lark",
    title: "Adobe",
    image: "https://live.staticflickr.com/65535/52426312575_6fb54515f6_b.jpg",
    quote: "They nailed the visuals! Clean, modern, and exactly what we needed. Collaboration was seamless too."
  },
  {
    id: 3,
    name: "Yuki Tanaka",
    title: "Shopify",
    image: "https://images.unsplash.com/photo-1528045252873-2bf37023d58b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTN8MzE3NDEwMjJ8fGVufDB8fHx8&w=1000&q=80",
    quote: "So easy to work with. They totally understood our brand. The final result? Just wow."
  },
  {
    id: 4,
    name: "Leo Grant",
    title: "Airbnb",
    image: "https://tse4.mm.bing.net/th/id/OIP.bwSUZ52C8RukwXnCIxfGrQHaLH?r=0&w=1425&h=2138&rs=1&pid=ImgDetMain&o=7&rm=3",
    quote: "The design team brought our concept to life perfectly. From typography to layout, all on point."
  },
  {
    id: 5,
    name: "Isaac K.",
    title: "Google",
    image: "https://tse3.mm.bing.net/th/id/OIP.j8yd8dJ5215WbgQ0NsLzuAHaNK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    quote: "This team delivered fast, communicated clearly, and exceeded our expectations. Highly recommend!"
  }
];

const loopedTestimonials = [
  ...baseTestimonials,
  ...baseTestimonials,
  ...baseTestimonials,
  ...baseTestimonials,
  ...baseTestimonials,
  ...baseTestimonials,
  ...baseTestimonials,
  ...baseTestimonials,
  ...baseTestimonials,
  ...baseTestimonials
];

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function InfiniteImageSlider() {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(baseTestimonials.length * 4);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const normalWidth = 150;
  const selectedWidth = 300;
  const cardSpacing = 16;

  const getCurrentTestimonial = (idx) => {
    return baseTestimonials[idx % baseTestimonials.length];
  };

  const animateScrollToSelected = useCallback((targetIndex, duration = 1000) => {
    const container = scrollRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    let totalWidthBefore = 0;
    for (let i = 0; i < targetIndex; i++) {
      const isSelected = i === index;
      totalWidthBefore += (i === index ? selectedWidth : normalWidth) + cardSpacing;
    }

    const targetScrollLeft = totalWidthBefore + selectedWidth - containerWidth;
    const startScrollLeft = container.scrollLeft;
    const scrollDelta = targetScrollLeft - startScrollLeft;

    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      container.scrollLeft = startScrollLeft + scrollDelta * easeInOutQuad(progress);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [index, normalWidth, selectedWidth, cardSpacing]);

  const handleImageClick = (idx) => {
    if (isScrolling) return;
    setIsScrolling(true);
    setIndex(idx);
    requestAnimationFrame(() => {
      animateScrollToSelected(idx, 1000);
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    });
  };

  const handleNext = () => {
    if (isScrolling) return;
    const nextIndex = index - 1;
    handleImageClick(nextIndex);
  };

  const handleScroll = useCallback(() => {
    if (isScrolling) return;

    const container = scrollRef.current;
    if (!container) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = normalWidth + cardSpacing;
      const singleSetWidth = itemWidth * baseTestimonials.length;

      if (scrollLeft < singleSetWidth) {
        const newIndex = index + baseTestimonials.length;
        setIndex(newIndex);
        container.scrollLeft = scrollLeft + singleSetWidth;
      } else if (scrollLeft > singleSetWidth * 3) {
        const newIndex = index - baseTestimonials.length;
        setIndex(newIndex);
        container.scrollLeft = scrollLeft - singleSetWidth;
      }
    }, 150);
  }, [index, normalWidth, cardSpacing, isScrolling]);

  useEffect(() => {
    setTimeout(() => {
      animateScrollToSelected(index, true);
    }, 100);
  }, [animateScrollToSelected, index]);

  return (
    <Box sx={{ display: "flex", flexDirection: "row", height: "100vh", padding: 4, overflow: "hidden" }}>
      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        sx={{
          padding: '24px',
          flex: "0 0 auto",
          width: (normalWidth + cardSpacing) * 5 + "px",
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
          whiteSpace: "nowrap",
          alignItems: "flex-end",
          paddingBottom: 2,
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { height: 0 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#FFD700",
            borderRadius: 4,
            "&:hover": { backgroundColor: "#FFCD00" }
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f0f0f0",
            borderRadius: 4
          }
        }}
      >
        {loopedTestimonials.map((t, i) => {
          const isSelected = i === index;
          const isLast = i === loopedTestimonials.length - 1;

          return (
            
            <Box
              key={`${t.id}-${Math.floor(i / baseTestimonials.length)}-${i % baseTestimonials.length}`}
              onClick={() => handleImageClick(i)}
              sx={{
                flex: "0 0 auto",
                width: isSelected ? selectedWidth : normalWidth,
                height: isSelected ? 700 : 200,
                marginRight: isLast ? 0 : `${cardSpacing}px`,
                // borderRadius: 2,
                boxShadow: isSelected ? 8 : 2,
                cursor: isScrolling ? "default" : "pointer",
                transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
                transform: isSelected ? "translateY(-10px) scale(1.02)" : "translateY(0) scale(1)",
                opacity: isScrolling && !isSelected ? 0.7 : 1,
                "&:hover": !isScrolling ? {
                  transform: isSelected ? "translateY(-10px) scale(1.05)" : "translateY(-5px) scale(1.08)",
                  boxShadow: isSelected ? 10 : 4
                } : {}
              }}
            >

              <Box
                component="img"
                src={t.image}
                alt={t.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "all 0.6s ease",
                  filter: isSelected ? "brightness(1.1) contrast(1.05)" : "brightness(1)"
                }}
              />
            </Box>
          );
        })}
      </Box>

      <Box sx={{ flex: 1, pl: 4, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Box
          key={`info-${index % baseTestimonials.length}`}
          sx={{
            animation: "slideInFromRight 0.7s ease-out",
            "@keyframes slideInFromRight": {
              "0%": { opacity: 0, transform: "translateX(40px)" },
              "100%": { opacity: 1, transform: "translateX(0)" }
            }
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {getCurrentTestimonial(index)?.name}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {getCurrentTestimonial(index)?.title}
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            "{getCurrentTestimonial(index)?.quote}"
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <IconButton
            onClick={handleNext}
            disabled={isScrolling}
            sx={{
              backgroundColor: isScrolling ? "#ddd" : "#FFD700",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: isScrolling ? "#ddd" : "#FFCD00",
                transform: isScrolling ? "scale(1)" : "scale(1.1)"
              },
              "&.Mui-disabled": {
                backgroundColor: "#ddd",
                color: "#999"
              }
            }}
          >
            <ArrowForward
              sx={{
                transition: "transform 0.3s ease-in-out",
                transform: isScrolling ? "rotate(180deg)" : "rotate(0deg)"
              }}
            />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
