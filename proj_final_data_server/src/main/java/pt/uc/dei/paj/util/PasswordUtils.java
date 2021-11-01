package pt.uc.dei.paj.util;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Arrays;
import java.util.Base64;
import java.util.Random;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public class PasswordUtils {

	private static final Random RANDOM = new SecureRandom();

	public static String getSalt(int length) {
		StringBuilder returnValue = new StringBuilder(length);

		for (int i = 0; i < length; i++) {
			returnValue.append(Constants.ALPHABET.charAt(RANDOM.nextInt(Constants.ALPHABET.length())));
		}

		return new String(returnValue);
	}

	public static byte[] hash(char[] password, byte[] salt) {
		PBEKeySpec spec = new PBEKeySpec(password, salt, Constants.ITERATIONS, Constants.KEY_LENGTH);
		Arrays.fill(password, Character.MIN_VALUE);
		try {
			SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
			return skf.generateSecret(spec).getEncoded();
		} catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
			throw new AssertionError("Error while hashing a password: " + e.getMessage(), e);
		} finally {
			spec.clearPassword();
		}
	}
	
	public static String[] generateSecurePassword(String providedPassword) {
		String[] arrayInfo = new String[2];
		// Generate Salt. The generated value can be stored in DB.
		String salt = PasswordUtils.getSalt(30);
		arrayInfo[0] = salt;
		// Protect user's password. The generated value can be stored in DB.
		String mySecurePassword = PasswordUtils.generateSecurePassword(providedPassword, salt);
		arrayInfo[1] = mySecurePassword;
		return arrayInfo;
	}

	public static String generateSecurePassword(String password, String salt) {
		String returnValue = null;

		byte[] securePassword = hash(password.toCharArray(), salt.getBytes());

		returnValue = Base64.getEncoder().encodeToString(securePassword);

		return returnValue;
	}
	
	public static boolean verifyUserPassword(String providedPassword, String securedPassword, String salt) {
		boolean returnValue = false;

		// Generate New secure password with the same salt
		String newSecurePassword = generateSecurePassword(providedPassword, salt);

		// Check if two passwords are equal
		returnValue = newSecurePassword.equalsIgnoreCase(securedPassword);

		return returnValue;
	}
}
