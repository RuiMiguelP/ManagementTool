package pt.uc.dei.paj.dto;

import java.io.Serializable;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import pt.uc.dei.paj.validator.Password;


public class CredentialsDTO extends AbstractDTO implements Serializable {
	private static final long serialVersionUID = 1L;

	@NotEmpty
	@Email
	@Size(max = 64)
	private String email;

	@NotEmpty
	private String token;
	
	@Password
	private String password;

	public CredentialsDTO() {
		super();
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
