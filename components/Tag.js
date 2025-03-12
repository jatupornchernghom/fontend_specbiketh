// Tag.js
import styles from '@/styles/Tag.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';


export default function Tag({ productInfo }) {
  const [category, setCategory] = useState([]);
  const categoryId = productInfo.category;
  const router = useRouter();


  useEffect(() => {
    if (!categoryId) {
      return;
    }

    axios.get(`/api/categoryTag?id=${categoryId}`).then((res) => {
      setCategory(res.data);
    });
  }, [categoryId]);

  const handleClick = () => {
    router.push('/');
  };

  return (
    <div className={styles.tag}>
        <div >
            <Image 
                src="/images/home.png"
                alt="home"
                width={18}
                height={18}
                onClick={handleClick} style={{ cursor: 'pointer' }}
              />
        </div>
        <div className={styles.spaceBetweenSections}>{`>`}</div>

          <Link href={"/"} passHref >
            <h5>จักรยานเสือหมอบ</h5>
          </Link>
          <div className={styles.spaceBetweenSections}>{`>`}</div>

          <Link href={"/brand/" + category?.name} passHref>
            {` ${category?.name}`}
          </Link>

          <div className={styles.spaceBetweenSections}>{`>`}</div>
            <h5>{`${productInfo?.properties?.model}`}</h5>
      </div>
  );
}