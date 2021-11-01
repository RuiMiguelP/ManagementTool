package pt.uc.dei.paj.dto;

import java.io.Serializable;
import java.math.BigDecimal;

public class StatsDTO implements Serializable {
	private static final long serialVersionUID = 1L;

	private ProjectDTO projectDTO;
	
	private BigDecimal cpi;
	
	private BigDecimal spi;
	
	public StatsDTO() {
		super();
	}

	public StatsDTO(ProjectDTO projectDTO, BigDecimal cpi, BigDecimal spi) {
		super();
		this.projectDTO = projectDTO;
		this.cpi = cpi;
		this.spi = spi;
	}

	public ProjectDTO getProjectDTO() {
		return projectDTO;
	}

	public void setProjectDTO(ProjectDTO projectDTO) {
		this.projectDTO = projectDTO;
	}

	public BigDecimal getCpi() {
		return cpi;
	}

	public void setCpi(BigDecimal cpi) {
		this.cpi = cpi;
	}

	public BigDecimal getSpi() {
		return spi;
	}

	public void setSpi(BigDecimal spi) {
		this.spi = spi;
	}
}
