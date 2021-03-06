package pt.uc.dei.paj.dao;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.TypedQuery;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.Query;

import pt.uc.dei.paj.dto.ActivityDTO;
import pt.uc.dei.paj.dto.ActivityHistoryDTO;
import pt.uc.dei.paj.entity.Activity;
import pt.uc.dei.paj.entity.Allocation;
import pt.uc.dei.paj.entity.Project;
import pt.uc.dei.paj.enums.ActivityState;
import pt.uc.dei.paj.util.EntityMapper;
import pt.uc.dei.paj.validator.ValidatorUtil;

@Stateless
public class ActivityDAO extends AbstractDAO<Activity> {

	private static final long serialVersionUID = 1L;
	private static final Logger LOGGER = LoggerFactory.getLogger(ActivityDAO.class.getName());

	public ActivityDAO() {
		super(Activity.class);
	}

	@Inject
	Validator validator;

	/**
	 * Register activity
	 * 
	 * @param activityDTO
	 * @param project
	 * @param allocation
	 * @param precedents
	 * @return Activity created
	 */
	public Activity createActivity(ActivityDTO activityDTO, Project project, Allocation allocation,
			ArrayList<Activity> precedents) {

		Activity activity = new Activity();
		activity.setName(activityDTO.getName());
		activity.setDescription(activityDTO.getDescription());
		activity.setType(EntityMapper.mapActivityType(activityDTO.getType()));
		activity.setState(ActivityState.PLANED);
		activity.setAllocation(allocation);
		activity.setStartDate(Instant.parse(activityDTO.getStartDate()));
		activity.setEndDate(Instant.parse(activityDTO.getEndDate()));
		activity.setHoursSpend(0);
		activity.setHoursLeft(activityDTO.getHoursLeft());
		activity.setExecutionPercentage(BigDecimal.ZERO);
		activity.setProject(project);

		// Validate before persist
		Set<ConstraintViolation<Activity>> constraintViolations = validator.validate(activity);
		if (constraintViolations.isEmpty()) {
			persist(activity);

			if (precedents != null) {

				if (!precedents.isEmpty()) {

					activity.addPrecedents(precedents);
					merge(activity);
				}

			}

			return activity;
		} else {
			for (ConstraintViolation<Activity> violation : constraintViolations) {
				LOGGER.warn(violation.getPropertyPath() + " Message: " + violation.getMessage());
			}
		}
		return null;
	}

	/**
	 * Update activity
	 * 
	 * @param activity
	 * @param activityHistoryDTO
	 * @return Activity updated
	 */
	public Activity updateActivity(Activity activity, ActivityHistoryDTO activityHistoryDTO) {

		try {

			activity.setHoursSpend(activityHistoryDTO.getHoursSpend());
			activity.setHoursLeft(activityHistoryDTO.getHoursLeft());
			activity.setExecutionPercentage(activityHistoryDTO.getExecutionPercentage());

			merge(activity);

			return activity;

		} catch (Exception e) {
			LOGGER.warn("ActivityDAO - updateActivity: " + e);
			return null;
		}
	}

	/**
	 * Edit activity
	 * 
	 * @param activity
	 * @param activityDTO
	 * @param allocation
	 * @param precedents
	 * @return activity edited
	 */
	public Activity editActivity(Activity activity, ActivityDTO activityDTO, Allocation allocation,
			ArrayList<Activity> precedents) {

		activity.setName(activityDTO.getName());
		activity.setDescription(activityDTO.getDescription());
		activity.setStartDate(Instant.parse(activityDTO.getStartDate()));
		activity.setEndDate(Instant.parse(activityDTO.getEndDate()));
		activity.setHoursLeft(activityDTO.getHoursLeft());
		activity.setType(EntityMapper.mapActivityType(activityDTO.getType()));
		activity.setAllocation(allocation);

		// Validate before persist
		Set<ConstraintViolation<Activity>> constraintViolations = validator.validate(activity);
		if (constraintViolations.isEmpty()) {

			activity.addPrecedents(precedents);
			merge(activity);

			return activity;
		} else {
			for (ConstraintViolation<Activity> violation : constraintViolations) {
				LOGGER.info(violation.getPropertyPath() + " Message: " + violation.getMessage());
			}
		}
		return null;
	}

	/**
	 * Return activity by Id
	 * 
	 * @param id
	 * @return Activity
	 */
	public Activity findById(long id) {
		try {

			TypedQuery<Activity> activities = em.createNamedQuery("Activity.findById", Activity.class);
			activities.setParameter("id", id);
			return activities.getSingleResult();

		} catch (Exception e) {

			LOGGER.warn("ActivityDAO - findById: " + e);
			return null;
		}
	}

	/**
	 * Find Project Activities
	 * 
	 * @param projectId
	 * @return Activity List
	 */
	public ArrayList<Activity> findProjectActivities(long projectId) {
		try {
			TypedQuery<Activity> activities = em.createNamedQuery("Activity.findProjectActivities", Activity.class);
			activities.setParameter("projectId", projectId);
			return (ArrayList<Activity>) activities.getResultList();
		} catch (Exception e) {
			LOGGER.warn("findProjectActivities: " + e);
			return null;
		}
	}

	/**
	 * Calc actual cost by project
	 * 
	 * @param projectId
	 * @param dayNow
	 * @return actual cost
	 */
	public BigDecimal findActualCostByProject(long projectId, Instant dayNow) {
		try {
			Query q = em.createNativeQuery(
					"SELECT SUM(actv.hours_spend * allc.cost_hour) FROM proj_final_db.activity actv INNER JOIN proj_final_db.allocation allc ON actv.allocation_id = allc.id "
							+ "WHERE actv.project_id=?;");
			q.setParameter(1, projectId);

			if (ValidatorUtil.isNullOrEmpty(String.valueOf(q.getSingleResult()))) {
				return BigDecimal.ZERO;
			}
			return (BigDecimal) (q.getSingleResult());
		} catch (Exception e) {
			LOGGER.warn("findActualCostByProject: " + e);
			return BigDecimal.ZERO;
		}
	}

	/**
	 * Calc earned value by project
	 * 
	 * @param projectId
	 * @param dayNow
	 * @return earned value
	 */
	public BigDecimal findEarnedValueByProject(long projectId, Instant dayNow) {
		try {
			Query q = em.createNativeQuery(
					"SELECT SUM(((actv.hours_spend + actv.hours_left) * allc.cost_hour)*actv.execution_percentage/100) "
							+ "FROM proj_final_db.activity actv INNER JOIN proj_final_db.allocation allc ON actv.allocation_id = allc.id "
							+ "WHERE actv.project_id= ?;");
			q.setParameter(1, projectId);

			if (ValidatorUtil.isNullOrEmpty(String.valueOf(q.getSingleResult()))) {
				return BigDecimal.ZERO;
			}
			return (BigDecimal) (q.getSingleResult());
		} catch (Exception e) {
			LOGGER.warn("findActualCostByProject: " + e);
			return BigDecimal.ZERO;
		}
	}

	/**
	 * Calc planned value by project
	 * 
	 * @param projectId
	 * @param dayNow
	 * @return planned value
	 */
	public BigDecimal findPlannedValueByProject(long projectId, Instant dayNow) {

		try {
			HashMap<String, String> mapGlobal = new HashMap<>();
			HashMap<String, String> mapPlanned = new HashMap<>();
			HashMap<String, BigDecimal> mapPercentage = new HashMap<>();
			ArrayList<BigDecimal> valuesToSum = new ArrayList<>();
			BigDecimal sum = BigDecimal.ZERO;

			Query daysPlanned = em.createNativeQuery(
					"SELECT actv.id, 5 * (DATEDIFF(actv.end_date, actv.start_date) DIV 7) + MID('0123444401233334012222340111123400012345001234550', 7 * WEEKDAY(actv.start_date) + WEEKDAY(actv.end_date) + 1, 1) FROM proj_final_db.activity actv;");

			Query daysGlobalPlanned = em.createNativeQuery(
					"SELECT actv.id, 5 * (DATEDIFF(NOW() + INTERVAL 3 DAY, actv.start_date) DIV 7) + MID('0123444401233334012222340111123400012345001234550', 7 * WEEKDAY(actv.start_date) + WEEKDAY(NOW() + INTERVAL 3 DAY) + 1, 1) FROM proj_final_db.activity actv;");

			// get number days to all period
			List<Object[]> resultGlobalList = daysGlobalPlanned.getResultList();

			// get number planned days
			List<Object[]> resultList = daysPlanned.getResultList();

			// store the elements to maps
			for (Object[] obj : resultGlobalList) {
				mapGlobal.put(obj[0].toString(), obj[1].toString());
			}

			for (Object[] obj : resultList) {
				mapPlanned.put(obj[0].toString(), obj[1].toString());
			}

			// match id values and divide the plan value days by the total value days
			for (Map.Entry<String, String> entry : mapGlobal.entrySet()) {
				for (Map.Entry<String, String> entryPlan : mapPlanned.entrySet()) {
					if (entry.getKey().equalsIgnoreCase(entryPlan.getKey())) {
						mapPercentage.put(entry.getKey(), new BigDecimal(entryPlan.getValue()).divide(new BigDecimal(entry.getValue()) , 2, RoundingMode.HALF_UP));
					}
				}
			}

			// store each value to sum
			for (Map.Entry<String, BigDecimal> entry : mapPercentage.entrySet()) {
				valuesToSum.add(findSumPlannedValueByProject(entry.getKey(), entry.getValue()));
			}

			// sum all values
			for (BigDecimal bg : valuesToSum) {
				sum = sum.add(bg);
			}

			return sum;
		} catch (Exception e) {
			LOGGER.warn("findPlannedValueByProject: " + e);
			return BigDecimal.ZERO;
		}
	}

	/**
	 * Calculate the planned value to the sum
	 * 
	 * @param string
	 * @param percentage
	 * @return element to sum
	 */
	public BigDecimal findSumPlannedValueByProject(String string, BigDecimal percentage) {
		Query q = em.createNativeQuery("SELECT ? * ((actv.hours_spend + actv.hours_left) * allc.cost_hour) "
				+ "FROM proj_final_db.activity actv "
				+ "INNER JOIN proj_final_db.allocation allc ON actv.allocation_id = allc.id " + "WHERE actv.id=?;");

		q.setParameter(1, percentage);
		q.setParameter(2, string);

		return (BigDecimal) (q.getSingleResult());
	}

}
