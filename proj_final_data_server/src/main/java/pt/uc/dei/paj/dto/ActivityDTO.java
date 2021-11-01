package pt.uc.dei.paj.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class ActivityDTO extends AbstractDTO implements Serializable {
	private static final long serialVersionUID = 1L;
	private long id;

	@Size(max = 100)
	@NotEmpty
	private String name;

	@Size(max = 300)
	private String description;

	@NotEmpty
	private String type;

	private String state;

	@NotNull
	private String startDate;

	@NotNull
	private String endDate;

	private int hoursSpend;

	@NotNull
	private int hoursLeft;

	private BigDecimal executionPercentage;

	private ArrayList<String> precedentsId;

	private ArrayList<ActivityDTO> precedents;

	private AllocationDTO allocation;

	@NotNull
	private long allocationId;

	private long projectId;

	public ActivityDTO() {
	}

	public ActivityDTO(long id, String name, String description, String type, String state, String startDate,
			String endDate, int hoursSpend, int hoursLeft, BigDecimal executionPercentage,
			ArrayList<ActivityDTO> precedents, AllocationDTO allocationDTO, long projectId) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.type = type;
		this.state = state;
		this.startDate = startDate;
		this.endDate = endDate;
		this.hoursSpend = hoursSpend;
		this.hoursLeft = hoursLeft;
		this.executionPercentage = executionPercentage;
		this.precedents = precedents;
		this.allocation = allocationDTO;
		this.projectId = projectId;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
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

	public int getHoursSpend() {
		return hoursSpend;
	}

	public void setHoursSpend(int hoursSpend) {
		this.hoursSpend = hoursSpend;
	}

	public int getHoursLeft() {
		return hoursLeft;
	}

	public void setHoursLeft(int hoursLeft) {
		this.hoursLeft = hoursLeft;
	}

	public BigDecimal getExecutionPercentage() {
		return executionPercentage;
	}

	public void setExecutionPercentage(BigDecimal executionPercentage) {
		this.executionPercentage = executionPercentage;
	}

	public AllocationDTO getAllocation() {
		return allocation;
	}

	public void setAllocation(AllocationDTO allocation) {
		this.allocation = allocation;
	}

	public long getAllocationId() {
		return allocationId;
	}

	public void setAllocationId(long allocationId) {
		this.allocationId = allocationId;
	}

	public ArrayList<String> getPrecedentsId() {
		return precedentsId;
	}

	public void setPrecedentsId(ArrayList<String> precedentsId) {
		this.precedentsId = precedentsId;
	}

	public ArrayList<ActivityDTO> getPrecedents() {
		return precedents;
	}

	public void setPrecedents(ArrayList<ActivityDTO> precedents) {
		this.precedents = precedents;
	}

	public long getProjectId() {
		return projectId;
	}

	public void setProjectId(long projectId) {
		this.projectId = projectId;
	}

}
