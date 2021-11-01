package pt.uc.dei.paj.dao;

import java.io.Serializable;

import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.persistence.EntityManager;

@TransactionAttribute(TransactionAttributeType.REQUIRED)
public abstract class AbstractDAO<T extends Serializable> implements Serializable {
	private static final long serialVersionUID = 1L;

	private final Class<T> clazz;

	@Inject
	protected EntityManager em;

	public AbstractDAO(Class<T> clazz) {
		this.clazz = clazz;
	}
	
	public Class<T> getClazz() {
		return clazz;
	}

	public void merge(final T entity) {
		em.merge(entity);
	}

	public T find(Object id) {
		return em.find(clazz, id);
	}

	public void persist(final T entity) {
		em.persist(entity);
	}

	public void remove(final T entity) {
		em.remove(em.merge(entity));
	}	
}
