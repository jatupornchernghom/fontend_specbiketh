import React, { useState } from "react";
import styles from "@/styles/Form.module.css";
import { useRouter } from 'next/router';

export default function Form({ onClose }) {
  const [maxPrice, setMaxPrice] = useState(15000);
  const [height, setHeight] = useState('');
  const [errors, setErrors] = useState({ Max: false, Height: false });
  const router = useRouter();

  const formatNumber = (num) => {
    return num.toLocaleString("en-US");
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(parseInt(e.target.value));
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === "Height") setHeight(value);
  };

  const handleButtonClick = () => {
    const newErrors = {
      Max: maxPrice === '',
      Height: height === ''
    };

    setErrors(newErrors);

    if (newErrors.Max || newErrors.Height) return;

    router.push(`/Bicycles?MaxPrice=${maxPrice}&Height=${height}`);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.filterContainer}>
        <div className={styles.filterHeader}>
          <h2>Discover</h2>
          <button onClick={onClose} className={styles.closeButton}>X</button>
        </div>

        <div className={styles.filterSection}>
          <h3>ช่วงราคา</h3>
          <p>ราคา {formatNumber(maxPrice)}</p>
          <div className={styles.sliderContainer}>
            <input
              className={styles.slider}
              type="range"
              min="15000"
              max="150000"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>

        <div className={styles.filterSection}>
          <h3>ความสูง</h3>
          <input 
            type="number"
            className={`${styles.heightInput} ${errors.Height ? styles.inputError : ''}`}
            placeholder="ส่วนสูง (CM)"
            value={height}
            onChange={(e) => handleInputChange(e, "Height")} 
          />
          {errors.Height && <p className={styles.errorText}>กรุณาระบุความสูง</p>}
        </div>

        <button onClick={handleButtonClick} className={styles.submitButton}>
          ตกลง
        </button>
      </div>
    </div>
  );
}