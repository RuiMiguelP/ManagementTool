package pt.uc.dei.paj.dao;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaUpdate;
import javax.persistence.criteria.Root;
import javax.security.auth.login.CredentialException;
import javax.transaction.RollbackException;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import pt.uc.dei.paj.dto.UserDTO;
import pt.uc.dei.paj.entity.Profile;
import pt.uc.dei.paj.entity.User;
import pt.uc.dei.paj.util.Constants;
import pt.uc.dei.paj.util.Generator;
import pt.uc.dei.paj.util.PasswordUtils;

@Stateless
public class UserDAO extends AbstractDAO<User> {
	private static final long serialVersionUID = 1L;
	private static final Logger LOGGER = LoggerFactory.getLogger(UserDAO.class.getName());

	public UserDAO() {
		super(User.class);
	}

	@Inject
	Validator validator;

	/**
	 * Create super admin
	 * @return super admin
	 */
	public User createSuperAdmin() {
		User user = new User();
		user.setName(Constants.ADMIN_NAME);
		user.setEmail(Constants.ADMIN_EMAIL);
		user.setOccupation(Constants.ADMIN_NAME);

		String[] infoPassword = PasswordUtils.generateSecurePassword(Constants.ADMIN_PASSWORD);
		user.setSaltPassword(infoPassword[0]);
		user.setPassword(infoPassword[1]);
		user.setRegisterDate(Instant.now());
		user.setActive(true);
		persist(user);
		return user;
	}

	/**
	 * Add profile to user
	 * @param user
	 * @param profile
	 */
	public void addProfileToUser(User user, Profile profile) {
		user.addProfile(profile);
		merge(user);
	}

	/**
	 * Remove profile to user
	 * @param user
	 * @param profile
	 */
	public void removeProfileUser(User user, Profile profile) {
		user.removeProfile(profile);
		merge(user);
	}

	/**
	 *  Register user
	 * @param userDTO
	 * @return user created
	 * @throws RollbackException
	 */
	public User signUp(UserDTO userDTO) throws RollbackException {
		User user = new User();
		user.setName(userDTO.getName());
		user.setEmail(userDTO.getEmail());
		user.setOccupation(userDTO.getOccupation());
		user.setToken(userDTO.getToken());
		user.setImgUrl(userDTO.getImgUrl());

		String[] infoPassword = PasswordUtils.generateSecurePassword(userDTO.getPassword());
		user.setSaltPassword(infoPassword[0]);
		user.setPassword(infoPassword[1]);

		user.setRegisterDate(Instant.now());
		user.setActive(false);

		// Validate before persist
		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user);
		if (constraintViolations.isEmpty()) {
			persist(user);
			return user;
		} else {
			for (ConstraintViolation<User> violation : constraintViolations) {
				LOGGER.warn(violation.getPropertyPath() + " Message: " + violation.getMessage());
			}
		}
		return null;
	}

	/**
	 * Register google user
	 * @param name
	 * @param email
	 * @param googleId
	 * @param imgUrl
	 * @return google user created
	 */
	public User signUp(String name, String email, String googleId, String imgUrl) {
		User user = new User();
		user.setName(name);
		user.setEmail(email);
		user.setGoogleId(googleId);
		user.setImgUrl(imgUrl);
		user.setRegisterDate(Instant.now());
		user.setActive(true);

		String token = Generator.generateNewToken();
		user.setToken(token);

		// Validate before persist
		Set<ConstraintViolation<User>> constraintViolations = validator.validate(user);
		if (constraintViolations.isEmpty()) {
			persist(user);
			return user;
		} else {
			for (ConstraintViolation<User> violation : constraintViolations) {
				LOGGER.info(violation.getPropertyPath() + " Message: " + violation.getMessage());
			}
		}
		return null;
	}

	/**
	 *  Change user password
	 * @param user
	 * @param password
	 */
	public void changePassword(User user, String password) {
		String[] infoPassword = PasswordUtils.generateSecurePassword(password);
		user.setSaltPassword(infoPassword[0]);
		user.setPassword(infoPassword[1]);
		user.setToken(null);
		merge(user);
	}

	/**
	 * Find user by profile
	 * @param user
	 * @param profileType
	 * @return isUserProfile
	 */
	public boolean findUserProfile(User user, Profile profileType) {
		try {
			TypedQuery<User> users = em.createNamedQuery("User.findUserProfile", User.class);
			users.setParameter("userId", user.getId());
			users.setParameter("profile", profileType);

			if (users.getSingleResult() != null) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			LOGGER.warn("UserDAO - findUserProfile: " + e);
			return false;
		}
	}

	/**
	 * Return user by Id
	 * @param id
	 * @return user 
	 */
	public User findById(long id) {
		try {
			TypedQuery<User> users = em.createNamedQuery("User.findById", User.class);
			users.setParameter("id", id);
			return users.getSingleResult();
		} catch (Exception e) {
			LOGGER.warn("UserDAO - findById: " + e);
			return null;
		}
	}

	/**
	 * Return user by email
	 * @param email
	 * @return user
	 */
	public User findByEmail(String email) {
		try {
			TypedQuery<User> u = em.createNamedQuery("User.findByEmail", User.class);
			u.setParameter("email", email);
			return u.getSingleResult();
		} catch (Exception e) {
			LOGGER.warn("UserDAO - findByEmail: " + e);
			return null;
		}
	}

	/**
	 * Return user by token
	 * @param token
	 * @return
	 */
	public User findByToken(String token) {
		try {
			TypedQuery<User> u = em.createNamedQuery("User.findByToken", User.class);
			u.setParameter("token", token);
			return u.getSingleResult();
		} catch (Exception e) {
			LOGGER.warn("UserDAO - findByToken: " + e);
			return null;
		}
	}

	/**
	 * Return user by email and token
	 * @param token
	 * @return
	 */
	public User findByEmailAndToken(String email, String token) {
		try {
			TypedQuery<User> u = em.createNamedQuery("User.findByEmailAndToken", User.class);
			u.setParameter("email", email);
			u.setParameter("token", token);
			return u.getSingleResult();
		} catch (Exception e) {
			LOGGER.warn("UserDAO - findByEmailAndToken: " + e);
			return null;
		}
	}

	/**
	 * Validate session
	 * @param email
	 * @param token
	 * @return user
	 * @throws CredentialException
	 */
	public User validateSession(String email, String token) throws CredentialException {
		User user = findByEmail(email);
		if (user != null && user.getToken().equalsIgnoreCase((token))) {
			return user;
		}
		throw new CredentialException(Constants.AUTHENTICATION_FAILED);
	}

	/**
	 * Update user state
	 * @param isActive
	 * @param userID
	 * @return isActive
	 */
	public int updateStateActive(boolean isActive, int userID) {
		try {
			CriteriaBuilder cb = em.getCriteriaBuilder();

			// create update
			CriteriaUpdate<User> update = cb.createCriteriaUpdate(User.class);

			// set the root class
			Root<?> e = update.from(User.class);

			// set update and where clause
			update.set("isActive", isActive);

			update.where(cb.equal(e.get("id"), userID));

			// perform update
			int result = this.em.createQuery(update).executeUpdate();
			return result;

		} catch (Exception e) {
			LOGGER.warn("UserDAO - updateStateActive: " + e);
			return 0;
		}
	}

	/**
	 * Update edit user
	 * @param occupation
	 * @param userID
	 * @return isUpdate
	 */
	public int updateOccupation(String occupation, int userID) {
		try {
			CriteriaBuilder cb = em.getCriteriaBuilder();

			// create update
			CriteriaUpdate<User> update = cb.createCriteriaUpdate(User.class);

			// set the root class
			Root<?> e = update.from(User.class);

			// set update and where clause
			update.set("occupation", occupation);

			update.where(cb.equal(e.get("id"), userID));

			// perform update
			int result = this.em.createQuery(update).executeUpdate();
			return result;

		} catch (Exception e) {
			LOGGER.warn("UserDAO - updateStateActive: " + e);
			return 0;
		}
	}

	/**
	 *  Return all users
	 * @return user list
	 */
	public List<User> findAll() {
		try {
			TypedQuery<User> users = em.createNamedQuery("User.findAll", User.class);
			return users.getResultList();
		} catch (Exception e) {
			LOGGER.warn("UserDAO - findAll: " + e);
			return null;
		}
	}

	/**
	 * Return all active users
	 * @param director
	 * @param user
	 * @return all active users
	 */
	public ArrayList<User> findAllActiveUsers(Profile director, Profile user) {
		try {
			TypedQuery<User> users = em.createNamedQuery("User.findAllActiveUsers", User.class);
			users.setParameter("isActive", true);
			users.setParameter("director", director);
			users.setParameter("user", user);
			return (ArrayList<User>) users.getResultList();
		} catch (Exception e) {
			LOGGER.warn("UserDAO - findAllActiveUsers: " + e);
			return null;
		}
	}
	
	
	/**
	 * Return all users with admin flag
	 * @return all users with admin fla
	 */
	@SuppressWarnings("unchecked")
	public String[] findAllAdminEmail() {

		try {
			List<Object[]> admins = em.createNativeQuery(
					"SELECT * FROM proj_final_db.user usr INNER JOIN proj_final_db.user_profile prf ON usr.id = prf.fk_user_id WHERE prf.fk_profile_id=1")
					.getResultList();

			String[] adminEmails = new String[admins.size()];

			for (int i = 0; i < admins.size(); i++) {

				adminEmails[i] = (String) admins.get(i)[1];

			}

			return adminEmails;
		} catch (Exception e) {
			LOGGER.warn("UserDAO - findAllByAdmin: " + e);
			return null;
		}
	}
}
