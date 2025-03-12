import LayoutComapare from "@/components/Layout_compare";
import { useState, useEffect, useCallback } from "react";
import styles from "@/styles/AllBicycles.module.css";
import Head from "next/head";
import axios from "axios";
import Loading from "@/components/Loading";
import Productbox from "@/components/ProductBox";
import FillterSearch from "@/components/FillterSearch";
import { useSearchParams } from "next/navigation";

export default function AllBicycles() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    maxPrice: searchParams.get("MaxPrice") || "15000",
    height: searchParams.get("Height") || "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [matchedCategories, setMatchedCategories] = useState([]);
  const [fetchedProducts, setFetchedProducts] = useState({
    allProducts: [],
    category: [],
  });

  // Fetch data once when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/compares`);
        const fetchedProductsData = res.data;

        setAllProducts(fetchedProductsData.allProducts);
        setCategories(fetchedProductsData.category);
        setFetchedProducts(fetchedProductsData);
        setOriginalProducts(fetchedProductsData.allProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Match categories with products
  useEffect(() => {
    const filterCategories = () => {
      const matchedCategoriesArray = allProducts
        .filter(product => {
          const categoryId = product.category;
          return categories.some(category => category._id === categoryId);
        })
        .map(product => product.category);

      setMatchedCategories(matchedCategoriesArray);
    };

    filterCategories();
  }, [allProducts, categories]);

  // Update filters when URL params change
  useEffect(() => {
    setFilters({
      maxPrice: searchParams.get("MaxPrice") || "15000",
      height: searchParams.get("Height") || "",
    });
  }, [searchParams]);

  // Filter products based on selected filters
  const handleFilterChange = useCallback((value) => {
    const filteredProducts = originalProducts.filter(product => {
      const isHeightInRange =
        value.height >= product.properties.min_hight &&
        value.height <= product.properties.max_hight;
      const isPriceInRange = product.price <= value.maxPrice;
      return isHeightInRange && isPriceInRange;
    });

    if (value.height === '') {
      setAllProducts(originalProducts);
    } else {
      setAllProducts(filteredProducts);
    }
  }, [originalProducts]);

  useEffect(() => {
    if (originalProducts.length > 0) {
      handleFilterChange(filters);
    }
  }, [filters, originalProducts, handleFilterChange]);

  return (
    <LayoutComapare>
      <div className={styles.header}>
        <h3>All Bicycles</h3>
      </div>
      <div className={styles.container}>
        <FillterSearch values={filters} onChange={handleFilterChange} />
        <Head>
          <title>All Bicycles</title>
        </Head>
        {isLoading ? (
          <Loading />
        ) : (
          <div className={styles.allbicycles}>
            {categories.map((item, index) => (
              <div key={index}>
                {matchedCategories.includes(item._id) && (
                  <div>
                    <h4 className={styles.CategoryTag}>{item.name}</h4>
                    <div className={styles.box}>
                      {allProducts
                        .filter(product => product.category === item._id)
                        .map(product => (
                          <div className={styles.card} key={product._id}>
                            <Productbox key={product._id} {...product} />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutComapare>
  );
}
