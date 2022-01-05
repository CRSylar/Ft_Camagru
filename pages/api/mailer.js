import SibApiV3Sdk from 'sib-api-v3-sdk';
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../../firebase";

const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_KEY;


const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();


export default async function Mailer(req, res) {

	const {to, creatorName, username} = req.body

	let q = query(collection(db, 'users'),
		where('email', '==', to))
	const querySnap = await getDocs(q)
	querySnap.forEach( doc => q = doc.data())

	if (q.notification) {
		sendSmtpEmail = {
			to: [{
				email: to,
				name: 'CamagruApp'
			}],
			templateId: 1,
			params: {
				creatorName,
				username,
				host: process.env.NEXTAUTH_URL
			},
		};
		apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
			res.status(200).json({ status: 'Ok' })
		}, function(error) {
			console.error(error);
			res.status(400).json({ status: 'Some Error Happened', message: error })
		});
	}
	else {
		res.status(200).json({ status: 'Ok' })
	}
}
