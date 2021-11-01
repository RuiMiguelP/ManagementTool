package pt.uc.dei.paj.controller;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;

import pt.uc.dei.paj.dao.ProfileDAO;
import pt.uc.dei.paj.dao.UserDAO;
import pt.uc.dei.paj.entity.Profile;
import pt.uc.dei.paj.entity.User;
import pt.uc.dei.paj.enums.ProfileType;

@Startup
@Singleton
public class StartUpDatabase {

	@Inject
	ProfileDAO profileDAO;
	
	@Inject
	UserDAO userDAO;
	
	/**
	 * 
	 * On database start up creates a super admin and user profiles
	 * 
	 */
	@PostConstruct
	public void init() {
		if (profileDAO.findByProfileType(ProfileType.ADMIN) == null) {
			profileDAO.createDefaultProfiles();
			User user = userDAO.createSuperAdmin();
			Profile profile = profileDAO.findByProfileType(ProfileType.ADMIN);
			userDAO.addProfileToUser(user, profile);
		}
	}
}
