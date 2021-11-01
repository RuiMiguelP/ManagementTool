package pt.uc.dei.paj.dto;

import java.io.Serializable;

import javax.validation.constraints.NotEmpty;


public class EditProjectDTO extends AbstractDTO implements Serializable {
	private static final long serialVersionUID = 1L;

	private long id;
	
	@NotEmpty
	private String name;

	@NotEmpty
	private String description;

	@NotEmpty
	private String technicalManagerEmail;

	@NotEmpty
	private String state;
	
	private UserDTO manager;

	public EditProjectDTO() {
	}



	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getTechnicalManagerEmail() {
		return technicalManagerEmail;
	}

	public void setTechnicalManagerEmail(String technicalManagerEmail) {
		this.technicalManagerEmail = technicalManagerEmail;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public UserDTO getManager() {
		return manager;
	}

	public void setManager(UserDTO manager) {
		this.manager = manager;
	}
	
	

	
}
