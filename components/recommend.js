import styles from "@/styles/MostViewsAndliely.module.css"
import Image from "next/image"




export default function MostViewsAndlikely({recommend}) {
    return (
        <div className={styles.MLV}>
            <h3>คุณอาจจะชอบ</h3>
            <div className={styles.container}>
                    {recommend?.length > 0 && recommend.map((recommend,index) => (
                        <div className={styles.card} key={index}>
                        <a href={"" +recommend._id}data-id="1">
                            <Image src={recommend.images[0]} alt={`Image ${index + 1}`} width={250} height={250} quality={100} /> 
                        </a>
                           
                            <h4> {recommend.title}</h4>
                            <p>ราคา {recommend.price}</p>
                        </div>
                    ))}
            </div>
            
        </div>
    )

}