import { Login } from "@/models/Login";
import { mongooseConnect } from "@/lib/mongoose";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    const { method } = req;

    const session = await getSession({ req });

    if (!session || !session.user?.email) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const email = session.user.email;

    await mongooseConnect();

    if (method === "GET") {
        try {
            const user = await Login.findOne({ email }).populate("favorites", "_id title price images");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.json(user.favorites);
        } catch (error) {
            console.error("Error fetching favorites:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    } else {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
}
