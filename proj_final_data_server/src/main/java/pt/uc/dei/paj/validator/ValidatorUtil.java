package pt.uc.dei.paj.validator;


import pt.uc.dei.paj.entity.User;
import pt.uc.dei.paj.util.PasswordUtils;

public class ValidatorUtil {

	public static boolean isNullOrEmpty(String str) {
		if (str != null && !str.trim().isEmpty()) {
			return false;
		}
		return true;
	}
	
	public static boolean verifyProvidedPassword(String providedPassword, String securePassword, String salt) {
		boolean passwordMatch = PasswordUtils.verifyUserPassword(providedPassword, securePassword, salt);

		if (passwordMatch) {
			return true;
		} else {
			return false;
		}
	}

	public static boolean verifyProvidedGoogleId(String providedGoogleId, String googleId) {
		if (providedGoogleId.equalsIgnoreCase(googleId)) {
			return true;
		}
		return false;
	}

	public static boolean verifyActiveStatus(User user) {
		return user.isActive();
	}

	
}
