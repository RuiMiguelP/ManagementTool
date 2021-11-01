package pt.uc.dei.paj.ws;

import java.io.IOException;
import java.time.Instant;
import java.util.logging.Level;
import java.util.logging.Logger;


import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import pt.uc.dei.paj.dto.NotificationDTO;

@ServerEndpoint(value = "/notifications/{userId}")
public class NotificationEndpoint {

	private static final Logger logger = Logger.getLogger("NotificationEndpoint");
	private static Session session;
	
	@OnOpen
	public void openConnection(Session session, @PathParam("userId") String userId) {
		SessionHandler.sessionClient.put(userId, session);
		SessionHandler.controlSession.put(userId, Instant.now());
		logger.log(Level.INFO, "Connection opened.");
	}
	
	@OnClose
	public void closedConnection(Session session, @PathParam("userId") String userId) {
		SessionHandler.sessionClient.remove(userId);
		logger.log(Level.INFO, "Connection closed.");
	}
	
	@OnError
	public void error(Session session, Throwable t) {
		logger.log(Level.INFO, t.toString());
		logger.log(Level.INFO, "Connection error.");
	}
	
	public static void sendMessage(NotificationDTO message) {
		String jsonMessage = "";
		ObjectMapper mapper = new ObjectMapper();
		
		try {
			jsonMessage = mapper.writeValueAsString(message);
			
		} catch (JsonProcessingException e) {
			logger.log(Level.INFO, "encode");
			e.printStackTrace();
		}
		
		NotificationEndpoint.session = SessionHandler.sessionFromUser(String.valueOf(message.getUserTarget()));
		
		if (NotificationEndpoint.session != null && NotificationEndpoint.session.isOpen()) {
			try {
				session.getBasicRemote().sendText(jsonMessage);

			} catch (IOException e) {
				logger.log(Level.INFO, e.toString());
			}
		}
	}
}
