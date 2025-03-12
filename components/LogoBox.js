import Styles from "../styles/LogoBox.module.css";
import Link from "next/link";
import Image from "next/image";


export default function LogoBox({ _id, name, images }) {
  return (
    <div className={Styles.LogoWrapper}>
      <div className={Styles.container}>
        <div className={Styles.logoitem}>
            <div className={Styles.logoimg} key={_id}>
            <Link href={'/brand/'+ name }>
              <Image  src={images} alt={name} width={100} height={100} quality={100}/>
            </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
