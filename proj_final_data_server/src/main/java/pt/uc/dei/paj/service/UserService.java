package pt.uc.dei.paj.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import pt.uc.dei.paj.validator.ValidatorUtil;
import pt.uc.dei.paj.ws.NotificationBean;
import pt.uc.dei.paj.ws.SessionHandler;

import javax.inject.Inject;
import javax.security.auth.login.CredentialException;
import javax.validation.ConstraintViolation;

import javax.validation.Validator;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import pt.uc.dei.paj.dao.AllocationDAO;
import pt.uc.dei.paj.dao.ProfileDAO;
import pt.uc.dei.paj.dao.UserDAO;
import pt.uc.dei.paj.dto.CredentialsDTO;
import pt.uc.dei.paj.dto.HttpMessageDTO;
import pt.uc.dei.paj.dto.UserDTO;
import pt.uc.dei.paj.entity.Allocation;
import pt.uc.dei.paj.entity.Profile;
import pt.uc.dei.paj.entity.User;
import pt.uc.dei.paj.enums.ProfileType;
import pt.uc.dei.paj.util.Constants;
import pt.uc.dei.paj.util.EmailUtil;
import pt.uc.dei.paj.util.EntityMapper;
import pt.uc.dei.paj.util.Generator;

@Path("/users")
@Consumes({ MediaType.APPLICATION_JSON })
@Produces({ MediaType.APPLICATION_JSON })
public class UserService {
	private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class.getName());

	@Inject
	UserDAO userDAO;

	@Inject
	ProfileDAO profileDAO;

	@Inject
	AllocationDAO allocationDAO;

	@Inject
	NotificationBean notificationBean;

	@Inject
	Validator validator;

	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response signUp(@MultipartForm UserDTO userDTO) {

		try {

			LOGGER.info("UserService - Calling signUp");
			Set<ConstraintViolation<UserDTO>> constraintViolations = validator.validate(userDTO);

			if (userDAO.findByEmail(userDTO.getEmail()) == null) {

				if (constraintViolations.isEmpty()) {

					if (userDTO.getFile() != null) {
						if (userDTO.getFile().length != 0) {
							String imgUrl = EntityMapper.writeProfilePhoto(userDTO.getFile(), userDTO.getEmail());
							userDTO.setImgUrl(imgUrl);
						}
					}

					User user = userDAO.signUp(userDTO);
					Profile profile = profileDAO.findByProfileType(ProfileType.VISITOR);
					userDAO.addProfileToUser(user, profile);

					String[] adminEmails = userDAO.findAllAdminEmail();

					EmailUtil.sendEmail(adminEmails, user.getName(), user.getEmail());

					EmailUtil.sendConfirmationEmail(user.getEmail(), userDTO.getValidationURL());
					return Response.status(Status.CREATED).entity(new HttpMessageDTO(Constants.USER_CREATED)).build();

				} else {
					for (ConstraintViolation<UserDTO> violation : constraintViolations) {
						LOGGER.info(violation.getPropertyPath() + " Message: " + violation.getMessage());
					}
					return Response.status(Status.BAD_REQUEST).entity(new HttpMessageDTO(Constants.INVALID_FIELDS))
							.build();
				}

			}
			return Response.status(Status.CONFLICT).entity(new HttpMessageDTO(Constants.EMAIL_IN_USE)).build();

		} catch (Exception e) {
			LOGGER.warn("UserService - signUp: " + e);
			return Response.status(Status.INTERNAL_SERVER_ERROR)
					.entity(new HttpMessageDTO(Constants.REGISTRATION_FAILED)).build();
		}
	}

	@POST
	@Path("/login")
	public Response login(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("password") String password) {
		try {

			LOGGER.info("UserService - Calling login");
			User user = userDAO.findByEmail(email);
			if (user != null) {
				if (ValidatorUtil.verifyActiveStatus(user)) {
					if (ValidatorUtil.verifyProvidedPassword(password, user.getPassword(), user.getSaltPassword())) {
						String token = Generator.generateNewToken();
						user.setToken(token);

						userDAO.merge(user);
						boolean isAdmin = userDAO.findUserProfile(user,
								profileDAO.findByProfileType(ProfileType.ADMIN));

						boolean isDirector = userDAO.findUserProfile(user,
								profileDAO.findByProfileType(ProfileType.DIRECTOR));

						boolean isUser = userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.USER));

						boolean isVisitor = userDAO.findUserProfile(user,
								profileDAO.findByProfileType(ProfileType.VISITOR));

						if (!ValidatorUtil.isNullOrEmpty(user.getImgUrl())) {
							byte[] profilePhoto = EntityMapper.readFilePath(user.getImgUrl());

							return Response.ok(new UserDTO(user.getId(), user.getToken(), user.getName(), isAdmin,
									isDirector, isUser, isVisitor, profilePhoto)).build();
						}

						return Response.ok(new UserDTO(user.getId(), user.getToken(), user.getName(), isAdmin,
								isDirector, isUser, isVisitor)).build();
					}
					return Response.status(Status.UNAUTHORIZED)
							.entity(new HttpMessageDTO(Constants.LOGIN_UNAUTHORIZED_PASSWORD)).build();
				}

				return Response.status(Status.FORBIDDEN).entity(new HttpMessageDTO(Constants.INACTIVE_ACCOUNT)).build();
			}
			return Response.status(Status.NOT_FOUND).entity(new HttpMessageDTO(Constants.LOGIN_NOT_FOUND_USER)).build();
		} catch (Exception e) {
			LOGGER.warn("UserService - login: " + e);
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(new HttpMessageDTO(Constants.LOGIN_FAILED))
					.build();
		}
	}

	@POST
	@Path("google/login")
	public Response googleLogin(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("googleId") String googleId, UserDTO userDTO) {
		try {

			LOGGER.info("UserService - Calling googleLogin");
			User user = userDAO.findByEmail(email);
			if (user != null) {
				if (ValidatorUtil.verifyActiveStatus(user)) {
					if (ValidatorUtil.verifyProvidedGoogleId(googleId, user.getGoogleId())) {
						String token = Generator.generateNewToken();
						user.setToken(token);
						userDAO.merge(user);
					} else {
						return Response.status(Status.UNAUTHORIZED)
								.entity(new HttpMessageDTO(Constants.LOGIN_UNAUTHORIZED_PASSWORD)).build();
					}
				} else {
					return Response.status(Status.FORBIDDEN).entity(new HttpMessageDTO(Constants.INACTIVE_ACCOUNT))
							.build();
				}
			} else {
				user = userDAO.signUp(userDTO.getName(), email, googleId, userDTO.getImgUrl());

				Profile profile = profileDAO.findByProfileType(ProfileType.VISITOR);
				userDAO.addProfileToUser(user, profile);

				String[] adminEmails = userDAO.findAllAdminEmail();
				EmailUtil.sendEmail(adminEmails, user.getName(), user.getEmail());
			}

			boolean isAdmin = userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.ADMIN));
			boolean isDirector = userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.DIRECTOR));
			boolean isUser = userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.USER));
			boolean isVisitor = userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.VISITOR));

			return Response.ok(
					new UserDTO(user.getId(), user.getToken(), user.getName(), isAdmin, isDirector, isUser, isVisitor))
					.build();
		} catch (Exception e) {
			LOGGER.warn("UserService - googleLogin: " + e);
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(new HttpMessageDTO(Constants.LOGIN_FAILED))
					.build();
		}
	}

	@POST
	@Path("/logout")
	public Response logout(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("token") String token) {
		try {

			LOGGER.info("UserService - Calling logout");
			User user = userDAO.findByEmail(email);
			user.setToken(null);
			userDAO.merge(user);
			SessionHandler.sessionOut(user.getId());

			return Response.status(Status.OK).entity(new HttpMessageDTO(Constants.LOG_OUT_SUCCESS)).build();
		} catch (Exception e) {
			LOGGER.warn("UserService - logout: " + e);
			return Response.status(Status.BAD_REQUEST).entity(new HttpMessageDTO(Constants.LOGOUT_FAILED)).build();
		}
	}

	@PUT
	@Path("/registerValidation")
	public Response registerValidation(CredentialsDTO credentials) {

		try {
			LOGGER.info("UserService - Calling registerValidation");

			User user = userDAO.validateSession(credentials.getEmail(), credentials.getToken());
			user.setActive(true);
			user.setToken(null);
			userDAO.merge(user);

			return Response.status(Status.OK).entity(new HttpMessageDTO(Constants.REGISTRATION_VALIDATED)).build();

		} catch (CredentialException e) {
			LOGGER.warn("UserService - registerValidation: " + e);
			return Response.status(Status.BAD_REQUEST)
					.entity(new HttpMessageDTO(Constants.REGISTRATION_VALIDATION_FAILED)).build();
		}

	}

	@PUT
	@Path("/confirmationMail")
	public Response resendConfirmationMail(UserDTO userDTO) {

		try {
			LOGGER.info("UserService - Calling resendConfirmationMail");
			EmailUtil.sendConfirmationEmail(userDTO.getEmail(), userDTO.getValidationURL());

			return Response.status(Status.OK).build();

		} catch (InternalError e) {
			LOGGER.warn("UserService - resendConfirmationMail: " + e);
			return Response.status(Status.BAD_REQUEST).entity(new HttpMessageDTO(Constants.REGISTRATION_FAILED))
					.build();
		}
	}

	@PUT
	@Path("/upgrade")
	public Response upgradeVisitorAccount(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("token") String token) {

		try {
			LOGGER.info("UserService - Calling upgradeVisitorAccount");

			User user = userDAO.validateSession(email, token);

			if (user != null) {

				String[] adminEmails = userDAO.findAllAdminEmail();

				EmailUtil.sendEmailFromVisitorToAdmin(adminEmails, user.getName(), email);
				return Response.status(Status.OK).build();
			}

			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO(Constants.AUTHENTICATION_FAILED))
					.build();

		} catch (CredentialException e) {
			LOGGER.warn("UserService - upgradeVisitorAccount: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}
	}

	@GET
	public Response findUser(@NotEmpty @Email @HeaderParam("email") String email,
			@NotEmpty @HeaderParam("token") String token) {

		try {
			User user = userDAO.validateSession(email, token);
			ArrayList<User> result = new ArrayList<>();
			LOGGER.info("UserService - Calling findAllUser");

			SessionHandler.updateSessionTime(user.getId());

			result = (ArrayList<User>) userDAO.findAll();

			if (result.isEmpty()) {
				return Response.status(Response.Status.NOT_FOUND).entity(Constants.RECORDS_NOT_EXISTS).build();
			}
			
			ArrayList<UserDTO> usersDTO = mapProfiles(result);
			
			for (UserDTO usrDTO: usersDTO) {
				usrDTO.setAvailableBeInactive(allocationDAO.checkUserAllocations(usrDTO.getId()));
			}
			
			GenericEntity<List<UserDTO>> list = new GenericEntity<List<UserDTO>>(usersDTO) {
			};

			return Response.status(Response.Status.OK).entity(list).build();
		} catch (CredentialException e) {
			LOGGER.warn("UserService - findUser: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		} catch (Exception e) {
			LOGGER.warn("UserService - findUser: " + e);
			return Response.status(Status.BAD_REQUEST).entity(new HttpMessageDTO(Constants.INVALID_FORMAT)).build();
		}
	}

	@GET
	@Path("/available")
	public Response allAvailableUsers(@NotEmpty @Email @HeaderParam("email") String email,
			@NotEmpty @HeaderParam("token") String token) {

		try {
			User director = userDAO.validateSession(email, token);
			LOGGER.info("UserService - Calling allAvailableUsers");
			SessionHandler.updateSessionTime(director.getId());

			if (userDAO.findUserProfile(director, profileDAO.findByProfileType(ProfileType.DIRECTOR))) {

				List<User> users = userDAO.findAll();
				List<UserDTO> userDTOs = new ArrayList<>();

				for (User user : users) {

					if (user.isActive()
							&& (userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.DIRECTOR))
									|| userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.USER)))) {
						userDTOs.add(user.toDTO());
					}
				}

				return Response.status(Status.OK).entity(userDTOs).build();
			} else {

				return Response.status(Status.UNAUTHORIZED)
						.entity(new HttpMessageDTO(Constants.UNAUTHORIZED_PERMISSION)).build();
			}

		} catch (CredentialException e) {
			LOGGER.warn("UserService - allAvailableUsers: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}

	}

	@GET
	@Path("/{projectId}/available")
	public Response allAvailableUsersByProject(@NotEmpty @Email @HeaderParam("email") String email,
			@NotEmpty @HeaderParam("token") String token, @PathParam("projectId") long projectId) {

		try {
			User director = userDAO.validateSession(email, token);
			LOGGER.info("UserService - Calling allAvailableUsersByProject");

			SessionHandler.updateSessionTime(director.getId());

			if (userDAO.findUserProfile(director, profileDAO.findByProfileType(ProfileType.DIRECTOR))) {

				ArrayList<Allocation> allocations = allocationDAO.findProjectResources(projectId);

				ArrayList<User> users = userDAO.findAllActiveUsers(profileDAO.findByProfileType(ProfileType.DIRECTOR),
						profileDAO.findByProfileType(ProfileType.USER));
				ArrayList<User> userDTOs = new ArrayList<>();

				for (User user : users) {
					for (Allocation alloc : allocations) {
						if (alloc.getUser().getId() == user.getId()) {
							userDTOs.add(user);
						}
					}
				}
				
				users.removeAll(userDTOs);

				return Response.status(Status.OK).entity(EntityMapper.toUserDTOList(users)).build();
			} else {

				return Response.status(Status.UNAUTHORIZED)
						.entity(new HttpMessageDTO(Constants.UNAUTHORIZED_PERMISSION)).build();
			}

		} catch (CredentialException e) {
			LOGGER.warn("UserService - allAvailableUsersByProject: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}

	}

	@PUT
	@Path("/{userId}")
	public Response changeStateActive(@NotEmpty @Email @HeaderParam("email") String email,
			@NotEmpty @HeaderParam("token") String token, @NotNull @PathParam("userId") int userId,
			@QueryParam("active") boolean isActive) {
		try {

			LOGGER.info("UserService - Calling changeStateActive");

			User user = userDAO.validateSession(email, token);
			SessionHandler.updateSessionTime(user.getId());

			if (userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.ADMIN))) {
				userDAO.updateStateActive(isActive, userId);

				return Response.status(Status.OK).entity(new HttpMessageDTO(Constants.UPDATE_STATE_ACTIVE_SUCCESS))
						.build();
			}
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO(Constants.UNAUTHORIZED_PERMISSION))
					.build();
		} catch (CredentialException e) {
			LOGGER.warn("UserService - changeStateActive: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		} catch (Exception e) {
			LOGGER.warn("UserService - changeStateActive: " + e);
			return Response.status(Status.BAD_REQUEST).entity(new HttpMessageDTO(Constants.INVALID_FORMAT)).build();
		}
	}

	@PUT
	@Path("/{userId}/edit")
	public Response editUser(@NotEmpty @Email @HeaderParam("email") String email,
			@NotEmpty @HeaderParam("token") String token, @NotNull @PathParam("userId") int userId, UserDTO userDTO) {
		try {

			LOGGER.info("UserService - Calling editUser");

			User user = userDAO.validateSession(email, token);
			SessionHandler.updateSessionTime(user.getId());

			if (userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.ADMIN))) {
				userDAO.updateOccupation(userDTO.getOccupation(), userId);

				User userEdit = userDAO.findById(userId);
				updateProfiles(userEdit, userDTO);
				notificationBean.createNotificationUserChanged(userEdit);

				return Response.status(Status.OK).entity(new HttpMessageDTO(Constants.UPDATE_USER_SUCCESS)).build();
			}
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO(Constants.UNAUTHORIZED_PERMISSION))
					.build();
		} catch (CredentialException e) {
			LOGGER.warn("UserService - editUser: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		} catch (Exception e) {
			LOGGER.warn("UserService - editUser: " + e);
			return Response.status(Status.BAD_REQUEST).entity(new HttpMessageDTO(Constants.INVALID_FORMAT)).build();
		}
	}

	@PUT
	@Path("/sendResetPasswordEmail")
	public Response sendResetPasswordEmail(UserDTO userDTO) {

		try {
			LOGGER.info("UserService - Calling sendResetPasswordEmail");

			User user = userDAO.findByEmail(userDTO.getEmail());

			if (user != null) {
				user.setToken(userDTO.getToken());
				userDAO.merge(user);
				EmailUtil.sendResetPasswordEmail(user.getEmail(), userDTO.getValidationURL());
				return Response.status(Status.OK).entity(new HttpMessageDTO(Constants.EMAIL_RESET_PASSWORD_SUCCESSS))
						.build();
			}

			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO(Constants.UNAUTHORIZED_PERMISSION))
					.build();
		} catch (Exception e) {
			LOGGER.warn("UserService - sendResetPasswordEmail: " + e);
			return Response.status(Status.BAD_REQUEST).entity("Error: " + e.getMessage()).build();
		}
	}

	@PUT
	@Path("/resetPassword")
	public Response resetPassword(CredentialsDTO credentials) {

		try {
			LOGGER.info("UserService - Calling resetPassword");

			User user = userDAO.validateSession(credentials.getEmail(), credentials.getToken());
			userDAO.changePassword(user, credentials.getPassword());

			return Response.status(Status.OK).entity(new HttpMessageDTO(Constants.RESET_PASSWORD_SUCCESSS)).build();

		} catch (CredentialException e) {
			LOGGER.warn("UserService - resetPassword: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		} catch (Exception e) {
			LOGGER.warn("UserService - resetPassword: " + e);
			return Response.status(Status.BAD_REQUEST).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}
	}

	private void updateProfiles(User userEdit, UserDTO userDTO) {
		for (ProfileType profileValue : ProfileType.values()) {
			switch (profileValue) {
			case ADMIN:
				handleProfile(userDTO.isAdmin(), profileValue, userEdit);
				break;
			case DIRECTOR:
				handleProfile(userDTO.isDirector(), profileValue, userEdit);
				break;
			case USER:
				handleProfile(userDTO.isUser(), profileValue, userEdit);
				break;
			case VISITOR:
				handleProfile(userDTO.isVisitor(), profileValue, userEdit);
				break;
			default:
				break;
			}
		}
		userDAO.merge(userEdit);
	}

	private void handleProfile(boolean value, ProfileType profileType, User userEdit) {
		if (value) {
			userEdit.addProfile(profileDAO.findByProfileType(profileType));
		} else {
			userEdit.removeProfile(profileDAO.findByProfileType(profileType));
		}
	}

	public ArrayList<UserDTO> mapProfiles(ArrayList<User> users) {
		ArrayList<UserDTO> listDTO = new ArrayList<>();

		for (User user : users) {
			UserDTO userDTO = user.toDTO();
			for (ProfileType profileValue : ProfileType.values()) {
				boolean value = userDAO.findUserProfile(user, profileDAO.findByProfileType(profileValue));
				userDTO = EntityMapper.filterValue(profileValue, userDTO, value);
			}
			listDTO.add(userDTO);
		}
		return listDTO;
	}
}
