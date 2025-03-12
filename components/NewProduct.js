import styles from "../styles/NewProducts.module.css"; // Import the CSS Module
import Productbox from "./ProductBox";

export default function NewProducts({ products }) {
  
  return (  
    <div className={styles.bg}>
      <h1 className={styles.textnewUpDate}>อัพเดทล่าสุด</h1>
      <div className={styles.ProductsGrid}>
        {products?.length > 0 && products.map((product) => (
          <Productbox key={product._id} {...product} />
        ))}
      </div>
    </div>
  );
}
