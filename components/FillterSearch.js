import styles from "@/styles/filter.module.css";
import { useState, useEffect } from "react";

export default function FillterSearch({ values = {}, onChange }) {
  const [MaxPrice, setMaxPrice] = useState(values.maxPrice || 15000); 
  const [Height, setHeight] = useState(values?.height || "");
  const [errors, setErrors] = useState({ Max: false, Height: false });
  const [isOpen, setIsOpen] = useState(true);

  const formatNumber = (num) => {
    return num.toLocaleString("en-US");
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(parseInt(e.target.value));
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === "Height") {
      setHeight(value);
      setErrors((prev) => ({ ...prev, Height: value === "" })); // Live validation
    }
  };

  const handleButtonClick = () => {
    const newErrors = {
      Max: MaxPrice === "", // Ensure max price isn't empty
      Height: Height === "", // Ensure height isn't empty
    };

    setErrors(newErrors);

    if (!newErrors.Max && !newErrors.Height) {
      onChange({ maxPrice: MaxPrice, height: Height });
    }
  };

  useEffect(() => {
    setMaxPrice(values.maxPrice || 15000);
    setHeight(values.height || "");
  }, [values]);

  return (
    <div className={styles.container}>
      <div className={`${styles.filter} ${isOpen ? styles.open : styles.closed}`}>
        <h4 className={styles.centeredText}>Filters</h4>

        {isOpen && (
          <>
            <div className={styles.section}>
              <h5>ช่วงราคา</h5>
              <p>ราคา {formatNumber(MaxPrice)}</p>
              <div className={styles.priceInputs}>
                <input
                  className={styles.rangeInput}
                  type="range"
                  min="15000"
                  max="150000"
                  value={MaxPrice}
                  onChange={handleMaxPriceChange}
                />
              </div>
            </div>

            <div className={styles.section}>
              <h5>ความสูงของคุณ</h5>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  placeholder={errors.Height ? "Required" : "ส่วนสูง (CM)"}
                  value={Height}
                  style={errors.Height ? { borderColor: "red" } : {}}
                  onChange={(e) => handleInputChange(e, "Height")}
                />
              </div>
            </div>

            <div className={styles.actions}>
              <button onClick={handleButtonClick} className={styles.submit}>
                ตกลง
              </button>
            </div>
          </>
        )}

        <button className={styles.toggleBtn} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Hide Filters ▲" : "Show Filters ▼"}
        </button>
      </div>
    </div>
  );
}
