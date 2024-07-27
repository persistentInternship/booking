import { NextAuthOptions } from "next-auth"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../../lib/mongodb"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"

export const authOptions: NextAuthOptions = {
  // Use MongoDB as the adapter for NextAuth
  adapter: MongoDBAdapter(clientPromise),
  
  providers: [
    // Set up Credentials provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const client = await clientPromise
        const usersCollection = client.db().collection("users")
        const user = await usersCollection.findOne({ email: credentials.email })

        if (!user) {
          throw new Error("No user found")
        }

        // Compare provided password with stored hashed password
        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        // Return user object if authentication is successful
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        }
      }
    })
  ],
  
  // Use JWT for session handling
  session: {
    strategy: "jwt"
  },
  
  callbacks: {
    // Callback to add user id to the token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    // Callback to add user id to the session
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
      }
      return session
    }
  },
  
  // Custom pages
  pages: {
    signIn: '/', // Use the home page as the sign-in page
  },
  
  // Secret used to encrypt the NextAuth.js JWT
  secret: process.env.NEXTAUTH_SECRET
}