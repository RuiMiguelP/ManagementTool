package pt.uc.dei.paj.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;

import pt.uc.dei.paj.dto.ActivityDTO;
import pt.uc.dei.paj.enums.ActivityState;
import pt.uc.dei.paj.enums.ActivityType;
import pt.uc.dei.paj.util.EntityMapper;

@Entity
@Table(name = "activity")
@NamedQueries({
		@NamedQuery(name = "Activity.findProjectActivities", query = "SELECT actv FROM Activity actv WHERE actv.project.id=:projectId"),
		@NamedQuery(name = "Activity.findById", query = "SELECT actv FROM Activity actv WHERE actv.id=:id") })
public class Activity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(nullable = false, length = 100)
	private String name;

	@Column(nullable = false, length = 300)
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ActivityType type;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ActivityState state;

	@Column(name = "start_date", nullable = false)
	private Instant startDate;

	@Column(name = "end_date", nullable = false)
	private Instant endDate;

	@Column(name = "hours_spend", nullable = false)
	private int hoursSpend;

	@Column(name = "hours_left", nullable = false)
	private int hoursLeft;

	@Column(name = "execution_percentage", nullable = false)
	private BigDecimal executionPercentage;

	@ManyToOne
	@JoinColumn(name = "project_id", nullable = false)
	private Project project;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "precedents", joinColumns = {
			@JoinColumn(name = "activity_id", nullable = false) }, inverseJoinColumns = {
					@JoinColumn(name = "precedent_activities_id", nullable = false) })
	private Set<Activity> precedents = new HashSet<Activity>();

	@ManyToOne
	@JoinColumn(name = "allocation_id", nullable = false)
	private Allocation allocation;

	public ActivityDTO toDTO() {
		return new ActivityDTO(id, name, description, type.toString(), state.toString(), startDate.toString(),
				endDate.toString(), hoursSpend, hoursLeft, executionPercentage,
				EntityMapper.toActivityDTOListFromSet(precedents), allocation.toDTO(), project.getId());
	}

	public void addPrecedents(ArrayList<Activity> precedents) {
		
		this.precedents.clear();

		this.precedents.addAll(precedents);

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

	public Instant getStartDate() {
		return startDate;
	}

	public void setStartDate(Instant startDate) {
		this.startDate = startDate;
	}

	public Instant getEndDate() {
		return endDate;
	}

	public void setEndDate(Instant endDate) {
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

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
	}

	public Set<Activity> getPrecedents() {
		return precedents;
	}

	public void setPrecedents(Set<Activity> precedents) {
		this.precedents = precedents;
	}

	public Allocation getAllocation() {
		return allocation;
	}

	public void setAllocation(Allocation allocation) {
		this.allocation = allocation;
	}

	public ActivityType getType() {
		return type;
	}

	public void setType(ActivityType type) {
		this.type = type;
	}

	public ActivityState getState() {
		return state;
	}

	public void setState(ActivityState state) {
		this.state = state;
	}
}
