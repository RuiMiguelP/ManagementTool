package pt.uc.dei.paj.service;

import java.util.ArrayList;
import java.util.Set;
import javax.inject.Inject;
import javax.security.auth.login.CredentialException;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import pt.uc.dei.paj.dao.AllocationDAO;
import pt.uc.dei.paj.dao.ProfileDAO;
import pt.uc.dei.paj.dao.ProjectDAO;
import pt.uc.dei.paj.dao.UserDAO;
import pt.uc.dei.paj.dto.AllocationDTO;
import pt.uc.dei.paj.dto.AllocationsDTO;
import pt.uc.dei.paj.dto.HttpMessageDTO;
import pt.uc.dei.paj.entity.Allocation;
import pt.uc.dei.paj.entity.User;
import pt.uc.dei.paj.enums.ProfileType;
import pt.uc.dei.paj.util.Constants;
import pt.uc.dei.paj.util.EntityMapper;
import pt.uc.dei.paj.ws.NotificationBean;
import pt.uc.dei.paj.ws.SessionHandler;

@Path("/allocations")
@Consumes({ MediaType.APPLICATION_JSON })
@Produces({ MediaType.APPLICATION_JSON })
public class AllocationService {
	private static final Logger LOGGER = LoggerFactory.getLogger(AllocationService.class.getName());

	@Inject
	Validator validator;

	@Inject
	UserDAO userDAO;

	@Inject
	ProfileDAO profileDAO;

	@Inject
	AllocationDAO allocationDAO;

	@Inject
	ProjectDAO projectDAO;

	@Inject
	NotificationBean notificationBean;

	@POST
	public Response createAllocation(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("token") String token, AllocationsDTO allocationsDTO) {

		try {
			ArrayList<Allocation> allocationsList = new ArrayList<>();
			ArrayList<AllocationDTO> alloctsDTO = new ArrayList<>();

			User user = userDAO.validateSession(email, token);

			LOGGER.info("AllocationService - Calling createAllocation");

			SessionHandler.updateSessionTime(user.getId());

			if (userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.DIRECTOR))) {

				if (!allocationsDTO.getAllocationList().isEmpty()) {
					for (AllocationDTO allcDTO : allocationsDTO.getAllocationList()) {
						Set<ConstraintViolation<AllocationDTO>> constraintViolations = validator.validate(allcDTO);

						if (constraintViolations.isEmpty()) {
							Allocation allocation = allocationDAO.createAllocation(allcDTO);
							allocationsList.add(allocationDAO.findById(allocation.getId()));
						} else {
							for (ConstraintViolation<AllocationDTO> violation : constraintViolations) {
								LOGGER.info(violation.getPropertyPath() + " Message: " + violation.getMessage());
							}

							return Response.status(Status.BAD_REQUEST)
									.entity(new HttpMessageDTO(Constants.INVALID_FIELDS)).build();
						}
					}
					alloctsDTO = EntityMapper.toAllocationDTOList(allocationsList);
					notificationBean.createNotificationAddResourceToProject(alloctsDTO, user,
							allocationsDTO.getAllocationList().get(0).getProjectId());
				} else {
					return Response.status(Status.BAD_REQUEST).entity(new HttpMessageDTO(Constants.INVALID_FIELDS))
							.build();
				}

				return Response.status(Status.CREATED).entity(alloctsDTO).build();
			}

			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO(Constants.UNAUTHORIZED_PERMISSION))
					.build();

		} catch (CredentialException e) {
			LOGGER.warn("AllocationService - createAllocation: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}
	}
}
