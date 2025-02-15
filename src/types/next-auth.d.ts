// import NextAuth from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       email: string;
//       name: string;
//       image: string;
//       isVerified: boolean;
//     };
//   }
// }

import { DefaultUser } from "next-auth";

declare module "next-auth" {
    interface User extends DefaultUser {
        isVerified?: boolean;
        role:string;
    }
    interface Session {
        user: {
          id: string;
          name: string;
          email: string;
          isVerified?: boolean | null; // Optional or nullable
          image?: string;
          role:string;
          isVerified: boolean

        };
      }
    
      interface JWT {
        id: string;
        name: string;
        email: string;
        role:string;
        image?: string;
        isVerified: boolean
      }
}
