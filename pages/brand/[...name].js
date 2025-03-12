import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Head from 'next/head';
import FillterSearch from "@/components/FillterSearch"; 
import axios from 'axios'
import BrandProducts from "@/components/BrandProduct";
import styles from "@/styles/Brand.module.css";
import Loading from "@/components/Loading";



export default function CategoryTag() {
    const router = useRouter();
    const { name } = router.query;
    const [products, setProducts] = useState([]);
    const [originalProducts, setOriginalProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [inputValues, setInputValues] = useState({
        Max: '',
        Height: '',
      });

    useEffect(() => {
        if (!name) {
            return;
        }
        axios.get('/api/brand?name=' + name).then(res => {
            setProducts(res.data);
            setOriginalProducts(res.data); // Store the original products
            setIsLoading(false);
        });
    }, [name]);
    const handleFilterChange = (value) => {

        const filteredProducts = originalProducts.filter(product => {
            const isHeightInRange = value.height >= product.properties.min_hight && value.height <= product.properties.max_hight;
            const isPriceInRange = product.price <= value.maxPrice;
            return isHeightInRange && isPriceInRange;
            
        });

        setProducts(filteredProducts)

    };


    return (
        <Layout>
            <Head><title>{name}</title></Head>
            <div className={styles.header}>
                <h3>{name}</h3>
            </div>
            <div className={styles.Brand}>
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        <FillterSearch values={inputValues} onChange={handleFilterChange} />
                        <BrandProducts products={products} />
                    </>
                )}
            </div>
        </Layout>
    );
}
