/* package com.company.hibernateorm;

import com.company.hibernateorm.config.HibernateUtil;
import com.company.hibernateorm.dao.ProductDao;
import com.company.hibernateorm.entity.Category;
import com.company.hibernateorm.entity.Product;
import org.hibernate.Session;
import org.hibernate.Transaction;

/**
 * Hello world!
 *
 */
/* public class App
{
    public static void main( String[] args )
    {
        try(Session session = HibernateUtil.getSessionFactory().openSession())
        {

            Transaction tx = session.beginTransaction();

//            Category category1 = new Category("Electronics");
//            Category category2 = new Category("Stationary");
//            Category category3 = new Category("PoojaItems");
//
//            session.save(category1);
//            session.save(category2);
//            session.save(category3);
//
//            session.save(new Product("Laptop",50000 ,category1 ));
//            session.save(new Product("Tablet",50000 ,category1 ));
//            session.save(new Product("Mouse",50000 ,category1 ));
//
//            session.save(new Product("Book",150 ,category2 ));
//            session.save(new Product("Pencil",10 ,category2 ));
//            session.save(new Product("Pen",150 ,category2 ));

            ProductDao dao = new ProductDao();

            System.out.println("1. To list out all the products");
            //System.out.println(dao.getAllProducts());
            //  dao.getAllProducts().forEach(System.out::println);
            dao.getAllProducts().forEach(p->System.out.println(p.getName()));

            System.out.println("1. To list out all the products based on Price");
            //System.out.println(dao.getByPrice(50000));
            dao.getByPrice(50000).forEach(System.out::println);


            System.out.println("1. To list out all the products based on SearchByKeyword");
            // System.out.println(dao.searchByKeyword("Lap"));
            dao.searchByKeyword("Lap").forEach(System.out::println);
            tx.commit();
        }



    }
} */
package com.company.hibernateorm;

import com.company.hibernateorm.config.HibernateUtil;
import com.company.hibernateorm.dao.ProductDao;
import org.hibernate.Session;
import org.hibernate.Transaction;

public class App {

    public static void main(String[] args) {

        try (Session session =
                     HibernateUtil.getSessionFactory().openSession()) {

            Transaction tx = session.beginTransaction();

            ProductDao dao = new ProductDao();

            System.out.println("Native SQL Based Queries");

            // Scalar Query
            System.out.println("Display Products using Object[]");

            dao.findAll().forEach(p ->
                    System.out.println(
                            p[0] + " "
                                    + p[1] + " "
                                    + p[2] + " "
                                    + p[3]
                    ));

            // Entity Query
            System.out.println("\nDisplay Products using Entity");

            dao.getAll().forEach(System.out::println);

            // Parameterized Query
            System.out.println("\nDisplay Product By ID");

            dao.getById(2).forEach(System.out::println);

            tx.commit();
        }
    }
}