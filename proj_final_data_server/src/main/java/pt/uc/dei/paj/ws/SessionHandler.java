package pt.uc.dei.paj.ws;

import java.time.Duration;
import java.time.Instant;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.websocket.Session;

import pt.uc.dei.paj.dto.NotificationDTO;
import pt.uc.dei.paj.enums.NotificationType;
import pt.uc.dei.paj.util.Constants;

@Startup
@Singleton
public class SessionHandler {

	public static ConcurrentHashMap<String, Session> sessionClient = new ConcurrentHashMap<String, Session>();
	public static ConcurrentHashMap<String, Instant> controlSession = new ConcurrentHashMap<String, Instant>();


	public static Session sessionFromUser(String userId) {

		for (String user_key : sessionClient.keySet()) {
			if (user_key.equalsIgnoreCase(userId)) {
				return sessionClient.get(user_key);
			}
		}
		return null;
	}

	public static String userFromSession(Session session) {
		
		for (Entry<String, Session> sessionOf : sessionClient.entrySet()) {
			if (sessionOf.getValue().equals(session)) {
				return sessionOf.getKey();
			}
		}
		
		return null;
	}
	
	public static void updateSessionTime(long userId) {
		controlSession.put(String.valueOf(userId), Instant.now());
	}
	
	public static void checkIfSessionOut(String userId) {
		Instant pastDate = controlSession.get(String.valueOf(userId));
		
		Duration duration = Duration.between(Instant.now(), pastDate);
		
		if (Constants.TIMEOUT_MINUTES < Math.abs(duration.toMinutes())) {
			NotificationEndpoint.sendMessage(new NotificationDTO(Long.parseLong(userId), NotificationType.SESSION_OUT));
		}
	}
	
	@Schedule(persistent = false, hour = "*", minute = "*/1")
	public void updateSession() {
		if (!sessionClient.isEmpty()) {
			for (String user_key : sessionClient.keySet()) {
				checkIfSessionOut(user_key);
			}
		}
		
	}
	
	public static void sessionOut(long userId) {
		controlSession.remove(String.valueOf(userId));
		sessionClient.remove(String.valueOf(userId));
	}
}
