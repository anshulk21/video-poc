import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-youtube';
import { useSwipeable } from 'react-swipeable';

const videoData = [
  { id: 1, src: 'https://www.youtube.com/embed/T2Oaj_CgUJo' },
  { id: 2, src: 'https://www.youtube.com/embed/GEWdczVfkZI' },
  { id: 3, src: 'https://www.youtube.com/embed/elpC1iEJ4i4' }
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (currentIndex !== null) {
      const currentSrc = videoData[currentIndex].src;
      if (videoRef.current) {
        playerRef.current = videojs(videoRef.current, {
          techOrder: ['youtube'],
          autoplay: true,
          controls: true,
          sources: [{ src: currentSrc, type: 'video/youtube' }]
        });

        return () => {
          if (playerRef.current) {
            playerRef.current.dispose();
          }
        };
      }
    }
  }, [currentIndex]);

  const handlers = useSwipeable({
    onSwipedUp: () => changeVideo('next'),
    onSwipedDown: () => changeVideo('prev'),
    swipeDuration: 500,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const changeVideo = (direction) => {
    if (currentIndex !== null) {
      let newIndex;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % videoData.length;
      } else {
        newIndex = (currentIndex - 1 + videoData.length) % videoData.length;
      }
      setCurrentIndex(newIndex);
    }
  };

  // Play/Pause functionality when clicking on the video
  const togglePlayPause = () => {
    if (playerRef.current) {
      if (playerRef.current.paused()) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  };

  const VideoView = useCallback(() => {
    return (
      <Box
        sx={{
          background: '#333',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          pointerEvents: 'none'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            height: '100vh',
            width: '100vw'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            pointerEvents: 'auto'
          }}
          {...handlers}
        />
        <Box style={styles.videoWrapper} onClick={togglePlayPause}>
          <div data-vjs-player style={styles.videoWrapper}>
            <video ref={videoRef} className="video-js vjs-default-skin" controls />
          </div>
        </Box>
      </Box>
    );
  }, [currentIndex]);

  return (
    <div style={styles.container}>
      {currentIndex !== null ? (
        <VideoView />
      ) : (
        <Stack direction="row" spacing={2} style={styles.thumbnailContainer}>
          {videoData.map((item, index) => (
            <div key={index} width="315" height="500" cursor="pointer">
              <Box
                onClick={() => setCurrentIndex(index)}
                style={{
                  cursor: 'pointer',
                  position: 'absolute',
                  zIndex: 9999,
                  background: 'transparent',
                  height: 200,
                  transform: 'translate(100%, 100%)'
                }}
              >
                <Box
                  sx={{
                    background: '#000',
                    width: '120px',
                    height: '120px',
                    borderRadius: '30px',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <PlayArrow sx={{ color: 'white', fontSize: '3.5rem' }} />
                </Box>
              </Box>
              <div style={{ position: 'relative' }}>
                <iframe
                  src={item.src}
                  width="315"
                  height="500"
                  title="YouTube video player"
                />
              </div>
            </div>
          ))}
        </Stack>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    position: 'relative'
  },
  videoWrapper: {
    width: '500px',
    height: '100%',
    position: 'relative',
    zIndex: 9999
  },
  thumbnail: {
    cursor: 'pointer',
    position: 'relative'
  },
  iframe: {
    border: 'none',
    cursor: 'pointer'
  }
};

export default App;
