package pt.uc.dei.paj.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import pt.uc.dei.paj.enums.ProfileType;

@Entity
@Table(name = "profile")
@NamedQueries({ @NamedQuery(name = "Profile.findByType", query = "SELECT prf FROM Profile prf WHERE prf.profile=:profile") })
public class Profile implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(updatable = false, nullable = false)
	private long id;

	@Enumerated(EnumType.STRING)
	private ProfileType profile;

	public ProfileType getProfile() {
		return profile;
	}

	public void setProfile(ProfileType profile) {
		this.profile = profile;
	}

}
