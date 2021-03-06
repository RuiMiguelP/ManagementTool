package pt.uc.dei.paj.dto;

import java.io.Serializable;
import java.util.ArrayList;

import pt.uc.dei.paj.enums.NotificationType;

public class NotificationDTO implements Serializable {
private static final long serialVersionUID = 1L;
	
	private long userTarget;
	private ProjectDTO projectDTO;
	private long projectId;
	private ActivityDTO activityDTO;
	private NotificationType notificationType;
	private ArrayList<AllocationDTO> allocationsDTO;
	private UserDTO userDTO;
	

	public NotificationDTO() {
	}
	
	public NotificationDTO(long userTarget, ProjectDTO projectDTO, NotificationType notificationType) {
		super();
		this.userTarget = userTarget;
		this.projectDTO = projectDTO;
		this.notificationType = notificationType;
	}

	public NotificationDTO(long userTarget, ActivityDTO activityDTO, NotificationType notificationType) {
		super();
		this.userTarget = userTarget;
		this.activityDTO = activityDTO;
		this.notificationType = notificationType;
	}
	
	public NotificationDTO(long userTarget, ActivityDTO activityDTO, ProjectDTO projectDTO, NotificationType notificationType) {
		super();
		this.userTarget = userTarget;
		this.activityDTO = activityDTO;
		this.projectDTO = projectDTO;
		this.notificationType = notificationType;
	}

	public NotificationDTO(long userTarget, NotificationType notificationType) {
		super();
		this.userTarget = userTarget;
		this.notificationType = notificationType;
	}

	public NotificationDTO(long userTarget, ArrayList<AllocationDTO> allocationsDTO, NotificationType notificationType, ProjectDTO projectDTO) {
		super();
		this.userTarget = userTarget;
		this.allocationsDTO = allocationsDTO;
		this.notificationType = notificationType;
		this.projectDTO = projectDTO;
	}

	public NotificationDTO(long userTarget, UserDTO userDTO, NotificationType notificationType) {
		super();
		this.userTarget = userTarget;
		this.userDTO = userDTO;
		this.notificationType = notificationType;
	}

	public long getProjectId() {
		return projectId;
	}

	public void setProjectId(long projectId) {
		this.projectId = projectId;
	}

	public long getUserTarget() {
		return userTarget;
	}

	public void setUserTarget(long userTarget) {
		this.userTarget = userTarget;
	}

	public ProjectDTO getProjectDTO() {
		return projectDTO;
	}

	public void setProjectDTO(ProjectDTO projectDTO) {
		this.projectDTO = projectDTO;
	}

	public ActivityDTO getActivityDTO() {
		return activityDTO;
	}

	public void setActivityDTO(ActivityDTO activityDTO) {
		this.activityDTO = activityDTO;
	}
	
	public void setNotificationType(NotificationType notificationType) {
		this.notificationType = notificationType;
	}

	public NotificationType getNotificationType() {
		return notificationType;
	}

	public ArrayList<AllocationDTO> getAllocationsDTO() {
		return allocationsDTO;
	}

	public void setAllocationsDTO(ArrayList<AllocationDTO> allocationsDTO) {
		this.allocationsDTO = allocationsDTO;
	}

	public UserDTO getUserDTO() {
		return userDTO;
	}

	public void setUserDTO(UserDTO userDTO) {
		this.userDTO = userDTO;
	}
}
