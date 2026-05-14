package com.example;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.


import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import com.example.beans.Todo;
import com.example.config.JdbcConfig;
import com.example.dao.TodoDao;
import com.example.dao.TodoDaoImpl;

public class App {

    public static void main(String[] args) {

        ApplicationContext context =
                new AnnotationConfigApplicationContext(
                        JdbcConfig.class);

        TodoDao dao =
                context.getBean(TodoDaoImpl.class);

        Todo todo1 =
                new Todo(1,
                        "task1",
                        "learn java");

        Todo todo2 =
                new Todo(2,
                        "task2",
                        "learn spring");

        Todo todo3 =
                new Todo(3,
                        "task3",
                        "learn jdbc");

        dao.saveTodo(todo1);
        dao.saveTodo(todo2);
        dao.saveTodo(todo3);

        List<Todo> todos =
                dao.getAllTodos();

        for (Todo t : todos) {

            System.out.println(t);
        }
    }
}