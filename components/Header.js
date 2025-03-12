import React, { useState, useEffect } from "react";
import styles from '@/styles/Header.module.css';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useGlobalState } from "./context/GlobalContext";
import ProfileDropdown from "./ProfileDropdown";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Header({ children }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { compareCount, updateCompareCount, isLoggedIn, updateLogin } = useGlobalState();
  const [mounted, setMounted] = useState(false); // Track if component is mounted

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  const handleLogout = () => {
    updateLogin(false);
    localStorage.clear();
    router.push("/");
  };

  useEffect(() => {
    setMounted(true); // Set mounted to true after the component is mounted on the client
    function getAllObjectsFromCookie() {
      const cookieValue = Cookies.get("compare");
      if (cookieValue) {
        try {
          const cookieArray = JSON.parse(cookieValue);
          // Use the global updateCompareCount to update the count
          updateCompareCount(cookieArray.length);
        } catch (error) {
          console.error("Error parsing cookie as JSON:", error);
        }
      }
    }



    getAllObjectsFromCookie();
  }, [updateCompareCount]);

  if (!mounted) {
    return null; // Return null until the component is mounted to avoid hydration mismatch
  }

  return (
    <header className={styles.header}>
      <div className={styles.center}>
        <div className={styles.wrapper}>
          <Link href="/" className={styles.logo}>SPEC BIKETH</Link>
          <div className={styles.menu_button}>
          {isLoggedIn ? (
              <ProfileDropdown onLogout={handleLogout} />
            ) : (
              <Link href="/login" onClick={closeMenu}>
                 <Image
                        src={"/images/default-profile.jpg"}
                        alt="Profile"
                        width={30}
                        height={30}
                        className={styles.profileImage}
                      />
              </Link>
            )}
            <button className={styles.menu_button} onClick={toggleMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                <path d="M 5 9 L 5 11 L 45 11 L 45 9 L 5 9 z M 5 24 L 5 26 L 45 26 L 45 24 L 5 24 z M 5 39 L 5 41 L 45 41 L 45 39 L 5 39 z"></path>
              </svg>
            </button>
          </div>


          <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ""}`}>
            <button className={styles.close_button} onClick={closeMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
                <path d="M 7.7070312 6.2929688 L 6.2929688 7.7070312 L 23.585938 25 L 6.2929688 42.292969 L 7.7070312 43.707031 L 25 26.414062 L 42.292969 43.707031 L 43.707031 42.292969 L 26.414062 25 L 43.707031 7.7070312 L 42.292969 6.2929688 L 25 23.585938 L 7.7070312 6.2929688 z"></path>
              </svg>
            </button>

            <Link href="/" onClick={closeMenu}>หน้าแรก</Link>
            <Link href="/Bicycles" onClick={closeMenu}>จักรยานทั้งหมด</Link>
            <Link href="/compares" onClick={closeMenu}>เปรียบเทียบ({compareCount})</Link>
            <Link href="/favorite" onClick={closeMenu}>รายการโปรด</Link>
            <div className={styles.usernav}>
            {isLoggedIn ? (
              <ProfileDropdown onLogout={handleLogout}/>
            ) : (
              <Link href="/login" onClick={closeMenu}>เข้าสู่ระบบ</Link>
            )}
            </div>
          </nav>
        </div>
      </div>
      <div>{children}</div>
    </header>
  );
}
