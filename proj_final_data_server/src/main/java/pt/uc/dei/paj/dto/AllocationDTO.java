package pt.uc.dei.paj.dto;

import java.io.Serializable;


import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class AllocationDTO extends AbstractDTO implements Serializable {
	private static final long serialVersionUID = 1L;

	private long id;
	
	private String allocationPercentage;
	
	private String costPerHour;
	
	@NotEmpty
	private String startDate;
	
	@NotEmpty
	private String endDate;
	
	@NotNull
	private long userId;
	
	private long projectId;
	
	private UserDTO user;
	
	public AllocationDTO() {
		super();
	}
	
	public AllocationDTO(long id, String allocationPercentage, String costPerHour, String startDate,
			String endDate, UserDTO user, long projectId) {
		super();
		this.id = id;
		this.allocationPercentage = allocationPercentage;
		this.costPerHour = costPerHour;
		this.startDate = startDate;
		this.endDate = endDate;
		this.user = user;
		this.projectId = projectId;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getAllocationPercentage() {
		return allocationPercentage;
	}

	public void setAllocationPercentage(String allocationPercentage) {
		this.allocationPercentage = allocationPercentage;
	}

	public String getCostPerHour() {
		return costPerHour;
	}

	public void setCostPerHour(String costPerHour) {
		this.costPerHour = costPerHour;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

	public long getProjectId() {
		return projectId;
	}

	public void setProjectId(long projectId) {
		this.projectId = projectId;
	}

	public UserDTO getUser() {
		return user;
	}

	public void setUser(UserDTO user) {
		this.user = user;
	}
}
