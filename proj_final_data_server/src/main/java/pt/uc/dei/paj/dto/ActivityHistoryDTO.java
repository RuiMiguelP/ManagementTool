package pt.uc.dei.paj.dto;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.validation.constraints.NotNull;
import javax.ws.rs.FormParam;

import org.jboss.resteasy.annotations.providers.multipart.PartType;

public class ActivityHistoryDTO extends AbstractDTO implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@FormParam("activityId")
	private long activityId;
	
	@FormParam("comment")
	private String comment;
	
	private String filePath;
	
	@FormParam("fileType")
    private String fileType;

	@FormParam("file")
	@PartType("application/octet-stream")
    private byte[] file;
	
	@FormParam("hoursSpend")
	@NotNull
	private int hoursSpend;

	@FormParam("hoursLeft")
	@NotNull
	private int hoursLeft;

	@FormParam("executionPercentage")
	@NotNull
	private BigDecimal executionPercentage;

	
	public ActivityHistoryDTO() {
		
	}

	public ActivityHistoryDTO(String comment, byte[] file, String fileType) {
		super();
		this.comment = comment;
		this.file = file;
		this.fileType = fileType;
	}

	public ActivityHistoryDTO(long activityId, String comment, byte[] file, String fileType) {
		super();
		this.activityId = activityId;
		this.comment = comment;
		this.file = file;
		this.fileType = fileType;
	}

	public long getActivityId() {
		return activityId;
	}

	public void setActivityId(long activityId) {
		this.activityId = activityId;
	}


	public String getComment() {
		return comment;
	}


	public void setComment(String comment) {
		this.comment = comment;
	}


	public String getFilePath() {
		return filePath;
	}


	public void setFilePath(String filePath) {
		this.filePath = filePath;
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
	
	public byte[] getFile() {
		return file;
	}

	public void setFile(byte[] file) {
		this.file = file;
	}
	
	public String getFileType() {
		return fileType;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}
}
