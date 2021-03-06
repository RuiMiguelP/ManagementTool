package pt.uc.dei.paj.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import pt.uc.dei.paj.controller.StatsBean;
import pt.uc.dei.paj.dao.ActivityDAO;
import pt.uc.dei.paj.dao.ActivityHistoryDAO;
import pt.uc.dei.paj.dao.AllocationDAO;
import pt.uc.dei.paj.dao.ProfileDAO;
import pt.uc.dei.paj.dao.ProjectDAO;
import pt.uc.dei.paj.dao.UserDAO;
import pt.uc.dei.paj.dto.ActivityDTO;
import pt.uc.dei.paj.dto.ActivityHistoryDTO;
import pt.uc.dei.paj.dto.AllocationDTO;
import pt.uc.dei.paj.dto.AllocationsDTO;
import pt.uc.dei.paj.dto.EditProjectDTO;
import pt.uc.dei.paj.dto.HttpMessageDTO;
import pt.uc.dei.paj.dto.ProjectDTO;
import pt.uc.dei.paj.dto.StatsDTO;
import pt.uc.dei.paj.dto.ValidateProjectDTO;
import pt.uc.dei.paj.entity.Activity;
import pt.uc.dei.paj.entity.Allocation;
import pt.uc.dei.paj.entity.Project;
import pt.uc.dei.paj.entity.User;
import pt.uc.dei.paj.enums.ProfileType;
import pt.uc.dei.paj.util.Constants;

import pt.uc.dei.paj.util.EntityMapper;
import pt.uc.dei.paj.validator.ValidatorUtil;
import pt.uc.dei.paj.ws.NotificationBean;
import pt.uc.dei.paj.ws.SessionHandler;

@Path("/projects")
@Consumes({ MediaType.APPLICATION_JSON })
@Produces({ MediaType.APPLICATION_JSON })
public class ProjectService {
	private static final Logger LOGGER = LoggerFactory.getLogger(ProjectService.class.getName());

	@Inject
	Validator validator;

	@Inject
	ProjectDAO projectDAO;

	@Inject
	ProfileDAO profileDAO;

	@Inject
	AllocationDAO allocationDAO;

	@Inject
	ActivityDAO activityDAO;

	@Inject
	UserDAO userDAO;

	@Inject
	ActivityHistoryDAO activityHistoryDAO;

	@Inject
	StatsBean statsbean;

	@Inject
	NotificationBean notificationBean;

	@POST
	public Response createProject(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("token") String token, ProjectDTO projectDTO) {

		try {
			User user = userDAO.validateSession(email, token);
			LOGGER.info("ProjectService -Calling createProject");

			SessionHandler.updateSessionTime(user.getId());

			if (userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.DIRECTOR))) {
				Set<ConstraintViolation<ProjectDTO>> constraintViolations = validator.validate(projectDTO);

				if (constraintViolations.isEmpty()) {

					User manager = userDAO.findByEmail(projectDTO.getManagerEmail());
					User technicalManager = userDAO.findByEmail(projectDTO.getTechnicalManagerEmail());

					if (manager == null || technicalManager == null) {
						return Response.status(Status.EXPECTATION_FAILED)
								.entity(new HttpMessageDTO(Constants.MANAGER_NOT_FOUND)).build();
					}

					Project project = projectDAO.createProject(projectDTO, manager, technicalManager);

					if (projectDTO.getAllocations() != null) {
						for (AllocationDTO alloc : projectDTO.getAllocations()) {
							alloc.setProjectId(project.getId());
							allocationDAO.createAllocation(alloc);
						}
					}

					ProjectDTO prjctDTO = project.toDTO();
					prjctDTO = mapActivitiesAndAllocations(prjctDTO);
					notificationBean.createNotificationNewProject(prjctDTO, user);

					return Response.status(Status.CREATED).entity(prjctDTO).build();
				} else {
					for (ConstraintViolation<ProjectDTO> violation : constraintViolations) {
						LOGGER.info(violation.getPropertyPath() + " Message: " + violation.getMessage());
					}
					return Response.status(Status.BAD_REQUEST).entity(new HttpMessageDTO(Constants.INVALID_FIELDS))
							.build();
				}
			}
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO(Constants.UNAUTHORIZED_PERMISSION))
					.build();
		} catch (CredentialException e) {
			LOGGER.warn("ProjectService - createProject: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}
	}

	@PUT
	public Response updateProject(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("token") String token, EditProjectDTO projectDTO) {

		try {
			User user = userDAO.validateSession(email, token);

			LOGGER.info("ProjectService - Calling updateProject");
			SessionHandler.updateSessionTime(user.getId());

			if (userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.DIRECTOR))
					|| projectDTO.getManager().getId() == user.getId()) {
				Set<ConstraintViolation<EditProjectDTO>> constraintViolations = validator.validate(projectDTO);

				if (constraintViolations.isEmpty()) {

					User technicalManager = userDAO.findByEmail(projectDTO.getTechnicalManagerEmail());

					if (technicalManager == null) {
						return Response.status(Status.EXPECTATION_FAILED)
								.entity(new HttpMessageDTO(Constants.MANAGER_NOT_FOUND)).build();

					}

					Project project = projectDAO.updateProject(projectDTO, technicalManager);

					ProjectDTO prjctDTO = project.toDTO();
					prjctDTO = mapActivitiesAndAllocations(prjctDTO);
					notificationBean.createNotificationChangeProject(prjctDTO, user);

					return Response.status(Status.OK).entity(prjctDTO).build();

				} else {

					for (ConstraintViolation<EditProjectDTO> violation : constraintViolations) {
						LOGGER.info(violation.getPropertyPath() + " Message: " + violation.getMessage());

					}
					return Response.status(Status.BAD_REQUEST).entity(new HttpMessageDTO(Constants.INVALID_FIELDS))
							.build();
				}
			}
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO(Constants.UNAUTHORIZED_PERMISSION))
					.build();
		} catch (CredentialException e) {
			LOGGER.warn("ProjectService - updateProject: " + e);

			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}

	}

	@POST
	@Path("/validate")
	public Response validateProject(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("token") String token, ValidateProjectDTO validateProjectDTO) {

		try {
			 userDAO.validateSession(email, token);

			LOGGER.info("ProjectService - Calling validateProject");

			boolean isCodeValid = false;

			boolean managerExists = false;

			boolean techManagerExists = false;

			if (projectDAO.findByCode(validateProjectDTO.getCode()) == null) {

				isCodeValid = true;

			}

			if (userDAO.findByEmail(validateProjectDTO.getManagerEmail()) != null) {

				managerExists = true;

			}
			if (userDAO.findByEmail(validateProjectDTO.getTechnicalManagerEmail()) != null) {

				techManagerExists = true;

			}

			validateProjectDTO.setCodeValid(isCodeValid);

			validateProjectDTO.setManagerEmailValid(managerExists);

			validateProjectDTO.setTechnicalManagerEmailValid(techManagerExists);

			return Response.status(Status.OK).entity(validateProjectDTO).build();

		} catch (CredentialException e) {
			LOGGER.warn("ProjectService - validateProject: " + e);

			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}

	}

	@GET
	public Response findProjects(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("token") String token) {

		try {
			User user = userDAO.validateSession(email, token);

			LOGGER.info("ProjectService - Calling findProjects");
			SessionHandler.updateSessionTime(user.getId());

			if (ValidatorUtil.verifyActiveStatus(user)) {
				if (userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.DIRECTOR))) {

					ArrayList<Project> result = (ArrayList<Project>) projectDAO.findAllProjects();

					if (result.isEmpty()) {
						return Response.status(Response.Status.NOT_FOUND).entity(Constants.RECORDS_NOT_EXISTS).build();
					}

					ArrayList<ProjectDTO> resultDTO = EntityMapper.toProjectDTOList(result);
					resultDTO = mapActivitiesAndAllocations(resultDTO);

					return Response.status(Response.Status.OK).entity(resultDTO).build();

				} else if (userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.USER))) {

					ArrayList<ProjectDTO> projectsToReturn = new ArrayList<>();
					ArrayList<String> projectsReference = projectDAO.findAllProjectsOwnManagerAndUser(user.getId());
					
					if (projectsReference == null) {
							return Response.status(Response.Status.NOT_FOUND).entity(Constants.RECORDS_NOT_EXISTS).build();
					}
					
					for (String str: projectsReference) {
						projectsToReturn.add(projectDAO.findById(Long.parseLong(str)).toDTO());
					}

					projectsToReturn = mapActivitiesAndAllocations(projectsToReturn);
					return Response.status(Response.Status.OK).entity(projectsToReturn).build();
				} else {
					return Response.status(Status.UNAUTHORIZED)
							.entity(new HttpMessageDTO(Constants.UNAUTHORIZED_PERMISSION)).build();
				}
			}
			return Response.status(Status.FORBIDDEN).entity(new HttpMessageDTO(Constants.INACTIVE_ACCOUNT)).build();

		} catch (CredentialException e) {
			LOGGER.warn("ProjectService - findProjects: " + e);

			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}
	}

	@GET
	@Path("/{projectId}")
	public Response projectWithAllocations(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("token") String token, @PathParam("projectId") long projectId) {

		try {

			User user = userDAO.validateSession(email, token);
			Project project = projectDAO.findById(projectId);

			LOGGER.info("ProjectService - Calling findProjectWithAllocations");
			SessionHandler.updateSessionTime(user.getId());

			if (ValidatorUtil.verifyActiveStatus(user)) {

				if (project != null) {
					ArrayList<Allocation> allocations = allocationDAO.findProjectResources(projectId);
					ProjectDTO projectDTO = project.toDTO();

					if (allocations != null) {
						ArrayList<AllocationDTO> allocationDTOs = EntityMapper.toAllocationDTOList(allocations);
						projectDTO.setAllocations(allocationDTOs);
					}
					return Response.status(Status.OK).entity(projectDTO).build();
				}
				return Response.status(Response.Status.NOT_FOUND).entity(Constants.RECORDS_NOT_EXISTS).build();
			}
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO(Constants.UNAUTHORIZED_PERMISSION))
					.build();

		} catch (CredentialException e) {
			LOGGER.warn("ProjectService - projectWithAllocations: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}

	}

	@POST
	@Path("/{projectId}/activities")
	public Response createActivity(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("token") String token, @NotNull @PathParam("projectId") long projectId,
			ActivityDTO activityDTO) {

		try {
			User user = userDAO.validateSession(email, token);

			LOGGER.info("ProjectService - Calling createActivity");
			SessionHandler.updateSessionTime(user.getId());

			Project project = projectDAO.findById(projectId);
			if (userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.DIRECTOR))
					|| project.getManager().getId() == user.getId()) {
				Set<ConstraintViolation<ActivityDTO>> constraintViolations = validator.validate(activityDTO);

				if (constraintViolations.isEmpty()) {
					Allocation allocation = allocationDAO.findById(activityDTO.getAllocationId());
					ArrayList<Activity> precedents = new ArrayList<>();

					if (activityDTO.getPrecedentsId() != null) {
						if (!activityDTO.getPrecedentsId().isEmpty()) {

							precedents = mapToPrecedents(activityDTO.getPrecedentsId());
						}
					}

					Activity activity = activityDAO.createActivity(activityDTO, project, allocation, precedents);
					ProjectDTO projectDTO = mapActivitiesAndAllocations(project.toDTO());
					notificationBean.createNotificationNewActivity(activity.toDTO(), projectDTO, user);

					return Response.status(Status.CREATED).entity(activity.toDTO()).build();

				} else {
					for (ConstraintViolation<ActivityDTO> violation : constraintViolations) {
						LOGGER.info(violation.getPropertyPath() + " Message: " + violation.getMessage());
					}

					return Response.status(Status.BAD_REQUEST).entity(new HttpMessageDTO(Constants.INVALID_FIELDS))
							.build();
				}
			}

			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO(Constants.UNAUTHORIZED_PERMISSION))
					.build();

		} catch (CredentialException e) {
			LOGGER.warn("ProjectService - createActivity: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}
	}

	@PUT
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Path("/{projectId}/activity/update")
	public Response updateActivity(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("token") String token, @NotNull @PathParam("projectId") long projectId,
			@MultipartForm ActivityHistoryDTO activityHistoryDTO) throws IOException {

		try {
			User user = userDAO.validateSession(email, token);
			LOGGER.info("ProjectService - Calling updateActivity");
			SessionHandler.updateSessionTime(user.getId());

			Activity activity = activityDAO.findById(activityHistoryDTO.getActivityId());

			if (user.getId() == activity.getAllocation().getUser().getId()) {

				Set<ConstraintViolation<ActivityHistoryDTO>> constraintViolations = validator
						.validate(activityHistoryDTO);

				if (constraintViolations.isEmpty()) {
					activity = activityDAO.updateActivity(activity, activityHistoryDTO);

					if (activity != null) {
						String filePath = "";
						if (!ValidatorUtil.isNullOrEmpty(activityHistoryDTO.getFileType())) {
							filePath = EntityMapper.writeFileActivityHistory(activityHistoryDTO.getFile(),
									activityHistoryDTO.getFileType());
						}
						activityHistoryDAO.registActivityUpdate(activity, activityHistoryDTO, filePath);
						notificationBean.createNotificationUpdateActivity(activity.toDTO(), user);

						return Response.status(Status.OK).entity(activity.toDTO()).build();
					}
					return Response.status(Status.BAD_REQUEST).entity(new HttpMessageDTO(Constants.INVALID_FIELDS))
							.build();
				} else {
					for (ConstraintViolation<ActivityHistoryDTO> violation : constraintViolations) {
						LOGGER.info(violation.getPropertyPath() + " Message: " + violation.getMessage());
					}
					return Response.status(Status.BAD_REQUEST).entity(new HttpMessageDTO(Constants.INVALID_FIELDS))
							.build();
				}
			} else {
				return Response.status(Status.UNAUTHORIZED)
						.entity(new HttpMessageDTO(Constants.UNAUTHORIZED_PERMISSION)).build();
			}
		} catch (CredentialException e) {
			LOGGER.warn("ProjectService - updateActivity: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}
	}

	@PUT
	@Path("/{projectId}/activity/edit")
	public Response editActivity(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("token") String token, @NotNull @PathParam("projectId") long projectId,
			ActivityDTO activityDTO) {

		try {

			User user = userDAO.validateSession(email, token);

			SessionHandler.updateSessionTime(user.getId());
			LOGGER.info("ProjectService - Calling editActivity");

			Activity activity = activityDAO.findById(activityDTO.getId());
			Set<ConstraintViolation<ActivityDTO>> constraintViolations = validator.validate(activityDTO);

			if (constraintViolations.isEmpty()) {

				Allocation allocation = allocationDAO.findById(activityDTO.getAllocationId());
				
				ArrayList<Activity> precedents = new ArrayList<>();
				
				if (activityDTO.getPrecedentsId() != null) {
					if (!activityDTO.getPrecedentsId().isEmpty()) {

						precedents = mapToPrecedents(activityDTO.getPrecedentsId());
					}
				}

				activity = activityDAO.editActivity(activity, activityDTO, allocation, precedents);

				if (activity != null) {
					ActivityDTO actvDTO = activity.toDTO();
					notificationBean.createNotificationChangeActivity(actvDTO, user);
					return Response.status(Status.OK).entity(actvDTO).build();
				}

				return Response.status(Status.BAD_REQUEST).entity(new HttpMessageDTO(Constants.INVALID_FIELDS)).build();

			} else {
				for (ConstraintViolation<ActivityDTO> violation : constraintViolations) {
					LOGGER.info(violation.getPropertyPath() + " Message: " + violation.getMessage());
				}

				return Response.status(Status.BAD_REQUEST).entity(new HttpMessageDTO(Constants.INVALID_FIELDS)).build();
			}

		} catch (CredentialException e) {
			LOGGER.warn("ProjectService - editActivity: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}
	}

	@GET
	@Path("/{projectId}/activities")
	public Response findProjectActivities(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("token") String token, @NotNull @PathParam("projectId") long projectId) {

		try {
			User user = userDAO.validateSession(email, token);

			LOGGER.info("ProjectService - Calling findProjectActivities");
			SessionHandler.updateSessionTime(user.getId());

			ArrayList<Activity> result = (ArrayList<Activity>) activityDAO.findProjectActivities(projectId);

			if (result.isEmpty()) {
				return Response.status(Response.Status.NOT_FOUND).entity(Constants.RECORDS_NOT_EXISTS).build();
			}

			ArrayList<ActivityDTO> resultDto = EntityMapper.toActivityDTOList(result);
			GenericEntity<List<ActivityDTO>> list = new GenericEntity<List<ActivityDTO>>(resultDto) {
			};

			return Response.status(Response.Status.OK).entity(list).build();

		} catch (CredentialException e) {
			LOGGER.warn("ProjectService - findProjectActivities: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}
	}

	@GET
	@Path("/{projectId}/resources")
	public Response findProjectResources(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("token") String token, @NotNull @PathParam("projectId") long projectId) {

		try {
			User user = userDAO.validateSession(email, token);
			LOGGER.info("ProjectService - Calling findProjectResources");
			SessionHandler.updateSessionTime(user.getId());

			ArrayList<Allocation> result = (ArrayList<Allocation>) allocationDAO.findProjectResources(projectId);

			if (result.isEmpty()) {
				return Response.status(Response.Status.NOT_FOUND).entity(Constants.RECORDS_NOT_EXISTS).build();
			}

			ArrayList<AllocationDTO> resultDto = EntityMapper.toAllocationDTOList(result);
			GenericEntity<List<AllocationDTO>> list = new GenericEntity<List<AllocationDTO>>(resultDto) {
			};

			return Response.status(Response.Status.OK).entity(list).build();

		} catch (CredentialException e) {
			LOGGER.warn("ProjectService - findProjectResources: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}
	}

	@POST
	@Path("/allocations")
	public Response checkAvailabilityResources(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("token") String token, AllocationsDTO allocationsDTO) {

		try {
			User user = userDAO.validateSession(email, token);
			SessionHandler.updateSessionTime(user.getId());
			LOGGER.info("ProjectService - Calling checkAvailabilityResources");

			if (userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.DIRECTOR))) {
				HashMap<Long, BigDecimal> list = calcAllocationPercentage(allocationsDTO);

				for (Map.Entry<Long, BigDecimal> entry : list.entrySet()) {
					entry.setValue(BigDecimal.valueOf(100.00).subtract(entry.getValue()));
				}

				return Response.status(Status.OK).entity(list).build();

			}
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO(Constants.UNAUTHORIZED_PERMISSION))
					.build();
		} catch (CredentialException e) {
			LOGGER.warn("ProjectService - checkAvailabilityResources: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}
	}

	@GET
	@Path("/stats")
	public Response findProjectStats(@Email @NotNull @HeaderParam("email") String email,
			@NotNull @HeaderParam("token") String token) {

		try {
			User user = userDAO.validateSession(email, token);
			SessionHandler.updateSessionTime(user.getId());
			LOGGER.info("ProjectService - Calling findProjectStats");

			ArrayList<StatsDTO> result = statsbean.calcIndicatorsEVM();

			if (result.isEmpty()) {
				return Response.status(Response.Status.NOT_FOUND).entity(Constants.RECORDS_NOT_EXISTS).build();
			}

			return Response.status(Response.Status.OK).entity(result).build();

		} catch (CredentialException e) {
			LOGGER.warn("ProjectService - findProjectStats: " + e);
			return Response.status(Status.UNAUTHORIZED).entity(new HttpMessageDTO("Error: " + e.getMessage())).build();
		}
	}

	public HashMap<Long, BigDecimal> calcAllocationPercentage(AllocationsDTO allocationsDTO) {
		HashMap<Allocation, BigDecimal> map = new HashMap<>();
		HashMap<Long, BigDecimal> finalMap = new HashMap<>();

		for (AllocationDTO alloc : allocationsDTO.getAllocationList()) {
			ArrayList<Allocation> allocationList = allocationDAO.findAllocationsByAllocation(alloc.getUserId(),
					Instant.parse(alloc.getStartDate()), Instant.parse(alloc.getEndDate()));

			if (allocationList != null) {
				if (!allocationList.isEmpty()) {
					BigDecimal percentage = null;
					for (Allocation allc : allocationList) {
						percentage = (BigDecimal) allocationDAO.calcAllocationPercentage(allc.getUser().getId(),
								allc.getStartDate(), allc.getEndDate());

						map.put(allc, percentage);
					}

					if (allocationList.size() > 1) {
						BigDecimal prntg = checkIfDatesOverlap(map);
						finalMap.put(alloc.getUserId(), prntg);
					} else {
						finalMap.put(alloc.getUserId(), percentage);
					}
					map.clear();
				} else {
					finalMap.put(alloc.getUserId(), BigDecimal.ZERO);
				}
			}
		}
		return finalMap;
	}

	private BigDecimal checkIfDatesOverlap(HashMap<Allocation, BigDecimal> map) {
		BigDecimal maxAllocation = BigDecimal.ZERO;
		Allocation element = null;
		BigDecimal sum = BigDecimal.ZERO;

		ArrayList<Allocation> list = new ArrayList<Allocation>();

		for (Map.Entry<Allocation, BigDecimal> entry : map.entrySet()) {
			list.add(entry.getKey());

			if (entry.getValue().compareTo(maxAllocation) == 1) {
				maxAllocation = entry.getValue();
				element = entry.getKey();

			}
		}

		boolean isIntersect = checkElementMaxAllocation(list, element);
		if (isIntersect) {
			map.remove(element);
			sum = Collections.max(map.values());
			System.out.println("sum intersect " + sum);
		} else {

			for (Allocation allc : list) {
				Long count = allocationDAO.countNumberAllocations(allc.getUser().getId(), allc.getStartDate(),
						allc.getEndDate());

				if (count > 1) {
					ArrayList<Allocation> alctList = allocationDAO.findAllocationsByAllocation(allc.getUser().getId(),
							allc.getStartDate(), allc.getEndDate());
					
					for (Allocation alc : alctList) {
						if (checkElementMaxAllocation(list, alc)) {
							sum = maxAllocation.subtract(alc.getAllocationPercentage());
						}
					}

				} else {
					sum = Collections.max(map.values());
					System.out.println("sum " + sum);
				}
			}
		}

		return sum;
	}

	private boolean checkElementMaxAllocation(ArrayList<Allocation> list, Allocation element) {
		list.remove(element);

		for (int i = 0; i < list.size(); i++) {
			for (int j = i + 1; j < list.size(); j++) {
				if ((list.get(i).getEndDate().isBefore(element.getEndDate())
						|| list.get(i).getEndDate().equals(element.getEndDate()))
						&& (list.get(j).getEndDate().isBefore(element.getEndDate())
								|| list.get(j).getEndDate().equals(element.getEndDate()))) {
					return true;
				}
			}
		}
		return false;
	}

	public ArrayList<Activity> mapToPrecedents(ArrayList<String> precedentsId) {
		ArrayList<Activity> precedents = new ArrayList<>();
		for (String str : precedentsId) {

			Activity activity = new Activity();
			activity = activityDAO.findById(Long.valueOf(str));
			precedents.add(activity);
		}

		return precedents;
	}

	private ArrayList<ProjectDTO> mapActivitiesAndAllocations(ArrayList<ProjectDTO> resultDTO) {
		for (ProjectDTO projectDTO : resultDTO) {
			ArrayList<Activity> activities = (ArrayList<Activity>) activityDAO
					.findProjectActivities(projectDTO.getId());
			ArrayList<Allocation> allocations = (ArrayList<Allocation>) allocationDAO
					.findProjectResources(projectDTO.getId());

			ArrayList<ActivityDTO> activityDTOs = EntityMapper.toActivityDTOList(activities);
			ArrayList<AllocationDTO> allocationDTOs = EntityMapper.toAllocationDTOList(allocations);
			projectDTO.setActivities(activityDTOs);
			projectDTO.setAllocations(allocationDTOs);
		}
		return resultDTO;
	}

	private ProjectDTO mapActivitiesAndAllocations(ProjectDTO prjctDTO) {
		ArrayList<Activity> activities = (ArrayList<Activity>) activityDAO.findProjectActivities(prjctDTO.getId());
		ArrayList<Allocation> allocations = (ArrayList<Allocation>) allocationDAO
				.findProjectResources(prjctDTO.getId());
		ArrayList<ActivityDTO> activityDTOs = EntityMapper.toActivityDTOList(activities);
		ArrayList<AllocationDTO> allocationDTOs = EntityMapper.toAllocationDTOList(allocations);
		prjctDTO.setActivities(activityDTOs);
		prjctDTO.setAllocations(allocationDTOs);

		return prjctDTO;
	}
}
