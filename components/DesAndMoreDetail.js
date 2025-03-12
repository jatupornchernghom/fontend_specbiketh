import styles from "@/styles/DesAndMoreDetail.module.css";
import Link from "next/link";
import Image from "next/image";



export default function Description_moredetail({productInfo}){
    const getYouTubeVideoId = (url) => {
        const match = url.match(/[?&]v=([^&]+)/);
        return match && match[1];
    };


    
    
    
    const prop = productInfo.properties
    const youtubeId = getYouTubeVideoId(prop.Video_Review)
    
    const NameOfProduct = productInfo.title

    return(
        <div className={styles.contentner}>
            <div className={styles.description}>
                <h2>Description</h2>
                <span>{productInfo.description}</span>
            </div>
            <div className={styles.box}>
                <div className={styles.alldetail}>
                    <h3>รายละเอียดทั้งหมด</h3>
                    <div className={styles.centerTable}>
    {prop && (
        <table>
            <tbody>
                {Object.keys(prop)
                    .filter(
                        (key) =>
                            key !== "min_hight" &&
                            key !== "max_hight" &&
                            key !== "สี" &&
                            key !== "Size" &&
                            key !== "Video_Review"
                    )
                    .map((key, index) => (
                        <tr key={index}>
                            <td className={styles.headername}>{key}</td>
                            <td className={styles.detailname}>{prop[key]}</td>
                        </tr>
                    ))}
            </tbody>
        </table>)}
            </div>
                </div>        
                <div className={styles.Video_Review}>
                    <h3 >Video Review</h3>
                    <div className={styles.frame}>
                        <iframe
                        width="500"
                        height="300"
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allowFullScreen
                    >
                    </iframe>
                    </div>
                    <div className={styles.findinny}>
                        <h3>ร้านค้าออนไลน์</h3>
                        <div className={styles.shoppee}>
                            <Link href={`https://shopee.co.th/search?keyword=${NameOfProduct}`} target="_blank" rel="noopener noreferrer">
                                <Image 
                                    src="/images/shoppe.jpg" 
                                    alt="Shopee"  
                                    width={100} 
                                    height={100} 
                                    quality={100}
                                />
                                    <button className={styles.lazada1}>ดูสินค้า</button>

                            </Link>
                            <Link href={`https://www.lazada.co.th/catalog/?q=${NameOfProduct}`} target="_blank" rel="noopener noreferrer">
                            <Image src="/images/lazada.webp" 
                                alt="lazada"
                                width={100} 
                                height={100} 
                                quality={100} 
                                />
                            <button className={styles.lazada}>ดูสินค้า</button>
                            </Link>
                        </div>             
                        </div>
                </div>

            </div>
        </div>
    )
}


