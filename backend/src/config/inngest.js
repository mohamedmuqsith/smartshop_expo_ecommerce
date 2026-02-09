import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

export const inngest = new Inngest({ id: "expo-ecommerce" });

const syncUser = inngest.createFunction(
   { id: "sync-user" },
   { event: "clerk/user.created" },
   async ({ event }) => {
      await connectDB();
      const { id, email_addresses, first_name, last_name, image_url } = event.data;

      // Validate email exists before creating user
      const email = email_addresses?.[0]?.email_address;
      if (!email) {
         throw new Error(`Cannot create user ${id}: No email address provided`);
      }

      const newUser = {
         clerkId: id,
         email: email,
         name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
         imageUrl: image_url || "",
         addresses: [],
         wishlist: [],
      };

      await User.create(newUser);
   }
);

const deleteUserFromDB = inngest.createFunction(
   { id: "delete-user-from-db" },
   { event: "clerk/user.deleted" },
   async ({ event }) => {
      await connectDB();

      const { id } = event.data;
      await User.deleteOne({ clerkId: id });
   }
);

export const functions = [syncUser, deleteUserFromDB];