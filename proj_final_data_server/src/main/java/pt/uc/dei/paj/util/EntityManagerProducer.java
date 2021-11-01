package pt.uc.dei.paj.util;

import javax.ejb.Stateless;
import javax.enterprise.inject.Disposes;
import javax.enterprise.inject.Produces;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Stateless
public class EntityManagerProducer {
	
	@PersistenceContext(unitName = "ProjFinalApp")
	private EntityManager em;
	
	@Produces
	public EntityManager em(){
		return em;
	}

	public void dispose(@Disposes EntityManager em) {
		em.close();
	}
}
