package pt.uc.dei.paj.validator;

import javax.inject.Inject;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import pt.uc.dei.paj.dao.ProjectDAO;

public class ProjectCodeValidator implements ConstraintValidator<ProjectCode, Object> {

	@Inject
	ProjectDAO projectDAO;
	
	@Override
	public boolean isValid(Object value, ConstraintValidatorContext context) {
		boolean isValid = false;
        if (value == null) {
        	return isValid;
        }
        String projectCode = value.toString();

        if (projectDAO.findByCode(projectCode) == null) {
        	return true;
        } else {
        	return false;
        }
	}
}
