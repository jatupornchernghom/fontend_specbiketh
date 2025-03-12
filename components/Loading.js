// Import necessary libraries
import React from 'react';
import { css } from '@emotion/react';
import { BeatLoader } from 'react-spinners';
import styles from '@/styles/Spiner.module.css';

// Your Loading component
const Loading = () => {
  return (
    <div className={styles.container}>
      <BeatLoader color={'#000000'} loading css={css`display: block; margin: 0 auto; border-color: #ffff;`} size={50} />
      {/* Add more components as needed */}
    </div>
  );
};

export default Loading;
