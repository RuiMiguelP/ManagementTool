package pt.uc.dei.paj.validator;


import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import pt.uc.dei.paj.util.EntityMapper;

public class ProjectTypologyValidator implements ConstraintValidator<ProjectTypology,Object>  {
	
	@Override
	public boolean isValid(Object value, ConstraintValidatorContext context) {
		boolean isValid = false;
        if (value == null) {
        	return isValid;
        }
        String projectTypology = value.toString();
        
        if (EntityMapper.mapProjectTypology(projectTypology) == null) {
        	return false;
        } else {
        	return true;
        }
	}
}
