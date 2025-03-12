import LayoutComapare from "@/components/Layout_compare";
import styles from "@/styles/FavoriteProducts.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Productbox from "@/components/ProductBox";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Favorite() {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleBrowseClick = () => {
    router.push('/Bicycles');
  };

  useEffect(() => {
    if(!session){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "โปรดเข้าสู่ระบบเพื่อใช้งาน!",
      });      
      router.push("/");
    }
    const fetchFavorites = async () => {
      setIsLoading(true);

      if (session) {
        try {
          const res = await axios.get('/api/fetchuserfavorite');
          setFavoriteProducts(res.data);
        } catch (error) {
          console.error('Error fetching favorite products:', error);
          setFavoriteProducts([]);
          setIsEmpty(true);
        } finally {
          setIsLoading(false);
        }
      } else {
        setFavoriteProducts([]);
        setIsEmpty(true);
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [session,router]);

  useEffect(() => {
    setIsEmpty(favoriteProducts.length === 0);
  }, [favoriteProducts]);

  const handleFavoriteChange = (productId) => {
    setFavoriteProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
  };

  if (isLoading) {
    return (
      <LayoutComapare>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading your favorite products...</p>
        </div>
      </LayoutComapare>
    );
  }

  if (isEmpty) {
    return (
      <LayoutComapare>
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h2>ยังไม่มีจักรยานที่ชื่นชอบ</h2>
          <p>Start adding products to your favorites to see them here!</p>
          <button className={styles.browseButton} onClick={handleBrowseClick}>
            Browse Bicycles
          </button>
        </div>
      </LayoutComapare>
    );
  }

  return (
    <LayoutComapare>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>รายการโปรดของคุณ</h1>
          <p>{favoriteProducts.length} รายการที่บันทึกไว้</p>
        </div>

        <div className={styles.productsGrid}>
          {favoriteProducts?.length > 0 && favoriteProducts.map((product) => (
            <Productbox key={product._id} {...product} onFavoriteChange={handleFavoriteChange} />
          ))}
        </div>
      </div>
    </LayoutComapare>
  );
}