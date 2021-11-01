package pt.uc.dei.paj.dto;

import java.io.Serializable;
import java.util.ArrayList;

public class AllocationsDTO implements Serializable{
	private static final long serialVersionUID = 1L;
	
	private ArrayList<AllocationDTO> allocationList;
	
	public AllocationsDTO() {
	
	}

	public AllocationsDTO(ArrayList<AllocationDTO> allocationList) {
		this.allocationList = allocationList;
	}

	public ArrayList<AllocationDTO> getAllocationList() {
		return allocationList;
	}

	public void setAllocationList(ArrayList<AllocationDTO> allocationList) {
		this.allocationList = allocationList;
	}
}
