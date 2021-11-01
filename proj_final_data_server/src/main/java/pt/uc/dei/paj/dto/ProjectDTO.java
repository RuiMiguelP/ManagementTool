package pt.uc.dei.paj.dto;

import java.io.Serializable;
import java.util.List;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import pt.uc.dei.paj.validator.ProjectCode;
import pt.uc.dei.paj.validator.ProjectTypology;

public class ProjectDTO extends AbstractDTO implements Serializable {
	private static final long serialVersionUID = 1L;

	private long id;
	
	private List<AllocationDTO> allocations;
	
	private List<ActivityDTO> activities;

	@Size(min = 6, max = 10)
	@ProjectCode
	private String code;

	@NotEmpty
	private String name;

	@NotEmpty
	private String description;

	@NotEmpty
	private String startDate;

	@NotEmpty
	private String endDate;

	@NotEmpty
	private String customerName;

	@NotEmpty
	@Email
	@Size(max = 64)
	private String customerEmail;

	@NotEmpty
	private String businessSegment;

	private UserDTO manager;

	private UserDTO technicalManager;

	private long managerId;

	private long technicalManagerId;
	
	private String managerEmail;
	
	private String technicalManagerEmail;
	
	@NotEmpty
	private String budget;

	@ProjectTypology
	private String typology;

	private String state;

	public ProjectDTO() {
	}

	public ProjectDTO(long id, String code, String name, String description, String startDate, String endDate,
			String customerName, String customerEmail, String businessSegment, UserDTO manager, UserDTO technicalManager,
			String budget, String typology, String state) {
		super();
		this.id = id;
		this.code = code;
		this.name = name;
		this.description = description;
		this.startDate = startDate;
		this.endDate = endDate;
		this.customerName = customerName;
		this.customerEmail = customerEmail;
		this.businessSegment = businessSegment;
		this.manager = manager;
		this.technicalManager = technicalManager;
		this.budget = budget;
		this.typology = typology;
		this.state = state;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	

	public List<AllocationDTO> getAllocations() {
		return allocations;
	}

	public void setAllocations(List<AllocationDTO> allocations) {
		this.allocations = allocations;
	}

	public String getManagerEmail() {
		return managerEmail;
	}

	public void setManagerEmail(String managerEmail) {
		this.managerEmail = managerEmail;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getCustomerEmail() {
		return customerEmail;
	}

	public void setCustomerEmail(String customerEmail) {
		this.customerEmail = customerEmail;
	}

	public String getBusinessSegment() {
		return businessSegment;
	}

	public void setBusinessSegment(String businessSegment) {
		this.businessSegment = businessSegment;
	}

	public String getTypology() {
		return typology;
	}

	public void setTypology(String typology) {
		this.typology = typology;
	}

	public String getBudget() {
		return budget;
	}

	public void setBudget(String budget) {
		this.budget = budget;
	}

	public UserDTO getManager() {
		return manager;
	}

	public void setManager(UserDTO manager) {
		this.manager = manager;
	}


	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public long getManagerId() {
		return managerId;
	}

	public void setManagerId(long managerId) {
		this.managerId = managerId;
	}

	public UserDTO getTechnicalManager() {
		return technicalManager;
	}

	public void setTechnicalManager(UserDTO technicalManager) {
		this.technicalManager = technicalManager;
	}

	public long getTechnicalManagerId() {
		return technicalManagerId;
	}

	public void setTechnicalManagerId(long technicalManagerId) {
		this.technicalManagerId = technicalManagerId;
	}

	public String getTechnicalManagerEmail() {
		return technicalManagerEmail;
	}

	public void setTechnicalManagerEmail(String techicalManagerEmail) {
		this.technicalManagerEmail = techicalManagerEmail;	
	}


	public List<ActivityDTO> getActivities() {
		return activities;
	}


	public void setActivities(List<ActivityDTO> activities) {
		this.activities = activities;
	}
	
	
}
