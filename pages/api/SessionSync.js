import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useGlobalState } from "@/components/context/GlobalContext";

export function SessionSync() {
  const { data: session } = useSession();
  const { updateLogin, updateImgProfile, updateUser,updateProductFav } = useGlobalState();

  useEffect(() => {
    if (session) {
      localStorage.setItem("token", session.accessToken);
      localStorage.setItem("user", session.user.name);
      localStorage.setItem("email", session.user.email);

      if (session.user.image) {
        localStorage.setItem("image", session.user.image);
      }
      
      updateLogin(true);
      updateImgProfile(session.user.image || "");
      updateUser(session.user.name);
    } else {
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("email");
      localStorage.removeItem("image");
      
      updateLogin(false);
      updateImgProfile("");
      updateUser("");
    }
  }, [session, updateLogin, updateImgProfile, updateUser]);

  return null;
}
