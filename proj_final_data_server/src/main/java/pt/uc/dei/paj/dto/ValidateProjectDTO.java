package pt.uc.dei.paj.dto;

import java.io.Serializable;

public class ValidateProjectDTO extends AbstractDTO implements Serializable {
	private static final long serialVersionUID = 1L;

	private String code;

	private String managerEmail;

	private String technicalManagerEmail;
	
	private boolean codeValid;
	
	private boolean managerEmailValid;
	
	private boolean technicalManagerEmailValid;

	public ValidateProjectDTO() {
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getManagerEmail() {
		return managerEmail;
	}

	public void setManagerEmail(String managerEmail) {
		this.managerEmail = managerEmail;
	}

	public String getTechnicalManagerEmail() {
		return technicalManagerEmail;
	}

	public void setTechnicalManagerEmail(String technicalManagerEmail) {
		this.technicalManagerEmail = technicalManagerEmail;
	}

	public boolean isCodeValid() {
		return codeValid;
	}

	public void setCodeValid(boolean codeValid) {
		this.codeValid = codeValid;
	}

	public boolean isManagerEmailValid() {
		return managerEmailValid;
	}

	public void setManagerEmailValid(boolean managerEmailValid) {
		this.managerEmailValid = managerEmailValid;
	}

	public boolean isTechnicalManagerEmailValid() {
		return technicalManagerEmailValid;
	}

	public void setTechnicalManagerEmailValid(boolean technicalManagerEmailValid) {
		this.technicalManagerEmailValid = technicalManagerEmailValid;
	}
	
	
	

}
