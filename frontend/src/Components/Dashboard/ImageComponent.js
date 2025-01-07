import React, { useState, useEffect } from 'react';

function ImageComponent({ endpoint, altText }) {
  const [image, setImage] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`http://localhost:5000/${endpoint}`);
        const data = await response.json();
        setImage(data.image);
        setIsReady(true);
      } catch (error) {
        // console.error('There was an error fetching the image!', error);
      }
    };

    fetchImage();
  }, [endpoint]);

  return isReady ? (
    <img src={image} alt={altText} style={{ width: '100%', height: 'auto' }} />
  ) : (
    <div>Loading...</div>
  ); // You can show a loading indicator or handle differently
}

export default ImageComponent;
