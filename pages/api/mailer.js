import { MailSlurp } from "mailslurp-client";

const apiKey = process.env.MAIL_SLURP_API ?? 'your-api-key';
const mailslurp = new MailSlurp({ apiKey });


export default function Mailer(req, res) {

	const {to, username} = req.body

	console.log('T > ', to, '\nU > ', username)

	mailslurp.inboxController.sendEmail ({
		inboxId: '3f05f827-6a4c-49f3-a753-c7fe8a97f169',
		sendEmailOptions: {
			to: [to],
			subject: `noreply@Camagru - ${username} has commented your Post!`,
			body: `Hi ${to}, there's a new comment to one of your Post by ${username}, let's check it out at ${process.env.NEXTAUTH_URL}`,
		}
	})
		.catch(e => console.log(e))
}

/*
* '3f05f827-6a4c-49f3-a753-c7fe8a97f169', {
			to: [to],
			subject: `noreply@Camagru - ${username} has commented your Post!`,
			body: `Hi ${to}, there's a new comment to one of your Post by ${username}, let's check it out at ${process.env.NEXTAUTH_URL}`,
		}
*
* */