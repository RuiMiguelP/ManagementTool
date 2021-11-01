package pt.uc.dei.paj.validator;

import java.util.regex.Pattern;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import pt.uc.dei.paj.util.Constants;

public class PasswordValidator implements ConstraintValidator<Password,Object> {

	@Override
    public boolean isValid(Object arg0, ConstraintValidatorContext arg1) {
        boolean isValid = false;
        if (arg0 == null) {
        	return isValid;
        }
            
        String password = arg0.toString();
        return Pattern.matches(Constants.PASSWORD_REGEX, password);
   }
}
