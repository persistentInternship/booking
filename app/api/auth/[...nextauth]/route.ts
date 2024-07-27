import NextAuth from "next-auth"
import { authOptions } from "./options"

// Create a NextAuth handler using the imported authOptions
const handler = NextAuth(authOptions)

// Export the handler for both GET and POST methods, and also export authOptions
export { handler as GET, handler as POST, authOptions }