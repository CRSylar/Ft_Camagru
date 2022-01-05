import SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_KEY;


const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();


export default function Mailer(req, res) {

	const {to, creatorName, username} = req.body

	console.log('T > ', to, '\nU > ', username)

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
		console.log('API called successfully. Returned data: ' + data);
	}, function(error) {
		console.error(error);
	});
}
