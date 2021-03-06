package pt.uc.dei.paj.dao;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Set;


import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.TypedQuery;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import javax.validation.constraints.NotNull;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import pt.uc.dei.paj.dto.AllocationDTO;
import pt.uc.dei.paj.entity.Allocation;


@Stateless
public class AllocationDAO extends AbstractDAO<Allocation> {

	private static final long serialVersionUID = 1L;
	private static final Logger LOGGER = LoggerFactory.getLogger(AllocationDAO.class.getName());

	public AllocationDAO() {
		super(Allocation.class);
	}

	@Inject
	Validator validator;

	@Inject
	UserDAO userDAO;

	@Inject
	ProjectDAO projectDAO;

	/**
	 * Return all allocations by user id
	 * @param userId
	 * @return allocation list
	 */
	public ArrayList<Allocation> findAllAllocationsByUser(long userId) {
		try {
			TypedQuery<Allocation> allocations = em.createNamedQuery("Allocation.findAllAllocationsByUser",
					Allocation.class);
			allocations.setParameter("userId", userId);
			return (ArrayList<Allocation>) allocations.getResultList();
		} catch (Exception e) {
			LOGGER.warn("findAllAllocationsByUser: " + e);
			return null;
		}
	}

	/**
	 * Return allocation by Id
	 * @param id
	 * @return allocation
	 */
	public Allocation findById(long id) {
		try {
			TypedQuery<Allocation> allocations = em.createNamedQuery("Allocation.findById", Allocation.class);
			allocations.setParameter("id", id);
			return allocations.getSingleResult();
		} catch (Exception e) {
			LOGGER.warn("AllocationDAO - findById: " + e);
			return null;
		}
	}

	/**
	 * Allocate a resource with a start date, end date, % of allocation and cost per hour
	 * @param allocationDTO
	 * @return Allocation
	 */
	public Allocation createAllocation(AllocationDTO allocationDTO) {
		Allocation allocation = new Allocation();
		allocation.setUser(userDAO.findById(allocationDTO.getUserId()));
		allocation.setCostPerHour(new BigDecimal(allocationDTO.getCostPerHour()));
		allocation.setAllocationPercentage(new BigDecimal(allocationDTO.getAllocationPercentage()));
		allocation.setStartDate(Instant.parse(allocationDTO.getStartDate()));
		allocation.setEndDate(Instant.parse(allocationDTO.getEndDate()));
		allocation.setProject(projectDAO.findById(allocationDTO.getProjectId()));

		// Validate before persist
		Set<ConstraintViolation<Allocation>> constraintViolations = validator.validate(allocation);
		if (constraintViolations.isEmpty()) {
			persist(allocation);
			return allocation;
		} else {
			for (ConstraintViolation<Allocation> violation : constraintViolations) {
				LOGGER.info(violation.getPropertyPath() + " Message: " + violation.getMessage());
			}

		}
		return null;
	}

	/**
	 * All allocations to certain project dates
	 * @param userId
	 * @param startDate
	 * @param endDate
	 * @return allocation list
	 */
	public ArrayList<Allocation> findAllocationsByAllocation(long userId, Instant startDate, Instant endDate) {
		try {
			TypedQuery<Allocation> allocations = em.createNamedQuery("Allocation.findAllAllocationFromAllocation",
					Allocation.class);
			allocations.setParameter("userId", userId);
			allocations.setParameter("startDate", startDate);
			allocations.setParameter("endDate", endDate);

			return (ArrayList<Allocation>) allocations.getResultList();
		} catch (Exception e) {
			LOGGER.warn("AllocationDAO - findAllocationsByAllocation: " + e);
			return null;
		}
	}

	/**
	 * Find Project Resources
	 * @param projectId
	 * @return allocation list
	 */
	public ArrayList<Allocation> findProjectResources(long projectId) {
		try {
			TypedQuery<Allocation> allocations = em.createNamedQuery("Allocation.findProjectResources",
					Allocation.class);
			allocations.setParameter("projectId", projectId);
			return (ArrayList<Allocation>) allocations.getResultList();
		} catch (Exception e) {
			LOGGER.warn("findProjectResources: " + e);
			return null;
		}
	}

	/**
	 * Retrieve allocation percentage
	 * @param userId
	 * @param startDate
	 * @param endDate
	 * @return allocation percentage
	 */
	public BigDecimal calcAllocationPercentage(long userId, Instant startDate, Instant endDate) {
		try {
			TypedQuery<BigDecimal> allocations = em.createNamedQuery("Allocation.calcAllocationPercentage",
					BigDecimal.class);
			allocations.setParameter("userId", userId);
			allocations.setParameter("startDate", startDate);
			allocations.setParameter("endDate", endDate);

			return (BigDecimal) allocations.getSingleResult();
		} catch (Exception e) {
			LOGGER.warn("calcAllocationPercentage: " + e);
			return null;
		}
	}

	/**
	 * Count number allocations
	 * @param userId
	 * @param startDate
	 * @param endDate
	 * @return number allocation
	 */
	public Long countNumberAllocations(long userId, Instant startDate, Instant endDate) {
		try {
			TypedQuery<Long> allocations = em.createNamedQuery("Allocation.countNumberAllocations", Long.class);
			allocations.setParameter("userId", userId);
			allocations.setParameter("startDate", startDate);
			allocations.setParameter("endDate", endDate);

			return (Long) allocations.getSingleResult();
		} catch (Exception e) {
			LOGGER.warn("countNumberAllocations: " + e);
			return (Long) null;
		}
	}

	/**
	 * check user allocations
	 * @param userId
	 * @return isAvailable
	 */
	public boolean checkUserAllocations(long userId) {
		try {
			boolean isAvailable = true;
			TypedQuery<Allocation> allocations = em.createNamedQuery("Allocation.checkUserAllocations", Allocation.class);
			allocations.setParameter("userId", userId);
			
			ArrayList<Allocation> allocationsList = (ArrayList<Allocation>) allocations.getResultList();

			if (allocationsList != null) {
				if(!allocationsList.isEmpty()) {
					isAvailable = false;
				}
			}
			
			return isAvailable;
		} catch (Exception e) {
			LOGGER.warn("checkUserAllocations: " + e);
			return false;
		}
	}

	
}
