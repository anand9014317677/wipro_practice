/*package com.company.hibernateorm.dao;

import com.company.hibernateorm.config.HibernateUtil;
import com.company.hibernateorm.entity.Product;
import org.hibernate.Session;

import java.util.List;

public class ProductDao {



    public List<Product> getAllProducts() {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {

            // Here you need not to give a table name because HQL runs on Entity class object
            //HQL Query Example
            String hql = "from  Product";
            return (session.createQuery(hql, Product.class).list());

        }
    }

    public List<Product> getByPrice(double price) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()){

            // Here you need not to give a table name because HQL runs on Entity class object
            //HQL Query Example
            String hql = "from  Product p where p.price=:price";
            return (session.createQuery(hql, Product.class)
                    .setParameter("price", price)
                    .list());
        }
    }

    public List<Product> searchByKeyword(String Keyword) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            return session.createQuery("From Product p where p.name like:key", Product.class)
                    .setParameter("key", "%" + Keyword + "%")
                    .list();
        }
    }

} */

package com.company.hibernateorm.dao;

import com.company.hibernateorm.config.HibernateUtil;
import com.company.hibernateorm.entity.Product;
import org.hibernate.Session;

import java.util.List;

public class ProductDao {

    // Scalar Query
    public List<Object[]> findAll() {

        try (Session session =
                     HibernateUtil.getSessionFactory().openSession()) {

            String sql = "select * from products";

            return session.createNativeQuery(sql).list();
        }
    }

    // Entity Query
    public List<Product> getAll() {

        try (Session session =
                     HibernateUtil.getSessionFactory().openSession()) {

            String sql = "select * from products";

            return session.createNativeQuery(sql, Product.class).list();
        }
    }

    // Parameterized Query
    public List<Product> getById(int id) {

        try (Session session =
                     HibernateUtil.getSessionFactory().openSession()) {

            String sql = "select * from products where id=:id";

            return session.createNativeQuery(sql, Product.class)
                    .setParameter("id", id)
                    .list();
        }
    }
}