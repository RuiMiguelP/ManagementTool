package pt.uc.dei.paj.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ FIELD })
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = { PasswordValidator.class })
public @interface Password {

	String message() default "password is not valid.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
