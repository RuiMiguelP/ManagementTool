package pt.uc.dei.paj.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import pt.uc.dei.paj.dao.ActivityDAO;
import pt.uc.dei.paj.dao.AllocationDAO;
import pt.uc.dei.paj.dao.ProjectDAO;
import pt.uc.dei.paj.dto.StatsDTO;
import pt.uc.dei.paj.entity.Project;

@ApplicationScoped
public class StatsBean {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(StatsBean.class.getName());

	@Inject
	ProjectDAO projectDAO;
	
	@Inject
	AllocationDAO allocationDAO;
	
	@Inject 
	ActivityDAO activityDAO;
	
	/**
	 * 
	 * Calculate Indicators EVM to each project
	 * 
	 */
	public ArrayList<StatsDTO> calcIndicatorsEVM() {
		ArrayList<Project> projectList = projectDAO.findAllProjects();
		ArrayList<StatsDTO> statsDTOList = new ArrayList<>();
		
		for (Project proj: projectList) {
			BigDecimal actualCost = activityDAO.findActualCostByProject(proj.getId(), Instant.now());
			BigDecimal earnedValue = activityDAO.findEarnedValueByProject(proj.getId(), Instant.now());
			BigDecimal plannedValue = activityDAO.findPlannedValueByProject(proj.getId(), Instant.now());
			
			if ((actualCost != null || plannedValue != null) && earnedValue != null) {
				LOGGER.info("Actual Cost: " + actualCost + " && Earned Value " + earnedValue + " && Planned Value " + plannedValue);

				if (plannedValue.compareTo(BigDecimal.ZERO) != 0) {
					BigDecimal CPI = earnedValue.divide(actualCost, 2, RoundingMode.HALF_UP);
					BigDecimal SPI = earnedValue.divide(plannedValue, 2, RoundingMode.HALF_UP);		
					
					statsDTOList.add(new StatsDTO(proj.toDTO(), CPI, SPI));
				} else {
					statsDTOList.add(new StatsDTO(proj.toDTO(), BigDecimal.ZERO, BigDecimal.ZERO));
				}
			} else {
				statsDTOList.add(new StatsDTO(proj.toDTO(), BigDecimal.ZERO, BigDecimal.ZERO));
			}
		}
		return statsDTOList;
	}
}
