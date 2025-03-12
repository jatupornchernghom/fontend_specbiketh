// Featured.js

import React from "react";
import styles from "../styles/Featured.module.css"; // Import the CSS Module
import { useState } from "react";

import Form from "./Form";



export default function Featured() {
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(!showForm);
  };

  return (
    <div>
      <div className={styles.hero}>
        <h1>Discover the perfect bike for your soul</h1>
        <div className={styles.buttonWrapper}>
          {!showForm && (
            <button className={styles.discoverBtn} onClick={handleButtonClick}>
              Discover
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className={styles.formOverlay}>
          <Form onClose={handleButtonClick} />
        </div>
      )}
    </div>
  );
}
