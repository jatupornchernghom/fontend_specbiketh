import React, { useEffect, useState } from 'react';
import DataTable from './DataTable';
import Image from 'next/image';
import axios from 'axios';
import styles from "@/styles/Detail.module.css";
import Description_moredetail from './DesAndMoreDetail';
import MostViewsAndlikely from './recommend';
import { useGlobalState } from './context/GlobalContext';
import { useSession } from "next-auth/react";

export default function DetailForm({ productInfo, recommend }) {
  const { data: session } = useSession();
  const [hoveredImageIndex, setHoveredImageIndex] = useState(1);
  const { _id, title, price, images } = productInfo;
  const { productFav, updateProductFav } = useGlobalState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [views, setViews] = useState(productInfo.views);

  // Initialize favorite state from global state or localStorage
  useEffect(() => {
    if (session) {
      setIsFavorite(productFav.includes(_id));
    } else {
      const existingFavorites = JSON.parse(localStorage.getItem("productFavData")) || [];
      setIsFavorite(existingFavorites.some(product => product._id === _id));
    }
  }, [session, productFav, _id]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // Prevent link navigation

    if (isLoading) return; // Prevent multiple clicks

    try {
      setIsLoading(true);
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);

      if (session) {
        const email = localStorage.getItem("email");
        await axios.post('/api/favorites', {
          productId: _id,
          email
        });
      }

      // Update global state
      if (newFavoriteState) {
        if (!productFav.includes(_id)) {
          updateProductFav([...productFav, _id]);
        }
      } else {
        updateProductFav(productFav.filter(id => id !== _id));
      }

      // Handle localStorage for non-logged-in users
      if (!session) {
        let existingFavorites = JSON.parse(localStorage.getItem("productFavData")) || [];

        if (newFavoriteState) {
          const FavProduct = { _id, title, price, images };
          const isAlreadyFav = existingFavorites.some(product => product._id === _id);
          if (!isAlreadyFav) {
            existingFavorites.push(FavProduct);
          }
        } else {
          existingFavorites = existingFavorites.filter(product => product._id !== _id);
        }

        localStorage.setItem("productFavData", JSON.stringify(existingFavorites));
      }

      localStorage.setItem(
        'productFav',
        JSON.stringify(
          newFavoriteState
            ? [...productFav.filter(id => id !== _id), _id]
            : productFav.filter(id => id !== _id)
        )
      );

    } catch (error) {
      console.error('Error toggling favorite:', error);
      setIsFavorite(!isFavorite); // Revert state on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setViews((prevViews) => prevViews + 1);
        await axios.put('/api/products', { _id, views: views + 1 });
      } catch (error) {
        setViews((prevViews) => prevViews - 1);
      }
    };
    fetchData();
  }, [_id, views]);

  const handleImageItemHover = (index) => {
    setHoveredImageIndex(index);
  };

  const size = productInfo.properties.Size.split(',');
  const color = productInfo.properties.สี.split(',');

  return (
    <div className={styles.card_Wrapper}>
      <div className={styles.titleandviewr}>
        <h2>{productInfo.title}</h2>
        <div className={styles.viewsnfav}>
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
              fill={isFavorite ? "red" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isFavorite ? styles.favoriteActive : styles.favoriteInactive}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <div className={styles.views}>
          <Image src="/images/views.svg" alt="home" width={30} height={30} />
          <h5>{productInfo.views}</h5>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.product_imgs}>
          <div className={styles.img_display}>
            <div className={styles.img_showcase}>
              {productInfo && (
                <Image
                  src={productInfo.images[hoveredImageIndex]}
                  alt={`Image ${hoveredImageIndex}`}
                  width={500} 
                  height={500} 
                  quality={100} 
                />
              )}
            </div>
          </div>
          <div className={styles.img_select}>
            {productInfo &&
              productInfo.images.slice(1).map((img, index) => (
                <div
                  key={index + 1}
                  className={styles.img_item}
                  onMouseEnter={() => handleImageItemHover(index + 1)}
                >
                  <a href="#" data-id="1">
                    <Image src={img} alt={`Image ${index + 1}`}  width={200} height={200} quality={100} />
                  </a>
                </div>
              ))}
          </div>
          <div className={styles.colorandsize}>
            <div className={styles.size}>
              <h3>Size :</h3>
              {size.map((item, index) => (
                <React.Fragment key={item}>
                  {index !== 0}
                  <a className={styles.sizea}> {item} </a>
                </React.Fragment>
              ))}
            </div>
            <div className={styles.color}>
              <h3>Color :</h3>
              {color.map((item, index) => (
                <React.Fragment key={item}>
                  {index !== 0}
                  <a className={styles.sizea}> {item} </a>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.product_content}>
          <DataTable productInfo={productInfo} />
        </div>
      </div>
      <Description_moredetail productInfo={productInfo} />
      <MostViewsAndlikely recommend={recommend} />
    </div>
  );
}
