import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/ProfileDropdown.module.css';
import { useGlobalState } from './context/GlobalContext';
import { useLogout } from './logoutBtn';
import Link from 'next/link';

const ProfileDropdown = ({ username, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {user,imgProfile} = useGlobalState()

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const { handleLogout } = useLogout();
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div 
        className={styles.profileContainer} 
        onClick={toggleDropdown}
      >
       <Image
        src={imgProfile || "/images/default-profile.jpg"}
        alt="Profile"
        width={30}
        height={30}
        className={styles.profileImage}
      />

        <span>{user}</span>
      </div>
      
      {isOpen && (
        <div className={styles.dropdownContent}>
          <Link href="/setting" >
          <div className={styles.dropdownItem}>Settings</div>
          </Link>
          <div 
            className={styles.dropdownItem} 
            onClick={handleLogout}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;