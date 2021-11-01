package pt.uc.dei.paj.entity;

import java.io.Serializable;
import java.time.Instant;

import javax.persistence.*;

@Entity
@Table(name="activity_history")
@NamedQueries({
	@NamedQuery(name = "ActivityHistory.findByActivity", query = "SELECT actv FROM ActivityHistory actv WHERE actv.activity.id=:activityId") })
public class ActivityHistory implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(updatable = false, nullable = false)
	private long id;
	
	@Column(nullable = false, length = 1000)
	private String comment;
	
	
	@Column(name="register_date", nullable = false)
	private Instant registerDate;
	
	@Column(name="file_path",length = 1000)
	private String filePath;
	
	@Column(name="file_type",length = 4)
	private String fileType;
	
	@ManyToOne
	@JoinColumn(name="user_id") 
	private User user;
	
	@ManyToOne
	@JoinColumn(name="activity_id") 
	private  Activity activity;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Instant getRegisterDate() {
		return registerDate;
	}

	public void setRegisterDate(Instant registerDate) {
		this.registerDate = registerDate;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Activity getActivity() {
		return activity;
	}

	public void setActivity(Activity activity) {
		this.activity = activity;
	}

	public String getFileType() {
		return fileType;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}
}
