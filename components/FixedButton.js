import { useEffect, useState } from 'react';
import styles from '../styles/FixedButton.module.css';
import Image from 'next/image';
import Cookies from 'js-cookie';
import Link from 'next/link'; // ✅ Import Link from next/link
import { useGlobalState } from './context/GlobalContext';

const FixedButton = () => {
    const [compareCount, setCompareCount] = useState(0);
    const { updateCompareCount } = useGlobalState();

    useEffect(() => {
        // Function to get all objects from the cookie
        function getAllObjectsFromCookie() {
            const cookieValue = Cookies.get("compare");

            if (cookieValue) {
                try {
                    const cookieArray = JSON.parse(cookieValue);
                    setCompareCount(cookieArray.length);
                } catch (error) {
                    console.error("Error parsing cookie as JSON:", error);
                }
            }
        }

        getAllObjectsFromCookie();
    }, [updateCompareCount]); 

    return (
        <div>
            {/* ✅ Replace <a> with <Link> */}
            <Link href="/compares" className={styles.fixedBtn}>
                <Image
                    src="/images/compare-svgrepo-com.svg"
                    alt="home"
                    width={30}
                    height={30}
                />
                <div className={styles.text}>
                    <h4>{compareCount}</h4>
                </div>
            </Link>
        </div>
    );
};

export default FixedButton;
