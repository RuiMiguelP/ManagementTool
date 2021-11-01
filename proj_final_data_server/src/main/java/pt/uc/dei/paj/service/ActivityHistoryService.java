package pt.uc.dei.paj.service;

import java.io.IOException;
import java.util.ArrayList;

import javax.inject.Inject;
import javax.security.auth.login.CredentialException;
import javax.validation.Validator;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import pt.uc.dei.paj.dao.ActivityHistoryDAO;
import pt.uc.dei.paj.dao.ProfileDAO;
import pt.uc.dei.paj.dao.UserDAO;
import pt.uc.dei.paj.dto.ActivityHistoryDTO;
import pt.uc.dei.paj.dto.HttpMessageDTO;
import pt.uc.dei.paj.entity.ActivityHistory;
import pt.uc.dei.paj.entity.User;
import pt.uc.dei.paj.util.Constants;
import pt.uc.dei.paj.util.EntityMapper;
import pt.uc.dei.paj.validator.ValidatorUtil;
import pt.uc.dei.paj.ws.SessionHandler;

@Path("/activityHistory")
@Consumes({ MediaType.APPLICATION_JSON })
@Produces({ MediaType.APPLICATION_JSON })
public class ActivityHistoryService {
	private static final Logger LOGGER = LoggerFactory.getLogger(ActivityHistoryService.class.getName());

	@Inject
	Validator validator;

	@Inject
	UserDAO userDAO;

	@Inject
	ProfileDAO profileDAO;
	
	@Inject
	ActivityHistoryDAO activityHistoryDAO;

	@GET
	@Path("/{activityId}")
	public Response findAllActivityHistory(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("token") String token, @PathParam("activityId") long activityId) throws IOException {

		try {
			User user = userDAO.validateSession(email, token);
			ArrayList<ActivityHistoryDTO> resultDto = new ArrayList<ActivityHistoryDTO>();
			byte[] attached = null;
			
			LOGGER.info("ActivityHistoryService - Calling findAllActivityHistory");
			
			SessionHandler.updateSessionTime(user.getId());

			ArrayList<ActivityHistory> result = (ArrayList<ActivityHistory>) activityHistoryDAO.findByActivity(activityId);

			if (result.isEmpty()) {
				return Response.status(Response.Status.NOT_FOUND).entity(Constants.RECORDS_NOT_EXISTS).build();
			}

			for (ActivityHistory actHst: result) {
				if (!ValidatorUtil.isNullOrEmpty(actHst.getFilePath())) {
				 attached = EntityMapper.readFilePath(actHst.getFilePath());
				}
				resultDto.add(new ActivityHistoryDTO(actHst.getId(), actHst.getComment(), attached, actHst.getFileType()));
			}
			
			return Response.status(Response.Status.OK).entity(resultDto).build();
		} catch (CredentialException e) {
			LOGGER.warn("ActivityHistoryService - findAllActivityHistory: " + e);

			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}
	}
}
