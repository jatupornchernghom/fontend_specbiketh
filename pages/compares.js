import Layout from "@/components/Layout";
import Cookies from "js-cookie";
import { useEffect, useState } from 'react';
import axios from "axios";
import Loading from "/components/Loading";
import styles from '@/styles/Compares.module.css'
import Head from 'next/head';
import { useGlobalState } from "@/components/context/GlobalContext";
import Image from 'next/image';


export default  function Compare() {  

  const {updatecookie} = useGlobalState()
  const cookieArray = updatecookie();
  const [isLoading, setIsLoading] = useState(true);
  const [first, setFirst] = useState({});
  const [second, setSecond] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [categories,Setcategories] = useState([])
  const [allProducts,SetAllProducts] = useState([])
  const [productSelected,setproductSelected] = useState([])
  const [seleactedProduct,setselectedProduct] = useState(false)
  const { updateCompareCount } = useGlobalState();

  const [fetchedProducts, setFetchedProducts] = useState({
    allProducts: [],
    category: [],
  });

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };


  const chooseProduct = (id) => {
    setselectedProduct(!seleactedProduct)
    setIsPopupVisible(!isPopupVisible);

    // Add the ID to the cookieArray
    cookieArray.push(id);
    updateCompareCount((prevCount) => prevCount + 1);
  
    // Convert the updated array to a JSON string
    const jsonString = JSON.stringify(cookieArray);
    console.log(jsonString)
  
    // Set the updated array as a cookie
    Cookies.set('compare', jsonString, { expires: 365 });
    setproductSelected([]);

  };
  

  const handleClearFirst = () => {
    if (first && first._id) {
      const indexToRemove = cookieArray.indexOf(first._id);
  
      cookieArray.splice(indexToRemove, 1);
  
      const jsonString = JSON.stringify(cookieArray);
      Cookies.set('compare', jsonString, { expires: 365 });
  
      // Check if the second item is also cleared
      if (!cookieArray[1]) {
        setproductSelected([]);
        setFirst({});
        setSecond({});
      } else {
        setFirst({});
      }
  
      // Update compare count with the callback form
      updateCompareCount((prevCount) => prevCount - 1);
    }
  };
  
  const handleClearSecond = () => {
    if (second && second._id) {
      const indexToRemove = cookieArray.indexOf(second._id);
  
      cookieArray.splice(indexToRemove, 1);
  
      const jsonString = JSON.stringify(cookieArray);
      Cookies.set('compare', jsonString, { expires: 365 });
  
      setproductSelected([]);
      setSecond({});
  
      // Update compare count with the callback form
      updateCompareCount((prevCount) => prevCount - 1);
    }
  };
  




  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const filteredProducts = allProducts.filter(product => product.category === selectedCategory);
    setproductSelected(filteredProducts)
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/compares`);
        const fetchedProductsData = res.data;

        SetAllProducts(fetchedProductsData.allProducts);
        Setcategories(fetchedProductsData.category);
        setFetchedProducts(fetchedProductsData);

        setIsLoading(false); // Set loading to false after fetching data
      } catch (error) {
        // Handle error, e.g., setIsLoading(false) and show an error message
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, []); 
  
  useEffect(() => {
    if (cookieArray[0]) {
      const firstItem = fetchedProducts.allProducts.find((product) => cookieArray[0] == product._id);
    
      if (firstItem) {
        setFirst(firstItem);
      }
    }
    
    if (cookieArray[1]) {
      const secondItem = fetchedProducts.allProducts.find((product) => cookieArray[1] === product._id);
    
      if (secondItem) {
        setSecond(secondItem);
      }
    }
  }, [cookieArray, fetchedProducts.allProducts]); // Add cookieArray as a dependency
  
  

  

  return (
    <Layout>
      
      <Head>
      <title>
  {isLoading
    ? "Loading..."
    : cookieArray.length == 0
    ? 'Compare'
    : (Object.keys(first).length > 0 && Object.keys(second).length > 0)
    ? `${first.title} vs ${second.title}`
    : (Object.keys(first).length > 0)
    ? first.title
    : (Object.keys(second).length > 0)
    ? second.title
    : (second?.title || 'No Title')}
</title>


</Head>
      {isLoading ? (
        <Loading /> // Render a loading spinner
      ) : (
        <div className={styles.container}>
            <h3>เลือกสำหรับการเปรียบเทียบ</h3>
          <div className={styles.card}>
            <h1>S P A C K B I K E T H</h1>
            <div className={styles.image}>
              <div className={styles.card_img}>
          { first &&
          
          Object.keys(first).length > 0 ? (
              <>
                <button className={styles.btn} onClick={handleClearFirst}>
                  X
                </button>
                <Image 
                  src={first.images[0]} 
                  alt="first Image"
                  width={500} 
                  height={300} 
                  priority 
                />
              </>
            ) : (
              <>
                <div className={styles.chose1}>
                    <button className={styles.chooseBtn}onClick={togglePopup} >เลือกจักรยาน</button>
                    
                  {isPopupVisible && (
                    <div className={styles.popup}>
                      {/* Popup content goes here */}
                      <button className={styles.btnColse} onClick={togglePopup}>X</button>
                      <h3>เลือกแบรนด์</h3>
                      <select className={styles.custom_select} onChange={handleCategoryChange}>
                          <option value="" disabled selected>
                            Select Category
                          </option>
                          {categories.map(category => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <div className={styles.showProducts}>
                          {productSelected.map(product => (
                            <div onClick={() => chooseProduct(product._id)} key={product._id} className={styles.productslist}>
                              <h4>{product.title}</h4>
                              <h4>{product.price.toLocaleString()}</h4>
                            </div>
                          ))}
                        </div>
                    </div>
                  )}
                </div>
              </>
             )} 
          </div>
        <div className={styles.card_img}>
        { second &&
          
          Object.keys(second).length > 0 ? (
              <>
                <button className={styles.btn} onClick={handleClearSecond}>
                  X
                </button>
                <Image 
                  src={second.images[0]} 
                  alt="second Image" 
                  width={500} // replace with actual width
                  height={300} // replace with actual height
                  priority // if necessary
                />
              </>
            ) : (
              <>
                <div className={styles.chose1}>
                  <button className={styles.chooseBtn}onClick={togglePopup}>เลือกจักรยาน</button>
                  

                  {isPopupVisible && (
                    <div className={styles.popup}>
                      {/* Popup content goes here */}
                      <button className={styles.btnColse} onClick={togglePopup}>X</button>
                      <h3>เลือกแบรนด์</h3>
                      <select className={styles.custom_select} onChange={handleCategoryChange}>
                          <option value="" disabled selected>
                            Select Category
                          </option>
                          {categories.map(category => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <div className={styles.showProducts}>
                          {productSelected.map(product => (
                            <div onClick={() => chooseProduct(product._id)} key={product._id} className={styles.productslist}>
                              <h4>{product.title}</h4>
                              <h4>{product.price.toLocaleString()}</h4>
                            </div>
                          ))}
                        </div>
                    </div>
                  )}
                </div>
              </>
             )} 
          </div>

        </div>
      </div>
      {Object.keys(first).length > 0 && Object.keys(second).length > 0 ? (
  <table className={styles.detail}>
    <tbody>
      <tr>
        <td className={styles.header}>Model</td>
        <td>{first.properties.model}</td>
        <td>{second.properties.model}</td>
      </tr>
      <tr>
        <td className={styles.header}>ราคา</td>
        <td>{first.price.toLocaleString()} บาท</td>
        <td>{second.price.toLocaleString()} บาท</td>
      </tr>
      <tr>
        <td className={styles.header}>ราคา มือสอง</td>
        <td>{first.secondhandprice.toLocaleString()} บาท</td>
        <td>{second.secondhandprice.toLocaleString()} บาท</td>
      </tr>
      <tr>
        <td className={styles.header}>Frame</td>
        <td>{first.properties.เฟรม}</td>
        <td>{second.properties.เฟรม}</td>
      </tr>
      <tr>
        <td className={styles.header}>ตะเกียบ</td>
        <td>{first.properties.ตะเกียบ}</td>
        <td>{second.properties.ตะเกียบ}</td>
      </tr>
      <tr>
        <td className={styles.header}>หลักอาน</td>
        <td>{first.properties.หลักอาน}</td>
        <td>{second.properties.หลักอาน}</td>
      </tr>
      <tr>
        <td className={styles.header}>มือเกียร์</td>
        <td>{first.properties.มือเกียร์}</td>
        <td>{second.properties.มือเกียร์}</td>
      </tr>
      <tr>
        <td className={styles.header}>เบรค</td>
        <td>{first.properties.เบรค}</td>
        <td>{second.properties.เบรค}</td>
      </tr>
      <tr>
        <td className={styles.header}>ชุดขาจาน</td>
        <td>{first.properties.ชุดขาจาน}</td>
        <td>{second.properties.ชุดขาจาน}</td>
      </tr>
      <tr>
        <td className={styles.header}>สับจานหน้า</td>
        <td>{first.properties.สับจานหน้า}</td>
        <td>{second.properties.สับจานหน้า}</td>
      </tr>
      <tr>
        <td className={styles.header}>ตีนผี</td>
        <td>{first.properties.ตีนผี}</td>
        <td>{second.properties.ตีนผี}</td>
      </tr>
      <tr>
        <td className={styles.header}>เฟืองหลัง</td>
        <td>{first.properties.เฟืองหลัง}</td>
        <td>{second.properties.เฟืองหลัง}</td>
      </tr>
      <tr>
        <td className={styles.header}>โซ่</td>
        <td>{first.properties.โซ่}</td>
        <td>{second.properties.โซ่}</td>
      </tr>
      <tr>
        <td className={styles.header}>ล้อ</td>
        <td>{first.properties.ล้อ}</td>
        <td>{second.properties.ล้อ}</td>
      </tr>
      <tr>
        <td className={styles.header}>ยาง</td>
        <td>{first.properties.ยาง}</td>
        <td>{second.properties.ยาง}</td>
      </tr>
      <tr>
        <td className={styles.header}>สเต็ม</td>
        <td>{first.properties.สเต็ม}</td>
        <td>{second.properties.สเต็ม}</td>
      </tr>
      <tr>
        <td className={styles.header}>แฮนด์</td>
        <td>{first.properties.แฮนด์}</td>
        <td>{second.properties.แฮนด์}</td>
      </tr>
      <tr>
        <td className={styles.header}>น้ำหนักรวม</td>
        <td>{first.properties.น้ำหนักรวม} KG</td>
        <td>{second.properties.น้ำหนักรวม} KG</td>
      </tr>
      <tr>
        <td className={styles.header}>Size</td>
        <td>{first.properties.Size}</td>
        <td>{second.properties.Size}</td>
      </tr>
      <tr>
        <td className={styles.header}>ความสูงที่แนะนำ</td>
        <td>{`${first.properties.min_hight} - ${first.properties.max_hight}`}</td>
        <td>{`${second.properties.min_hight} - ${second.properties.max_hight}`}</td>
      </tr>
    </tbody>
  </table>
) : (
  <div className={styles.notthing}>
    {/* Content to display when there is nothing in the table */}
  </div>
)}
  
        </div>
      )}
    </Layout>
  );
}
