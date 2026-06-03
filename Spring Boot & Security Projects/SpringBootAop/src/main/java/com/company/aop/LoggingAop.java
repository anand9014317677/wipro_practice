package com.company.aop;



import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class LoggingAop {

    public Logger logger = LoggerFactory.getLogger(LoggingAop.class);

    @Pointcut("@annotation(com.company.myannotation.MyAnno)")
    public void pointCutExp3() {
    }

    @Before("pointCutExp3()")
    public void BeginTxn() {

        logger.info("Transaction support Started");
    }

    @After("pointCutExp3()")
    public void sendReport() {

        logger.debug("Transaction committed");
    }

    @AfterReturning("pointCutExp3()")
    public void CommitTxn() {

        logger.info("Transaction committed");
    }

    @AfterThrowing(value = "pointCutExp3()", throwing = "th")
    public void rollBackTxn(Throwable th) {

        logger.error("Transaction Rolled Back " + th.getMessage());
    }
}