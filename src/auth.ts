import CredentialProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

import prisma from "./prismaClient"
import { compare } from "bcryptjs"
import NextAuth ,{AuthError} from "next-auth"
export const { handlers, signIn, signOut, auth } = NextAuth ({
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string, 
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
      }),
    CredentialProvider({
    name: "Credentials",
   
    credentials: {
      email: { label: "email", type: "email" },
      password: { label: "Password", type: "password" }
    },

     authorize: async(credentials:any)=> {
        const email = credentials.email as string 
        const password = credentials.password as string 
      const user = await prisma.user.findUnique({
        where: {
            email : email 
            },

      })
      if (!user) {
        throw new Error("invalid email or password")
      }
      const isMatch = await compare(password,user.password || "")
      if (!isMatch) {
        throw new Error("incorrect password")
        }

      if (user) {   
        return {id:user.id,name:user.name,email:user.email,isVerified:user.isVerified,role:user.role}
      } else {
        return null

      }
    }
  })
],
secret: process.env.AUTH_SECRET,
debug: true,

session:{
    strategy:'jwt',
},
pages:{
    signIn:'/login',
},
callbacks: {
    signIn: async ({user,account})=>{
        if (account?.provider==="google") {
            try {
                const {id,name,email,image} = user;
                const alreadyUser = await prisma.user.findUnique({
                    where: {
                        email: email as string
                    },
                    })
                    if (!alreadyUser) {
                         await prisma.user.create({
                            data: {
                                id: id,
                                name: name as string,
                                email: email as string,
                                isVerified: true,
                                image:image,
                                provider:'google'
                                
                                },
                                })
                            }
                           
                            return true
                  
                    
            } catch (error) {
                throw new AuthError("Error while creating user")
            }
        }
            if(account?.provider === "credentials"){
                console.log("user signed with credentials: ", user);
                return true
            }
            return false
    },
     async jwt({ user, token }) {
      // Persist the OAuth access_token to the token right after signin
      console.log('authUser',user);

      if (user) {
        token.id = user.id,
        token.name = user.name,
        token.email = user.email,
        token.role = user.role 
        token.isVerified = user.isVerified 
        token.image=user.image
        // if (!user.role && user.email) {
        //   try {
        //     const dbUser = await prisma.user.findUnique({
        //       where: { email: user.email },
        //       select: { role: true },
        //     });
        //     token.role = dbUser?.role || "UNASSIGNED";
        //   } catch (error) {
        //     console.error("Error fetching user role:", error);
        //     token.role = "employee"; // fallback
        //   }
        // } else {
        //   token.role = user.role;
        // }
      }
      console.log('authtoken',token);
      return token
    },

    async session({ session, token }) {
        if (token) {
            session.user={
            id : token.id as string ,
            name : token.name as string,
            email : token.email as string,
            role :token.role as string,
            isVerified:token.isVerified as boolean,
            image:token.image as string,
            emailVerified: null // Ensure this field is present
            
        }

        }
        console.log('authsession',session);
        const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    session.user.role = user?.role || session.user.role;
    
    // If you kept the field as "Image" in Prisma:
    session.user.image = user?.image || session.user.image;
    // session.user.role = user?.role || session.user.role;
      return session
    }
  }
}
)