package pt.uc.dei.paj.dto;

public class AbstractDTO {

	protected String msg;
	
	public AbstractDTO() {
		
	}
	
	public AbstractDTO(String msg) {
		this.msg = msg;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}
}
