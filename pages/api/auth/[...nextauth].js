import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials'
import {
	signInWithEmailAndPassword,
	signOut,
	setPersistence,
	browserLocalPersistence, updateProfile
} from "firebase/auth";
import {auth, storage} from "../../../firebase";
import {getDownloadURL, ref} from "firebase/storage";

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
							signOut(auth)
							return null
						}
						else{
							const imageRef = ref(storage, `profilePic/${auth.currentUser.displayName}/image`)
							const url = await getDownloadURL(imageRef)
							await updateProfile(auth.currentUser, {
								photoURL: url
							})
							return userCredential.user
						}
					})
					.catch(e => alert(e.message))
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

			//console.log(token.user)
			if (token.user.emailVerified !== undefined) {
				session.user.name = token.user.displayName;
				session.user.image = token.user.providerData[0].photoURL
				session.user.username = token.user.displayName
				session.fireUser = token.user
			}
			else {
				session.user.username = session.user.name
					.split(' ')
					.join('')
					.toLocaleLowerCase()
			}

			session.user.uid = token.sub
			return session;
		},

		redirect() {
			return 'http://localhost:3000';
		}
	}
})