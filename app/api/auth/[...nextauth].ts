import NextAuth from "next-auth"
import { authOptions } from "../../../app/api/auth/[...nextauth]/options"

export default NextAuth(authOptions)