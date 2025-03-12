import Styles from "../styles/LogoBrand.module.css"
import Link from "next/link";
import Image from "next/image";

export default function categories({categories}) {
    const brand = categories.filter(brand => brand.images); // Use a single set of parentheses around the parameter


    return (
        <div className={Styles.brands}>   
            <h2>แบรนด์</h2>    
            <div className={Styles.brandLogos}>
                {brand?.length > 0 && brand.map((brand) =>(
                <div key={brand._id} className={Styles.brandLogo}>
                    <Link href={'/brand/'+ brand.name }>
                        <Image 
                            src={brand.images} 
                            alt={brand.name}
                            width={100} 
                            height={100} 
                            quality={100} 
                        />
                    </Link>
                </div>
            ))}
                </div>
            </div> 

    )
}


