package pt.uc.dei.paj.dao;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Set;


import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.TypedQuery;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import pt.uc.dei.paj.dto.ActivityHistoryDTO;
import pt.uc.dei.paj.entity.Activity;
import pt.uc.dei.paj.entity.ActivityHistory;

@Stateless
public class ActivityHistoryDAO extends AbstractDAO<ActivityHistory> {

	private static final long serialVersionUID = 1L;
	private static final Logger LOGGER = LoggerFactory.getLogger(ActivityHistoryDAO.class.getName());

	public ActivityHistoryDAO() {
		super(ActivityHistory.class);
	}

	@Inject
	Validator validator;

	/**
	 * Register activity history
	 * @param activity
	 * @param activityHistoryDTO
	 * @param filePath
	 * @return ActivityHistory
	 */
	public ActivityHistory registActivityUpdate(Activity activity, ActivityHistoryDTO activityHistoryDTO, String filePath) {

		ActivityHistory activityHistory = new ActivityHistory();
		activityHistory.setFileType(activityHistoryDTO.getFileType());
		activityHistory.setComment(activityHistoryDTO.getComment());
		activityHistory.setFilePath(filePath);
		activityHistory.setRegisterDate(Instant.now());
		activityHistory.setActivity(activity);
		activityHistory.setUser(activity.getAllocation().getUser());

		Set<ConstraintViolation<ActivityHistory>> constraintViolations = validator.validate(activityHistory);
		if (constraintViolations.isEmpty()) {

			persist(activityHistory);
			return activityHistory;
		} else {
			for (ConstraintViolation<ActivityHistory> violation : constraintViolations) {
				LOGGER.info(violation.getPropertyPath() + " Message: " + violation.getMessage());

			}
		}
		return null;

	}
	
	/**
	 * Find activity histories
	 * @param activityId
	 * @return activity history list
	 */
	public ArrayList<ActivityHistory> findByActivity(long activityId) {
		try {
			TypedQuery<ActivityHistory> activitiesHistory = em.createNamedQuery("ActivityHistory.findByActivity",
					ActivityHistory.class);
			activitiesHistory.setParameter("activityId", activityId);

			return (ArrayList<ActivityHistory>) activitiesHistory.getResultList();
		} catch (Exception e) {
			LOGGER.warn("ActivityHistoryDAO - findByActivity: " + e);
			return null;
		}
	}

}
