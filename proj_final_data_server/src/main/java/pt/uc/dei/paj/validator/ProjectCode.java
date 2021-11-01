package pt.uc.dei.paj.validator;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target({ FIELD })
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = { ProjectCodeValidator.class })
public @interface ProjectCode {

	String message() default "project code is not valid.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
