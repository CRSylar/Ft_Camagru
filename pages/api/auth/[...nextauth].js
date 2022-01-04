import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials'
import {
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import {auth, db} from "../../../firebase";
import {collection, getDocs, query, where} from "firebase/firestore";

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
					.then( async userCredential => {
						if (!userCredential.user.emailVerified) {
							await signOut(auth)
							return null
						}
						else{
							let q = query(collection(db, 'users'),
								where('email', '==', userCredential.user.email))
							const querySnap = await getDocs(q)
							querySnap.forEach( doc => {
								q = doc.data()
								console.log(doc.id, ' > ', doc.data())
							})
							return q
						}
					})
					.catch(e => console.log(e.message))
			}
		})
	],

	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: '/auth/signin',
	},

	callbacks: {
		async jwt({ token, user}){
			user && (token.user = user)
			return token
		},

		async session({session, token }) {

			session.user = token.user;
			return session;
		},

		redirect() {
			return 'http://localhost:3000';
		}
	}
})