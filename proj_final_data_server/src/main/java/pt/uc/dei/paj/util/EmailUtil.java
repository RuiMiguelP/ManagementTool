package pt.uc.dei.paj.util;


import org.apache.commons.mail.DefaultAuthenticator;
import org.apache.commons.mail.SimpleEmail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EmailUtil {
	private static final Logger LOGGER = LoggerFactory.getLogger(EmailUtil.class.getName());

	public static void sendEmail(String[] adminEmais, String name, String email) {

		SimpleEmail simpleEmail = new SimpleEmail();
		simpleEmail.setHostName(Constants.HOST_SMTP);
		simpleEmail.setSmtpPort(Constants.PORT_SMTP);
		simpleEmail.setAuthenticator(new DefaultAuthenticator(Constants.EMAIL_SMTP, Constants.PASSWORD_SMTP));
		simpleEmail.setSSLOnConnect(true);

		try {
			simpleEmail.setFrom(email);
			simpleEmail.setSubject("New User");
			simpleEmail.setMsg("This user \"" + name + "\" with email \"" + email + "\" needs a new profile.");
			simpleEmail.addTo(adminEmais);
			simpleEmail.send();
			LOGGER.info("Email sent!");
		} catch (Exception e) {
			LOGGER.warn(e.toString());
		}
	}

	public static void sendConfirmationEmail(String email, String confirmationURL) {

		SimpleEmail simpleEmail = new SimpleEmail();
		simpleEmail.setHostName(Constants.HOST_SMTP);
		simpleEmail.setSmtpPort(Constants.PORT_SMTP);
		simpleEmail.setAuthenticator(new DefaultAuthenticator(Constants.EMAIL_SMTP, Constants.PASSWORD_SMTP));
		simpleEmail.setSSLOnConnect(true);

		try {
			simpleEmail.setFrom(Constants.EMAIL_SMTP);
			simpleEmail.setSubject("Email confirmation");
			simpleEmail.setMsg("Clik this link to confirm your email: " + confirmationURL);
			simpleEmail.addTo(email);
			simpleEmail.send();
			LOGGER.info("Confirmation Email sent!");
		} catch (Exception e) {
			LOGGER.warn(e.toString());
		}
	}

	public static void sendResetPasswordEmail(String email, String resetPasswordURL) {

		SimpleEmail simpleEmail = new SimpleEmail();
		simpleEmail.setHostName(Constants.HOST_SMTP);
		simpleEmail.setSmtpPort(Constants.PORT_SMTP);
		simpleEmail.setAuthenticator(new DefaultAuthenticator(Constants.EMAIL_SMTP, Constants.PASSWORD_SMTP));
		simpleEmail.setSSLOnConnect(true);

		try {
			simpleEmail.setFrom(Constants.EMAIL_SMTP);
			simpleEmail.setSubject("Reset password");
			simpleEmail.setMsg("Clik this link to reset your password: " + resetPasswordURL);
			simpleEmail.addTo(email);
			simpleEmail.send();
			LOGGER.info("Reset Password Email sent!");
		} catch (Exception e) {
			LOGGER.warn(e.toString());
		}
	}

	public static void sendEmailFromVisitorToAdmin(String[] adminEmails, String userName, String userEmail) {

		SimpleEmail simpleEmail = new SimpleEmail();
		simpleEmail.setHostName(Constants.HOST_SMTP);
		simpleEmail.setSmtpPort(Constants.PORT_SMTP);
		simpleEmail.setAuthenticator(new DefaultAuthenticator(Constants.EMAIL_SMTP, Constants.PASSWORD_SMTP));
		simpleEmail.setSSLOnConnect(true);

		try {
			simpleEmail.setFrom(Constants.EMAIL_SMTP);
			simpleEmail.setSubject("Upgrade visitor account");
			simpleEmail.setMsg("User " + userName + ", with the following email account: " + userEmail
					+ " wants his(er) account upgraded.");

			simpleEmail.addTo(adminEmails);

			simpleEmail.send();
			LOGGER.info("Upgrade visitor account Email sent to admin!");
		} catch (Exception e) {
			LOGGER.warn(e.toString());
		}
	}
}
