package pt.uc.dei.paj.dto;

import java.io.Serializable;


import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import javax.ws.rs.FormParam;

import org.jboss.resteasy.annotations.providers.multipart.PartType;

import pt.uc.dei.paj.validator.Password;


public class UserDTO extends AbstractDTO implements Serializable{
	private static final long serialVersionUID = 1L;

	private long id;
	
	@FormParam("name")
	@NotEmpty
	@Size(max=100)
	private String name;
	
	private boolean isActive;
	
	private boolean isAdmin;
	
	@FormParam("email")
	@NotEmpty
	@Email
	@Size(max=64)
	private String email;
	
	@FormParam("password")
	@NotEmpty
	@Password
	private String password;
	
	@FormParam("token")
	private String token;
	
	@FormParam("validationURL")
	private String validationURL;
	
	@FormParam("occupation")
	@NotEmpty
	@Size(max=20)
	private String occupation;
	
	private String imgUrl;
	
	private boolean isDirector;
	
	private boolean isUser;	
	
	private boolean isVisitor;	
	
	@FormParam("uploadedFile")
	@PartType("application/octet-stream")
    private byte[] file;
	
	private boolean isAvailableBeInactive;	


	public UserDTO() {
		super();
	}	
	
	public UserDTO(long id, String name, String email, String occupation) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.occupation = occupation;
		
	}

	public UserDTO(long id, String token, String name, String email, String occupation, boolean isActive) {
		this.id = id;
		this.token = token;
		this.name = name;
		this.email = email;
		this.occupation = occupation;
		this.isActive = isActive;
	}

	public UserDTO(long id, String token, String name, boolean isAdmin, boolean isDirector, boolean isUser, boolean isVisitor) {
		this.id = id;
		this.token = token;
		this.name = name;
		this.isAdmin = isAdmin;
		this.isDirector = isDirector;
		this.isUser = isUser;
		this.isVisitor = isVisitor;
	}

	public UserDTO(long id, String token, String name, boolean isAdmin, boolean isDirector, boolean isUser, boolean isVisitor, byte[] file) {
		this.id = id;
		this.token = token;
		this.name = name;
		this.isAdmin = isAdmin;
		this.isDirector = isDirector;
		this.isUser = isUser;
		this.isVisitor = isVisitor;
		this.file = file;
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
	
	

	public boolean isAdmin() {
		return isAdmin;
	}

	public void setAdmin(boolean isAdmin) {
		this.isAdmin = isAdmin;
	}

	public boolean isActive() {
		return isActive;
	}

	public void setActive(boolean isActive) {
		this.isActive = isActive;
	}

	public String getOccupation() {
		return occupation;
	}

	public void setOccupation(String occupation) {
		this.occupation = occupation;
	}

	public String getImgUrl() {
		return imgUrl;
	}

	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}

	public boolean isDirector() {
		return isDirector;
	}

	public void setDirector(boolean isDirector) {
		this.isDirector = isDirector;
	}

	public boolean isUser() {
		return isUser;
	}

	public void setUser(boolean isUser) {
		this.isUser = isUser;
	}

	public boolean isVisitor() {
		return isVisitor;
	}

	public void setVisitor(boolean isVisitor) {
		this.isVisitor = isVisitor;
	}

	public String getValidationURL() {
		return validationURL;
	}

	public void setValidationURL(String validationURL) {
		this.validationURL = validationURL;
	}

	public byte[] getFile() {
		return file;
	}

	public void setFile(byte[] file) {
		this.file = file;
	}

	public boolean isAvailableBeInactive() {
		return isAvailableBeInactive;
	}

	public void setAvailableBeInactive(boolean isAvailableBeInactive) {
		this.isAvailableBeInactive = isAvailableBeInactive;
	}

}
