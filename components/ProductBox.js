import { useState, useEffect } from 'react';
import styles from "../styles/Productbox.module.css";
import Link from "next/link";
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { useGlobalState } from "@/components/context/GlobalContext";
import axios from "axios";

export default function Productbox({ _id, title, price, images, onFavoriteChange }) { // Add onFavoriteChange prop
  const { data: session } = useSession();
  const { productFav, updateProductFav } = useGlobalState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const storedFavs = localStorage.getItem('productFav') || [];
      setIsFavorite(storedFavs.includes(_id));
    } catch (error) {
      console.error('Error parsing favorites from localStorage:', error);
      localStorage.setItem('productFav', JSON.stringify([]));
    }
  }, [_id]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);

      let updatedFavs = [...productFav];

      if (newFavoriteState) {
        updatedFavs.push(_id);
      } else {
        updatedFavs = updatedFavs.filter(id => id !== _id);
      }

      updateProductFav(updatedFavs);
      localStorage.setItem('productFav', JSON.stringify(updatedFavs));
      if (session) {
        const email = localStorage.getItem("email");
        await axios.post('/api/favorites', {
          productId: _id,
          email,
          isFavorite: newFavoriteState
        });
      }

      // Call the onFavoriteChange function if it's provided and the product was unfavorited
      if (!newFavoriteState && onFavoriteChange) {
        onFavoriteChange(_id);
      }

    } catch (error) {
      console.error('Error toggling favorite:', error);
      setIsFavorite(!isFavorite);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div key={_id} className={styles.bikeCard}>
      <Link href={`/products/detail/${_id}`}>
        <div className={styles.imageContainer}>
          <Image
            src={images[0]}
            alt={title}
            layout="responsive"
            width={500}
            height={200}
            objectFit="cover"
          />
        </div>
        <h3>{title}</h3>
        <div className={styles.priceContainer}>
          <p className={styles.price}>{price.toLocaleString()} บาท</p>
          <button
            className={styles.favoriteButton}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            disabled={isLoading}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isFavorite ? styles.favoriteActive : styles.favoriteInactive}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      </Link>
    </div>
  );
}