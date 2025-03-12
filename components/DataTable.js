import styles from "@/styles/DataTable.module.css"
import Image from "next/image"
import Cookies from 'js-cookie';
import { useGlobalState } from './context/GlobalContext';
import Swal from 'sweetalert2'; // Import sweetalert2







export default function DataTable  ({productInfo}) {
    const properties = productInfo?.properties
    const { updateCompareCount } = useGlobalState();

    const saveToCookie = (productInfo) => {
        // Retrieve existing array from the cookie
        const existingArray = Cookies.get('compare');
    
        // If the cookie exists, parse it; otherwise, initialize an empty array
        const dataArray = existingArray ? JSON.parse(existingArray) : [];
        if (dataArray.length >= 2) {
            // Show sweet alert here
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'คุณสามารถเปรียบเทียบ จักรยานได้ สูงสุดสองรายการเท่านั้น!',
            });
            return;
          }else{
            Swal.fire({
                icon: 'success',
                title: 'success',
                text: 'เพิ่มในรายการเรียบร้อย!',
              });
          }
      
    
        // Add the product ID to the array
        dataArray.push(productInfo);
    
        // Convert the updated array to a JSON string
        const jsonString = JSON.stringify(dataArray);
    
        // Set the JSON string back to the cookie
        Cookies.set('compare', jsonString, { expires: 365 });
        const existingArray1 = Cookies.get('compare');
        const cookieArray = JSON.parse(existingArray1);
        updateCompareCount(cookieArray.length);


      };
    
    


    return (
        <div className={styles.DataTable}>
            <div className={styles.samary_detail}>
                <h3>Samary Detail</h3>
                <div className={styles.lineOne}>
                    <div className={styles.Total_weight}>
                        <div className={styles.box}>
                            <h3>เฟรม</h3>
                                <Image 
                                    src="/images/frame.png"
                                    alt="home"
                                    width={45}
                                    height={45}
                                    
                                />
                                <h4>{properties.เฟรม}</h4>
                        </div> 
                    </div>
                    <div className={styles.Total_weight}>
                        <div className={styles.box}>
                        <h3>น้ำหนัก</h3>
                            <Image 
                                src="/images/weight.svg"
                                alt="home"
                                width={45}
                                height={45}
                                
                            />
                            <h4>{properties.น้ำหนักรวม} Kg</h4>
                        </div> 
                    </div>
                    <div className={styles.Total_weight}>
                    <div className={styles.box}>
                        <h3>ราคา</h3>
                                <Image 
                                    src="/images/bath.svg"
                                    alt="home"
                                    width={45}
                                    height={45}
                                    
                                />
                                <h4>{productInfo.price.toLocaleString()} บาท</h4>
                        </div> 
                    </div>
                </div>
                <div className={styles.lineOne}>
                    <div className={styles.Total_weight}>
                        <div className={styles.box}>
                             <h3>ล้อ</h3>
                            <Image 
                                src="/images/wheel1.png"
                                alt="home"
                                width={45}
                                height={45}
                                
                            />
                            <h4>{properties.ล้อ}</h4>
                        </div> 
                    </div>
                    <div className={styles.Total_weight}>
                        <div className={styles.box}>
                        <h3>ความสูงที่แนะนำ</h3>
                            <Image 
                                src="/images/height.png"
                                alt="home"
                                width={45}
                                height={45}
                                
                            />
                            <h4>{properties.min_hight} - {properties.max_hight} CM</h4>
                        </div> 
                    </div>
                    <div className={styles.Total_weight}>
                    <div className={styles.box}>
                        <h3>ราคามือสอง</h3>
                                    <Image 
                                        src="/images/Bike.png"
                                        alt="home"
                                        width={45}
                                        height={45}
                                        
                                    />
                                <h4>{productInfo.secondhandprice.toLocaleString()} บาท</h4>
                        </div> 
                    </div>
                </div>
                    <div className={styles.addToCompare}>
                    <button onClick={() => saveToCookie(productInfo._id)}>+ เปรียบเทียบ</button>

                    </div>
            </div>
        </div>
    )
    }