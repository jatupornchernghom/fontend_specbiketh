import styles from "../styles/NewProducts.module.css"; // Import the CSS Module
import Productbox from "./ProductBox";

export default function Mostview({ products }) {
  
  return (  
    <div className={styles.bg}>
      <h1 className={styles.textnewUpDate}>ยอดเข้าชมสูงสุด</h1>
      <div className={styles.ProductsGrid}>
        {products?.length > 0 && products.map((product) => (
          <Productbox key={product._id} {...product} />
        ))}
      </div>
    </div>
  );
}
