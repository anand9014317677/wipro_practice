package com.configurationstyle;




import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class App 
{
	public static void main( String[] args ) {
    	// you have to first connect or call spring contatiner
		
	/* Annotation based config where we have called AnnotationBasedConfig.class in AnnotationConfigApplicationContext> */		
		
		AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AnnotationBasedConfig.class);
		
	// ask the container or spring to get the delegate bean  or object
		System.out.println("***********Annotation Based Configuration***********");
				DelegateAnnotationBased delegate = context.getBean(DelegateAnnotationBased.class);
			
				delegate.notifyUser();
				context.close();
		
		
		
	/* In XML based config style where we have called applicationContext.xml file in ClassPathXmlApplicationContext> */
    	
		
		ApplicationContext context1 = new ClassPathXmlApplicationContext("applicationContext.xml");
		
	// ask the container or spring to get the delegate bean  or object
		
		System.out.println("***********XML Based Configuration***********");
		   	DelegateXmlBased delegate1 = context1.getBean("delegate" , DelegateXmlBased.class);			
		    	delegate1.notifyUser();
		    	
		    	//shut down the container 
		    	((ClassPathXmlApplicationContext)context1).close();
		
		
		
		/* Java  based config where we have called JavaConfig.class in AnnotationConfigApplicationContext> */

		 AnnotationConfigApplicationContext context2 = new AnnotationConfigApplicationContext(JavaConfig.class);

	// ask the container or spring to get the delegate bean  or object
				
		 System.out.println("***********Java Based Configuration***********");
				DelegateJavaBasedConfig delegate2 = context2.getBean("delegate" , DelegateJavaBasedConfig.class);	
		    	delegate2.notifyUser();
		    	context2.close();
    	
    }
}