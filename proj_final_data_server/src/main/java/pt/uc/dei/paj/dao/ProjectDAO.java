package pt.uc.dei.paj.dao;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.ListJoin;
import javax.persistence.criteria.Root;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import pt.uc.dei.paj.dto.EditProjectDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pt.uc.dei.paj.dto.ProjectDTO;
import pt.uc.dei.paj.entity.Allocation;
import pt.uc.dei.paj.entity.Project;
import pt.uc.dei.paj.entity.User;
import pt.uc.dei.paj.enums.ProjectState;
import pt.uc.dei.paj.util.EntityMapper;

@Stateless
public class ProjectDAO extends AbstractDAO<Project> {

	private static final long serialVersionUID = 1L;
	private static final Logger LOGGER = LoggerFactory.getLogger(ProjectDAO.class.getName());

	public ProjectDAO() {
		super(Project.class);
	}
 
	@Inject
	Validator validator;

	@Inject
	UserDAO userDAO;

	/**
	 * Register project
	 * @param projectDTO
	 * @param manager
	 * @param technicalManager
	 * @return project created
	 */
	public Project createProject(ProjectDTO projectDTO, User manager, User technicalManager) {
		Project project = new Project();
		project.setCode(projectDTO.getCode());
		project.setName(projectDTO.getName());
		project.setDescription(projectDTO.getDescription());
		project.setStartDate(Instant.parse(projectDTO.getStartDate()));
		project.setEndDate(Instant.parse(projectDTO.getEndDate()));
		project.setCustomerName(projectDTO.getCustomerName());
		project.setCustomerEmail(projectDTO.getCustomerEmail());
		project.setBusinessSegment(projectDTO.getBusinessSegment());
		project.setTypology(EntityMapper.mapProjectTypology(projectDTO.getTypology()));
		project.setBudget(new BigDecimal(projectDTO.getBudget()));
		project.setState(ProjectState.PLANNED);
		project.setManager(manager);
		project.setTechnicalManager(technicalManager);

		// Validate before persist
		Set<ConstraintViolation<Project>> constraintViolations = validator.validate(project);
		if (constraintViolations.isEmpty()) {
			persist(project);
			return project;
		} else {
			for (ConstraintViolation<Project> violation : constraintViolations) {
				LOGGER.info(violation.getPropertyPath() + " Message: " + violation.getMessage());
			}
		}
		return null;
	}

	/**
	 * Update project
	 * @param projectDTO
	 * @param technicalManager
	 * @return project updated
	 */
	public Project updateProject(EditProjectDTO projectDTO, User technicalManager) {

		Project project = find(projectDTO.getId());

		project.setTechnicalManager(technicalManager);
		project.setName(projectDTO.getName());
		project.setDescription(projectDTO.getDescription());
		project.setState(EntityMapper.mapProjectState(projectDTO.getState()));

		// Validate before persist
		Set<ConstraintViolation<Project>> constraintViolations = validator.validate(project);
		if (constraintViolations.isEmpty()) {
			merge(project);
			return project;
		} else {
			for (ConstraintViolation<Project> violation : constraintViolations) {
				LOGGER.info(violation.getPropertyPath() + " Message: " + violation.getMessage());
			}
		}
		return null;
	}

	/**
	 * Return project by Id
	 * @param id
	 * @return project
	 */
	public Project findById(long id) {
		try {
			TypedQuery<Project> projects = em.createNamedQuery("Project.findById", Project.class);
			projects.setParameter("id", id);
			return projects.getSingleResult();
		} catch (Exception e) {
			LOGGER.warn("ProjectDAO - findById: " + e);
			return null;
		}
	}

	/**
	 * Return project by code
	 * @param code
	 * @return project
	 */
	public Project findByCode(String code) {
		try {
			TypedQuery<Project> u = em.createNamedQuery("Project.findByCode", Project.class);
			u.setParameter("code", code);
			return u.getSingleResult();
		} catch (Exception e) {
			LOGGER.warn("findByCode: " + e);
			return null;
		}
	}

	/**
	 * Return all projects
	 * @return all projects
	 */
	public ArrayList<Project> findAllProjects() {
		try {
			TypedQuery<Project> projects = em.createNamedQuery("Project.findAll", Project.class);
			return (ArrayList<Project>) projects.getResultList();
		} catch (Exception e) {
			LOGGER.warn("findAllProjects: " + e);
			return null;
		}
	}

	/**
	 * Return all projects by manager id
	 * @param managerId
	 * @return project list
	 */
	public ArrayList<Project> findAllProjectsByManager(long managerId) {
		try {
			TypedQuery<Project> projects = em.createNamedQuery("Project.findAllProjectsByManager", Project.class);
			projects.setParameter("managerId", managerId);
			return (ArrayList<Project>) projects.getResultList();
		} catch (Exception e) {
			LOGGER.warn("findAllProjectsByManager: " + e);
			return null;
		}
	}

	/**
	 * Return all projects by own manger and user
	 * @param userId
	 * @return list projects id's
	 */
	public ArrayList<String> findAllProjectsOwnManagerAndUser(long userId) {

		try {
			ArrayList<String> projectsId = new ArrayList<>();
			Query query = em.createNativeQuery("SELECT DISTINCT(proj.id), proj.name FROM proj_final_db.project proj "
					+ "INNER JOIN proj_final_db.allocation alloc ON alloc.project_id = proj.id "
					+ "WHERE alloc.user_id = ? OR proj.manager_id = ? ORDER BY proj.id;");

			query.setParameter(1, userId);
			query.setParameter(2, userId);

			List<Object[]> resultList = query.getResultList();

			for (Object[] obj : resultList) {
				projectsId.add(obj[0].toString());
			}

			return projectsId;
		} catch (Exception e) {
			LOGGER.warn("ProjectDAO - findAllProjectsOwnManagerAndUser: " + e);
			return null;
		}
	}

}
