package pt.uc.dei.paj.entity;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import pt.uc.dei.paj.dto.UserDTO;

@Entity
@Table(name = "user")
@NamedQueries({ @NamedQuery(name = "User.findAll", query = "SELECT usr FROM User usr"),
		@NamedQuery(name = "User.findById", query = "SELECT usr FROM User usr WHERE usr.id=:id"),
		@NamedQuery(name = "User.findByEmail", query = "SELECT usr FROM User usr WHERE usr.email=:email"),
		@NamedQuery(name = "User.findByToken", query = "SELECT usr FROM User usr WHERE usr.token=:token"),
		@NamedQuery(name = "User.findByEmailAndToken", query = "SELECT usr FROM User usr WHERE usr.email=:email AND usr.token=:token"),
		@NamedQuery(name = "User.findUserProfile", query = "SELECT usr FROM User usr WHERE usr.id=:userId AND :profile MEMBER OF usr.profiles"),
		@NamedQuery(name = "User.findAllByProfile", query = "SELECT usr FROM User usr WHERE :profile MEMBER OF usr.profiles"),
		@NamedQuery(name= "User.findAllActiveUsers", query="SELECT usr FROM User usr WHERE usr.isActive=:isActive AND (:director MEMBER OF usr.profiles OR"
				+ ":user MEMBER OF usr.profiles)")
})
public class User implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private static final Logger logger = Logger.getLogger("User");

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(updatable = false)
	private long id;

	@Column(unique = true)
	@NotEmpty
	@Email
	@Size(max = 64)
	private String email;

	@Column
	@NotEmpty
	@Size(max = 100)
	private String name;

	@Column
	@Size(max = 20)
	private String occupation;

	@Column
	private String password;

	@Column(name = "salt_password")
	private String saltPassword;

	private String token;

	@Column(name = "register_date")
	@NotNull
	private Instant registerDate;

	private boolean isActive;

	@Column(name = "google_id")
	private String googleId;

	@Column(name = "img_url")
	private String imgUrl;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "user_profile", joinColumns = {
			@JoinColumn(name = "fk_user_id", nullable = false) }, inverseJoinColumns = {
					@JoinColumn(name = "fk_profile_id", nullable = false) })
	private Set<Profile> profiles = new HashSet<Profile>();

	public UserDTO toDTO() {
		return new UserDTO(id, token, name, email, occupation, isActive);
	}
	
	public UserDTO userInfoToDTO() {
		
		return new UserDTO(id, name, email, occupation);
	}

	public void addProfile(Profile profile) {
		this.profiles.add(profile);
	}

	public void removeProfile(Profile profile) {
		Profile unmark = null;
		try {
			for (Profile profileEntity : profiles) {
				if (profileEntity.getProfile() == profile.getProfile()) {
					unmark = profileEntity;
					break;
				}
			}
			this.profiles.remove(unmark);
		} catch (Exception e) {
			logger.log(Level.INFO, "removeProfile: " + e);
		}

	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getOccupation() {
		return occupation;
	}

	public void setOccupation(String occupation) {
		this.occupation = occupation;
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

	public Instant getRegisterDate() {
		return registerDate;
	}

	public void setRegisterDate(Instant registerDate) {
		this.registerDate = registerDate;
	}

	public boolean isActive() {
		return isActive;
	}

	public void setActive(boolean isActive) {
		this.isActive = isActive;
	}

	public String getSaltPassword() {
		return saltPassword;
	}

	public void setSaltPassword(String saltPassword) {
		this.saltPassword = saltPassword;
	}

	public Set<Profile> getProfiles() {
		return profiles;
	}

	public void setProfiles(Set<Profile> profiles) {
		this.profiles = profiles;
	}

	public String getGoogleId() {
		return googleId;
	}

	public void setGoogleId(String googleId) {
		this.googleId = googleId;
	}

	public String getImgUrl() {
		return imgUrl;
	}

	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}
}
