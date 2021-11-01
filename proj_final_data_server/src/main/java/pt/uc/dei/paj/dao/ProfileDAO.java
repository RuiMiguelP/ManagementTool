package pt.uc.dei.paj.dao;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import pt.uc.dei.paj.entity.Profile;
import pt.uc.dei.paj.enums.ProfileType;

@Stateless
public class ProfileDAO extends AbstractDAO<Profile> {
	private static final long serialVersionUID = 1L;
	private static final Logger LOGGER = LoggerFactory.getLogger(ProfileDAO.class.getName());

	public ProfileDAO() {
		super(Profile.class);
	}
	
	/**
	 * create the default profiles
	 */
	public void createDefaultProfiles() {
		for (ProfileType profileValue : ProfileType.values()) { 
			Profile profile = new Profile();
			profile.setProfile(profileValue);
			persist(profile);
		}
	}
	
	/**
	 * Return profile by type
	 * @param profileType
	 * @return profile
	 */
	public Profile findByProfileType(ProfileType profileType) {
		try {
			TypedQuery<Profile> profile = em.createNamedQuery("Profile.findByType", Profile.class);
			profile.setParameter("profile", profileType);
			return profile.getSingleResult();
		} catch (Exception e) {
			LOGGER.warn("profileValue - findByProfileType: " + e);
			return null;
		}
	}
}
