package pt.uc.dei.paj.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Set;

import javax.enterprise.inject.New;
import javax.inject.Inject;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.RandomStringUtils;

import pt.uc.dei.paj.dao.ActivityDAO;
import pt.uc.dei.paj.dao.ProjectDAO;
import pt.uc.dei.paj.dto.ActivityDTO;
import pt.uc.dei.paj.dto.AllocationDTO;
import pt.uc.dei.paj.dto.ProjectDTO;
import pt.uc.dei.paj.dto.UserDTO;
import pt.uc.dei.paj.entity.Activity;
import pt.uc.dei.paj.entity.Allocation;
import pt.uc.dei.paj.entity.Project;
import pt.uc.dei.paj.entity.User;
import pt.uc.dei.paj.enums.ActivityState;
import pt.uc.dei.paj.enums.ActivityType;
import pt.uc.dei.paj.enums.ProfileType;
import pt.uc.dei.paj.enums.ProjectState;
import pt.uc.dei.paj.enums.ProjectTypology;

public class EntityMapper {

	public static ArrayList<UserDTO> toUserDTOList(ArrayList<User> original) {
		ArrayList<UserDTO> listDto = new ArrayList<>();

		for (User auc : original) {
			listDto.add(auc.toDTO());
		}

		return listDto;
	}

	public static ArrayList<AllocationDTO> toAllocationDTOList(ArrayList<Allocation> original) {
		ArrayList<AllocationDTO> listDto = new ArrayList<>();

		for (Allocation auc : original) {
			listDto.add(auc.toDTO());
		}

		return listDto;
	}

	public static ArrayList<ActivityDTO> toActivityDTOList(ArrayList<Activity> original) {
		ArrayList<ActivityDTO> listDto = new ArrayList<>();

		for (Activity act : original) {
			listDto.add(act.toDTO());
		}

		return listDto;
	}
	public static ArrayList<ActivityDTO> toActivityDTOListFromSet(Set<Activity> original) {
		ArrayList<ActivityDTO> listDto = new ArrayList<>();

		for (Activity act : original) {
			listDto.add(act.toDTO());
		}

		return listDto;
	}

	public static ArrayList<ProjectDTO> toProjectDTOList(ArrayList<Project> original) {
		ArrayList<ProjectDTO> listDto = new ArrayList<>();

		for (Project proj : original) {
			listDto.add(proj.toDTO());
		}

		return listDto;
	}

	public static UserDTO filterValue(ProfileType profileValue, UserDTO userDTO, boolean value) {
		switch (profileValue) {
		case ADMIN:
			userDTO.setAdmin(value);
			break;
		case DIRECTOR:
			userDTO.setDirector(value);
			break;
		case USER:
			userDTO.setUser(value);
			break;
		case VISITOR:
			userDTO.setVisitor(value);
			break;
		default:
			break;
		}
		return userDTO;
	}

	public static ProjectTypology mapProjectTypology(String typology) {
		switch (typology) {
		case "FIX_COST":
			return ProjectTypology.FIX_COST;
		case "TIME_MATERIALS":
			return ProjectTypology.TIME_MATERIALS;
		default:
			break;
		}
		return null;
	}

	public static ProjectState mapProjectState(String state) {
		switch (state) {
		case "PLANNED":
			return ProjectState.PLANNED;
		case "START_UP":
			return ProjectState.START_UP;
		case "EXECUTION":
			return ProjectState.EXECUTION;
		case "DELIVERY":
			return ProjectState.DELIVERY;
		case "WARRANTY":
			return ProjectState.WARRANTY;
		case "CLOSED":
			return ProjectState.CLOSED;
		default:
			break;
		}
		return null;
	}

	public static ActivityState mapActivityState(String state) {
		switch (state) {
		case "PLANED":
			return ActivityState.PLANED;
		case "IN_EXECUTION":
			return ActivityState.IN_EXECUTION;
		case "FINISHED":
			return ActivityState.FINISHED;
		case "BLOCKED":
			return ActivityState.BLOCKED;
		default:
			break;
		}
		return null;
	}

	public static ActivityType mapActivityType(String type) {
		switch (type) {
		case "MEETING":
			return ActivityType.MEETING;
		case "DOCUMENTATION":
			return ActivityType.DOCUMENTATION;
		case "CODIFICATION":
			return ActivityType.CODIFICATION;
		case "TESTS":
			return ActivityType.TESTS;
		case "INSTALLATION":
			return ActivityType.INSTALLATION;
		case "OTHERS":
			return ActivityType.OTHERS;
		default:
			break;
		}
		return null;
	}

	public static String writeProfilePhoto(byte[] content, String filename) throws IOException {
		createFolderPathIfNotExist(Constants.PHOTOS_FILE_PATH);
		String fileName = Constants.PHOTOS_FILE_PATH.concat(filename).concat(Constants.PHOTO_FORMAT);
		File file = new File(fileName);
		writeFile(file, content);
		
		return fileName;
	}

	public static String writeFileActivityHistory(byte[] content, String fileType) throws IOException {
		createFolderPathIfNotExist(Constants.FILE_PATH);
		String name = String.format("%s.%s", RandomStringUtils.randomAlphanumeric(8), fileType);
		String fileName = Constants.FILE_PATH.concat(name);
		
		File file = new File(fileName);
		writeFile(file, content);
		 
		return fileName;
	}
	
	private static void writeFile(File file, byte[] content) throws IOException {
		if (!file.exists()) {
			file.createNewFile();
		}
		
		FileOutputStream fop = new FileOutputStream(file);
		fop.write(content);
		fop.flush();
		fop.close();
	}

	public static byte[] readFilePath(String filename) throws IOException {
		File file = new File(filename);
		byte[] bArray = new byte[(int) file.length()];

		FileInputStream fis = new FileInputStream(file);
		fis.read(bArray);
		fis.close();

		return bArray;
	}
	
	public static void createFolderPathIfNotExist(String filename) throws IOException {
		File mainPath = new File(filename);
		
		if (!mainPath.exists()) {
			mainPath.mkdirs();
		}
	}
	
}
