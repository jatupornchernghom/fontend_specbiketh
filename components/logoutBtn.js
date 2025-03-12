import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useGlobalState } from "@/components/context/GlobalContext";
import Swal from "sweetalert2";

export const useLogout = () => {
  const router = useRouter();
  const { updateLogin } = useGlobalState();

  const handleLogout = async () => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'ออกจากระบบ',
        text: 'คุณต้องการออกจากระบบใช่หรือไม่?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ออกจากระบบ',
        cancelButtonText: 'ยกเลิก'
      });

      if (result.isConfirmed) {
        // Clear any local storage items first
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('email');
        localStorage.removeItem('productFav');

        
        // Use NextAuth signOut
        await signOut({ redirect: false });
        
        // Update global state
        updateLogin(false);
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'ออกจากระบบสำเร็จ',
          text: 'คุณได้ออกจากระบบเรียบร้อยแล้ว',
          timer: 1500
        });
        
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถออกจากระบบได้ กรุณาลองใหม่อีกครั้ง'
      });
    }
  };

  return { handleLogout };
};