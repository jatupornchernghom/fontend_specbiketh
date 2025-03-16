import styles from '@/styles/BrandProducts.module.css'
import Link from "next/link";
import Image from 'next/image'; // ✅ Import Image from 'next/image'

export default function BrandProducts({ products }) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {products && products.length > 0 ? (
          products.map((product) => (
            <Link href={'/products/detail/' + product.title} key={product._id}>
              <div className={styles.box}>
                <Image 
                  src={product.images[0]} 
                  alt={product.title} 
                  width={500}   // Set width (change as needed)
                  height={500}  // Set height (change as needed)
                  quality={75}  // Optional: Set quality for optimization
                />
                <h5>{product.title}</h5>
                <p>{product.price.toLocaleString()} บาท</p>
              </div>
            </Link>
          ))
        ) : (
          <div>
            <p>ไม่มีจักรยานที่ตรงกับคำค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
}
