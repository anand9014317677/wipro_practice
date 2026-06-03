package com.company.aop;


import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class TransactionAop {

    @Pointcut("@annotation(com.company.myannotation.MyAnno)")
    public void pointCutExp2() {
    }

    @Before("pointCutExp2()")
    public void BeginTxn() {

        System.out.println("Transaction Started");
    }

    @After("pointCutExp2()")
    public void sendReport() {

        System.out.println("Transaction Report Shared");
    }

    @AfterReturning("pointCutExp2()")
    public void CommitTxn() {

        System.out.println("Transaction Committed");
    }

    @AfterThrowing(value = "pointCutExp2()", throwing = "th")
    public void rollBackTxn(Throwable th) {

        System.out.println("Transaction Rolled Back " + th.getMessage());
    }
}