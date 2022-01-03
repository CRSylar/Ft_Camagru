import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials'
import {signInWithEmailAndPassword, signOut,} from "firebase/auth";
import {auth} from "../../../firebase";

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		// ...add more providers here
		CredentialsProvider({
			id: 'Credentials',
			credentials: {
				email: {label:'Email', type:'email', placeholder:'john@doe.com'},
				password: {label:'Password', type:'password' }
			},
			async authorize(credentials) {
				return await signInWithEmailAndPassword(auth, credentials?.email, credentials?.password)
					.then(userCredential => {
						if (!userCredential.user.emailVerified)
							signOut(auth)
						else return userCredential.user
					})
					.catch(e => alert(e.message))
			}
		})
	],

	pages: {
		signIn: '/auth/signin',
	},

	callbacks: {
		async session({ session, token }) {

			if (session.user.name) {
				session.user.username = session.user.name
					.split(' ')
					.join('')
					.toLocaleLowerCase()
			}
			else {
				session.user.username = session.user.email
					.split('@')[0]
			}

			session.user.uid = token.sub
			return session;
		},

		redirect() {
			return 'http://localhost:3000';
		}
	}
})