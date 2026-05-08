package com.lifecyclescope;




import org.springframework.context.annotation.AnnotationConfigApplicationContext;

/**
 * Hello world!
 *
 */
public class App 
{
    public static void main( String[] args )
    {
    	// you have to first connect or call spring contatiner
		
    			AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
    			
    			// ask the container or spring to get the delegate bean  or object
    			Delegate delegate = context.getBean(Delegate.class);
    			
//  			System.out.println(delegate.hashCode());
//    			Delegate delegate1 = context.getBean(Delegate.class);
//    			System.out.println(delegate1.hashCode());
    			delegate.notifyUser();
    			context.close();
    }
}