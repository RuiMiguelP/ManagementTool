package pt.uc.dei.paj.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

import javax.persistence.*;
import pt.uc.dei.paj.dto.AllocationDTO;


@Entity
@Table(name="allocation")
@NamedQueries({
	@NamedQuery(name = "Allocation.findAllAllocationsByUser", query = "SELECT alloc FROM Allocation alloc WHERE alloc.user.id=:userId"),
	@NamedQuery(name = "Allocation.findProjectResources", query = "SELECT alloc FROM Allocation alloc WHERE alloc.project.id=:projectId"),
	@NamedQuery(name = "Allocation.findById", query = "SELECT alloc FROM Allocation alloc WHERE id=:id"),
	
	@NamedQuery(name = "Allocation.findAllAllocationFromAllocation", query = "SELECT alloc FROM Allocation alloc " + 
						"WHERE alloc.user.id=:userId AND ((STR_TO_DATE(:startDate, '%Y-%m-%d %H:%i:%s')) <= alloc.endDate) AND (STR_TO_DATE(:endDate, '%Y-%m-%d %H:%i:%s') >= alloc.startDate) ORDER BY alloc.startDate asc"),
	
	@NamedQuery(name = "Allocation.calcAllocationPercentage", query = "SELECT SUM(alloc.allocationPercentage) FROM Allocation alloc " + 
			            "WHERE alloc.user.id=:userId AND ((STR_TO_DATE(:startDate, '%Y-%m-%d %H:%i:%s')) <= alloc.endDate) AND (STR_TO_DATE(:endDate, '%Y-%m-%d %H:%i:%s') >= alloc.startDate)"),
	
	@NamedQuery(name = "Allocation.countNumberAllocations", query = "SELECT COUNT(alloc.id) FROM Allocation alloc " + 
						"WHERE alloc.user.id =:userId AND ((STR_TO_DATE(:startDate, '%Y-%m-%d %H:%i:%s')) <= alloc.endDate) AND (STR_TO_DATE(:endDate, '%Y-%m-%d %H:%i:%s') >= alloc.startDate)"),
	
	@NamedQuery(name = "Allocation.checkUserAllocations", query = "SELECT alloc FROM Allocation alloc WHERE alloc.user.id = :userId AND alloc.endDate >= CURRENT_TIMESTAMP")
	
})
public class Allocation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "start_date", nullable = false)
	private Instant startDate;
	
	
	@Column(name = "end_date", nullable = false)
	private Instant endDate;
	
	@Column(name = "cost_hour", nullable = false)
	private BigDecimal costPerHour;
	
	@Column(name = "allocation_percentage", nullable = false)
	private BigDecimal allocationPercentage;
	
	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
	
	@ManyToOne
	@JoinColumn(name = "project_id", nullable = false)
	private Project project;
	
	public AllocationDTO toDTO() {
		
		return new AllocationDTO(id, allocationPercentage.toString(), costPerHour.toString(), startDate.toString(), endDate.toString(), user.userInfoToDTO(), project.getId());
	}
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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

	public BigDecimal getCostPerHour() {
		return costPerHour;
	}

	public void setCostPerHour(BigDecimal costPerHour) {
		this.costPerHour = costPerHour;
	}

	public BigDecimal getAllocationPercentage() {
		return allocationPercentage;
	}

	public void setAllocationPercentage(BigDecimal allocationPercentage) {
		this.allocationPercentage = allocationPercentage;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
	}
}
