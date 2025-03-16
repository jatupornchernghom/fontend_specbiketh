import LayoutCompare from "@/components/Layout_compare";
import React, { useState } from "react";
import styles from "@/styles/Auth.module.css";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Image from "next/image";
import { useGlobalState } from "@/components/context/GlobalContext";
import axios from "axios";

export default function Account() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateLogin,updateProductFav } = useGlobalState();
  const router = useRouter();
  const { data: session } = useSession();

  React.useEffect(() => {
    if (session) {
      updateLogin(true);
      router.push("/");
    }
  }, [session, router, updateLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || (!isLogin && !name)) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      setLoading(false);
      return;
    }

    if (isLogin) {
      // Use NextAuth for credentials login
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        Swal.fire({
          icon: "success",
          title: "success",
          text: "คุณเข้าสู่ระบบแล้ว",
        });
        localStorage.removeItem('productFav');
        updateProductFav([])
        updateLogin(true);
        router.push("/");
      }
    } else {
      // Register new user
      try {
        const response = await axios.post("/api/register", {
          name,
          email,
          password,
        });
        
        if (response.data.success) {
          // After registration, log in automatically
          const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
          });
          
          if (result.error) {
            setError("Registration successful but login failed. Please try logging in.");
            setLoading(false);
          } else {
            Swal.fire({
              icon: "success",
              title: "success",
              text: "สร้างบัญชีเรียบร้อย",
            });
            router.push("/");
          }
        }
      } catch (error) {
        setError(error.response?.data?.error || "Something went wrong");
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    localStorage.removeItem('productFav');
    updateProductFav([])
    await signIn("google", { callbackUrl: '/' });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  return (
    <LayoutCompare>
      <Head>
        <title>{isLogin ? "เข้าสู่ระบบ" : "สร้างบัญชี"}</title>
      </Head>
      <div className={styles.authContainer}>
        <div className={styles.authBox}>
          <h1 className={styles.authTitle}>{isLogin ? "เข้าสู่ระบบ" : "สร้างบัญชี"}</h1>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <div className={styles.formGroup}>
                <label htmlFor="name">ชื่อบัญชี</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="กรุณากรอกชื่อบัญชี"
                  disabled={loading}
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="email">อีเมล</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="กรอกอีเมล์ของคุณ"
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">รหัสผ่าน</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านของคุณ"
                disabled={loading}
              />
            </div>

            {isLogin && (
              <div className={styles.forgotPassword}>
                <a href="/forgot-password">ลืมรหัสผ่าน?</a>
              </div>
            )}

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "กำลังดำเนินการ..." : isLogin ? "เข้าสู่ระบบ" : "สร้างบัญชี"}
            </button>
          </form>

          <div className={styles.divider}>
            <span>OR</span>
          </div>
            <div className={styles.authBtn}>
                <button 
                  onClick={handleGoogleLogin} 
                  className={styles.googleButton}
                  disabled={loading}
                >
                  <Image
                    src="/images/google-icon.webp"
                    alt="Google"
                    width={18}
                    height={18}
                    className={styles.googleIcon}
                  />
                  Continue with Google
                </button>
                <button 
                  onClick={handleGoogleLogin} 
                  className={styles.googleButton}
                  disabled={true}
                >
                  <Image
                    src="/images/facebook-icon.png"
                    alt="Google"
                    width={50}
                    height={50}
                    className={styles.googleIcon}
                  />
                  Continue with Facebook(coming soon)
                </button>
          </div>
          <div className={styles.switchMode}>
            {isLogin ? "ยังไม่มีบัญชีใช่ไหม?" : "มีบัญชีอยู่แล้วใช่ไหม?"}
            <button 
              onClick={toggleMode} 
              className={styles.switchButton}
              disabled={loading}
            >
              {isLogin ? "สร้างบัญชี" : "เข้าสู่ระบบ"}
            </button>
          </div>
        </div>
      </div>
    </LayoutCompare>
  );
}