package pt.uc.dei.paj.ws;

import java.util.ArrayList;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.core.Response;

import pt.uc.dei.paj.dao.AllocationDAO;
import pt.uc.dei.paj.dao.ProfileDAO;
import pt.uc.dei.paj.dao.ProjectDAO;
import pt.uc.dei.paj.dao.UserDAO;
import pt.uc.dei.paj.dto.ActivityDTO;
import pt.uc.dei.paj.dto.AllocationDTO;
import pt.uc.dei.paj.dto.NotificationDTO;
import pt.uc.dei.paj.dto.ProjectDTO;
import pt.uc.dei.paj.dto.UserDTO;
import pt.uc.dei.paj.entity.Activity;
import pt.uc.dei.paj.entity.Allocation;
import pt.uc.dei.paj.entity.Project;
import pt.uc.dei.paj.entity.User;
import pt.uc.dei.paj.enums.NotificationType;
import pt.uc.dei.paj.enums.ProfileType;
import pt.uc.dei.paj.util.EntityMapper;

@ApplicationScoped
public class NotificationBean {

	@Inject
	AllocationDAO allocationDAO;

	@Inject
	ProjectDAO projectDAO;

	@Inject
	UserDAO userDAO;

	@Inject
	ProfileDAO profileDAO;

	public void createNotificationNewProject(ProjectDTO projectDTO, User user) {
		for (AllocationDTO allcDTO : projectDTO.getAllocations()) {
			if (user.getId() != allcDTO.getUser().getId()) {
				NotificationDTO notificationDTO = new NotificationDTO(allcDTO.getUser().getId(), projectDTO,
						NotificationType.NEW_PROJECT);
				NotificationEndpoint.sendMessage(notificationDTO);
			}
		}
	}

	public void createNotificationNewActivity(ActivityDTO activityDTO, ProjectDTO projectDTO, User user) {
		for (AllocationDTO allcDTO : projectDTO.getAllocations()) {
			if (user.getId() != allcDTO.getUser().getId()) {
				NotificationDTO notificationDTO = new NotificationDTO(allcDTO.getUser().getId(), activityDTO,
						projectDTO, NotificationType.NEW_ACTIVITY);
				NotificationEndpoint.sendMessage(notificationDTO);
			}
		}
	}

	public void createNotificationAddResourceToProject(ArrayList<AllocationDTO> allcAddedList, User user,
			long projectId) {
		ArrayList<Allocation> allcList = allocationDAO.findProjectResources(projectId);
		ArrayList<AllocationDTO> allcDTOList = EntityMapper.toAllocationDTOList(allcList);

		for (AllocationDTO allcDTO : allcDTOList) {
			if (user.getId() != allcDTO.getUser().getId()) {
				NotificationDTO notificationDTO = new NotificationDTO(allcDTO.getUser().getId(), allcAddedList,
						NotificationType.NEW_RESOURCE, projectDAO.findById(projectId).toDTO());
				NotificationEndpoint.sendMessage(notificationDTO);
			}
		}
	}

	public void createNotificationChangeActivity(ActivityDTO actvDTO, User user) {
		ArrayList<Allocation> allcList = allocationDAO.findProjectResources(actvDTO.getProjectId());
		ArrayList<AllocationDTO> allcDTOList = EntityMapper.toAllocationDTOList(allcList);
		for (AllocationDTO allcDTO : allcDTOList) {
			if (user.getId() != allcDTO.getUser().getId()) {
				NotificationDTO notificationDTO = new NotificationDTO(allcDTO.getUser().getId(), actvDTO,
						projectDAO.findById(actvDTO.getProjectId()).toDTO(), NotificationType.ACTIVITY_CHANGED);
				NotificationEndpoint.sendMessage(notificationDTO);
			}
		}
	}

	public void createNotificationUserChanged(User user) {
		boolean isAdmin = userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.ADMIN));
		boolean isDirector = userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.DIRECTOR));
		boolean isUser = userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.USER));
		boolean isVisitor = userDAO.findUserProfile(user, profileDAO.findByProfileType(ProfileType.VISITOR));

		UserDTO userDTO = new UserDTO(user.getId(), user.getToken(), user.getName(), isAdmin, isDirector, isUser,
				isVisitor);

		NotificationDTO notificationDTO = new NotificationDTO(user.getId(), userDTO, NotificationType.USER_CHANGED);
		NotificationEndpoint.sendMessage(notificationDTO);

	}

	public void createNotificationChangeProject(ProjectDTO projectDTO, User user) {
		for (AllocationDTO allcDTO : projectDTO.getAllocations()) {
			if (user.getId() != allcDTO.getUser().getId()) {
				NotificationDTO notificationDTO = new NotificationDTO(allcDTO.getUser().getId(), projectDTO,
						NotificationType.PROJECT_CHANGED);
				NotificationEndpoint.sendMessage(notificationDTO);
			}
		}
	}

	public void createNotificationUpdateActivity(ActivityDTO activityDTO, User user) {
		ArrayList<Allocation> allcList = allocationDAO.findProjectResources(activityDTO.getProjectId());
		ArrayList<AllocationDTO> allcDTOList = EntityMapper.toAllocationDTOList(allcList);
		
		for (AllocationDTO allcDTO : allcDTOList) {
			if (user.getId() != allcDTO.getUser().getId()) {
				NotificationDTO notificationDTO = new NotificationDTO(allcDTO.getUser().getId(), activityDTO,
						projectDAO.findById(activityDTO.getProjectId()).toDTO(), NotificationType.UPDATE_ACTIVITY);
				NotificationEndpoint.sendMessage(notificationDTO);
			}
		}
	}

}
