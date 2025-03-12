import LayoutCompare from "@/components/Layout_compare";
import React, { useEffect, useState } from "react";
import styles from "@/styles/setting.module.css";
import Head from "next/head";
import {  signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/router";
import { useGlobalState } from "@/components/context/GlobalContext";

export default function Account() {
  const { data: session } = useSession();
  const router = useRouter();

  const {updateLogin} = useGlobalState()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [oldemail,setOldemail] = useState("")
  const [loading, setLoading] = useState(false);

  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  React.useEffect(() =>{
    if(!session){
        router.push("/");
    }
  })
  useEffect(() => {
    setEmail(session?.user?.email || localStorage.getItem("email"));
    setName(session?.user?.name || localStorage.getItem("user"));
    setOldemail(session?.user?.email)
  }, [session]);

  const handleCancel = () => {
    if (!editEmail && !editUsername && !editPassword) {
      router.push("/");
    } else {
      setEditEmail(false);
      setEditUsername(false);
      setEditPassword(false);
    }
    setError("");

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    if(!editUsername  && !editEmail && !editPassword){
        setError('ไม่มีการแก้ไขข้อมูล')
        setLoading(false);
        return ;
    }

    if(editPassword){
        if(password !== confirmPassword){
            setError('รหัสผ่านใหม่ ไม่ตรงกับ ยืนยันหรัสผ่านใหม่ กรุณาตรวจสอบให้ถูกต้อง ')
            setLoading(false);
            return ;
        }
        if(!oldPassword){
            setError('กรุณาตรวจสอบให้ถูกต้อง ')
            setLoading(false);
            return ;
        }
    }

        const response = await axios.put("/api/editUser", {
          name,
          email,
          password,
          oldPassword,
          oldemail,
        });
        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "แก้ไขข้อมูลเรียบร้อยแล้ว โปรดเข้าสู่ระบบใหม่อีกครั่ง",
            timer: 2000,
          });
    
          // Logout the current user
          await signOut({ redirect: false });
          updateLogin(false);
          router.push('/') 
        }
      
    };

  return (
    <LayoutCompare>
      <Head>
        <title>ข้อมูลผู้ใช้</title>
      </Head>
      <div className={styles.authContainer}>
        <div className={styles.authBox}>
          <h1 className={styles.authTitle}>ข้อมูลผู้ใช้</h1>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* ชื่อบัญชี */}
            <div className={styles.formGroup}>
              <label htmlFor="name">ชื่อบัญชี</label>
              {editUsername ? (
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              ) : (
                <div className={styles.userinput}>
                  <h3>{name}</h3>
                  <button type="button" onClick={() => setEditUsername(true)}>
                    แก้ไข
                  </button>
                </div>
              )}
            </div>

            {/* อีเมล */}
            <div className={styles.formGroup}>
              <label htmlFor="email">อีเมล</label>
              {editEmail ? (
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              ) : (
                <div className={styles.userinput}>
                  <h3>{email}</h3>
                  <button type="button" onClick={() => setEditEmail(true)}>
                    แก้ไข
                  </button>
                </div>
              )}
            </div>

            {/* รหัสผ่าน */}
            <div className={styles.formGroup}>
              <label htmlFor="password">
                {editPassword ? "รหัสผ่านเดิม" : "รหัสผ่าน"}
              </label>
              {editPassword ? (
                <div className={styles.passwordinput}>
                  <input
                    type="password"
                    id="oldpassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={loading}
                  />
                  <label>รหัสผ่านใหม่</label>
                  <input
                    type="password"
                    id="newpassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <label>ยืนยันหรัสผ่านใหม่</label>
                  <input
                    type="password"
                    id="confirmpassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              ) : (
                <div className={styles.userinput}>
                  <h3>****************</h3>
                  <button type="button" onClick={() => setEditPassword(true)}>
                    แก้ไข
                  </button>
                </div>
              )}
            </div>

            {/* ปุ่มบันทึกและยกเลิก */}
            <div className={styles.btn}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "กำลังดำเนินการ..." : "บันทึกข้อมูล"}
              </button>

              <button
                className={styles.cancelButton}
                type="button"
                onClick={handleCancel}
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutCompare>
  );
}
