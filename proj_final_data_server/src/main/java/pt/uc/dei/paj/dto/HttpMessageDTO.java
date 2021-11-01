package pt.uc.dei.paj.dto;

import java.io.Serializable;

public class HttpMessageDTO extends AbstractDTO implements Serializable {
	private static final long serialVersionUID = 1L;

	public HttpMessageDTO(String msg) {
		super(msg);
	} 
}
