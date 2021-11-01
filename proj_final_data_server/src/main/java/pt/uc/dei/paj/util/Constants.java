package pt.uc.dei.paj.util;

import java.util.ArrayList;

import org.apache.commons.mail.SimpleEmail;

public final class Constants {

	private Constants(){}

	public static final String EMAIL_REGEX = "^((([a-z]|\\d|[!#\\$%&'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+(\\.([a-z]|\\d|[!#\\$%&'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+)*)|((\\x22)((((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(([\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f]|\\x21|[\\x23-\\x5b]|[\\x5d-\\x7e]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(\\\\([\\x01-\\x09\\x0b\\x0c\\x0d-\\x7f]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]))))*(((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(\\x22)))@((([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-z]|\\d|-|\\.|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.?$";
	public static final String USERNAME_REGEX = "^\\S+$"; // um ou mais caracteres sem espaços
	public static final String PASSWORD_REGEX = "^(?=\\S+$).{6,}$"; // min 6 caracteres, sem espaços
	public static final String ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	public static final int ITERATIONS = 10000;
	public static final int KEY_LENGTH = 256;
	
	// Encrypted and Base64 encoded password read from database
	public static final String SECUREPASSWORD = "HhaNvzTsVYwS/x/zbYXlLOE3ETMXQgllqrDaJY9PD/U=";
    
    // Salt value stored in database 
	public static final String SALT = "EqdmPh53c9x33EygXpTpcoJvc4VXLK";
	
	public static final String PHOTOS_FILE_PATH = "./proj_final/";
	public static final String PHOTO_FORMAT = ".jpeg";
	
	public static final String FILE_PATH = "./proj_final/Files/";
	
	public static final long TIMEOUT_MINUTES = 30;


	/***************************************************************************************************
     *                                    Admin Default 	                                               *
     ***************************************************************************************************/
	public static final String ADMIN_NAME = "Admin";
	public static final String ADMIN_EMAIL = "admin@mail.com";
	public static final String ADMIN_PASSWORD = "system";

	/***************************************************************************************************
     *                                    Email Options 	                                               *
     ***************************************************************************************************/
	public static final String EMAIL_SMTP = "projectFinalPAJ@gmail.com";
	public static final String PASSWORD_SMTP = "ProjectoFinal2020";
	public static final String HOST_SMTP = "smtp.gmail.com";
	public static final int PORT_SMTP = 465;
	
	/***************************************************************************************************
     *                                    Http Messages 	                                               *
     ***************************************************************************************************/
	public static final String AUTHENTICATION_FAILED =  "Authentication failed.";
	public static final String USER_CREATED = "User created.";
	public static final String PROJECT_CREATED = "Project created.";
	public static final String PROJECT_UPDATED = "Project updated.";
	public static final String ALLOCATION_CREATED = "Allocation created.";
	public static final String ACTIVITY_CREATED = "Activity created";
	public static final String EMAIL_IN_USE = "Email already in use.";
	public static final String INVALID_FIELDS = "Invalid fields.";
	public static final String REGISTRATION_VALIDATED = "Registration validated.";
	public static final String REGISTRATION_VALIDATION_FAILED = "Registration validation failed.";
	public static final String INACTIVE_ACCOUNT = "This acccount is not active.";
	public static final String REGISTRATION_FAILED = "Registration failed.";
	public static final String LOGIN_FAILED = "Login failed.";
	public static final String LOGIN_UNAUTHORIZED_PASSWORD = "Invalid password.";
	public static final String LOGIN_UNAUTHORIZED_ACTIVE = "User isn't active.";
	public static final String LOGIN_NOT_FOUND_USER = "User doesn't exist.";
	public static final String LOG_OUT_SUCCESS = "Log out with success.";
	public static final String LOGOUT_FAILED = "Logout failed.";
	public static final String RECORDS_NOT_EXISTS = "Records don't exists.";
	public static final String INVALID_FORMAT = "Invalid format";
	public static final String UPDATE_STATE_ACTIVE_SUCCESS = "Update active state with success.";
	public static final String UPDATE_USER_SUCCESS = "Update user with success.";
	public static final String UNAUTHORIZED_PERMISSION = "You don't have permission to do this operation.";
	public static final String EMAIL_RESET_PASSWORD_SUCCESSS = "Reset password email sent with success.";
	public static final String RESET_PASSWORD_SUCCESSS = "Reset password with success.";
	public static final String MANAGER_NOT_FOUND = "Manager not found";
	

	
	/*********************************1******************************************************************
     *                                   Endpoint Paths	                                               *
     ***************************************************************************************************/	
	public static final String PATH = "http://localhost:8080/proj6_data_server/backrest";
}
