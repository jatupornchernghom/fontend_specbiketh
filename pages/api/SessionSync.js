import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useGlobalState } from "@/components/context/GlobalContext";

export function SessionSync() {
  const { data: session } = useSession();
  const { updateLogin, updateImgProfile, updateUser,updateProductFav } = useGlobalState();

  useEffect(() => {
    if (session) {
      // Store session data in localStorage
      localStorage.setItem("token", session.accessToken);
      localStorage.setItem("user", session.user.name);
      localStorage.setItem("email", session.user.email);


      
      // Only set image if it exists
      if (session.user.image) {
        localStorage.setItem("image", session.user.image);
      }
      
      // Update global state
      updateLogin(true);
      updateImgProfile(session.user.image || "");
      updateUser(session.user.name);
    } else {
      // Clear localStorage when no session exists
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("email");
      localStorage.removeItem("image");
      
      // Update global state to reflect logged out status
      updateLogin(false);
      updateImgProfile("");
      updateUser("");
    }
  }, [session, updateLogin, updateImgProfile, updateUser]);

  return null; // This component doesn't render anything
}