package pt.uc.dei.paj.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import pt.uc.dei.paj.dto.ProjectDTO;
import pt.uc.dei.paj.enums.ProjectState;
import pt.uc.dei.paj.enums.ProjectTypology;

@Entity
@Table(name="project")
@NamedQueries({
	@NamedQuery(name = "Project.findById", query = "SELECT prj FROM Project prj WHERE prj.id=:id"),
	@NamedQuery(name = "Project.findByCode", query = "SELECT prj FROM Project prj WHERE prj.code=:code"),
	@NamedQuery(name = "Project.findAll", query = "SELECT prj FROM Project prj"),
	@NamedQuery(name = "Project.findAllProjectsByManager", query = "SELECT prj FROM Project prj WHERE prj.manager.id=:managerId"),
	})
public class Project implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(nullable = false, unique = true)
	@Size(min = 6, max = 10)
	private String code;
	
	@Column(nullable = false, length = 100)
	private String name;
	
	@Column(nullable = false, length = 300)
	private String description;
	
	@Column(name = "start_date", nullable = false)
	private Instant startDate;

	@Column(name = "end_date", nullable = false)
	private Instant endDate;
	
	@Column(name = "customer_name", nullable = false)
	@NotEmpty
	private String customerName;
	
	@Column(name = "customer_email", nullable = false)
	@NotEmpty
	@Email
	@Size(max=64)
	private String customerEmail;
	
	@Column(name = "business_segment", nullable = false)
	private String businessSegment;
	
	@Enumerated(EnumType.STRING)
    private ProjectTypology typology;
	
	@Column(nullable = false)
	private BigDecimal budget;
	
	@Enumerated(EnumType.STRING)
    private ProjectState state;
	
	@ManyToOne
	@JoinColumn(name = "manager_id")
	private User manager;
	
	@ManyToOne
	@JoinColumn(name = "technical_manager_id")
	private User technicalManager;
	
	
	public ProjectDTO toDTO() {
		
		return new ProjectDTO(id, code, name, description, startDate.toString(), endDate.toString(), customerName, customerEmail, businessSegment,
				manager.toDTO(), technicalManager.toDTO(), String.valueOf(budget) ,typology.toString(), state.toString());
	}

	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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

	public ProjectTypology getTypology() {
		return typology;
	}

	public void setTypology(ProjectTypology typology) {
		this.typology = typology;
	}

	public ProjectState getState() {
		return state;
	}

	public void setState(ProjectState state) {
		this.state = state;
	}

	public BigDecimal getBudget() {
		return budget;
	}

	public void setBudget(BigDecimal budget) {
		this.budget = budget;
	}

	public User getManager() {
		return manager;
	}

	public void setManager(User manager) {
		this.manager = manager;
	}


	public User getTechnicalManager() {
		return technicalManager;
	}


	public void setTechnicalManager(User technicalManager) {
		this.technicalManager = technicalManager;
	}
}
