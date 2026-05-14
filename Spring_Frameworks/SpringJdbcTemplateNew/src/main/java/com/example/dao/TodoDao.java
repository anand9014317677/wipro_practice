package com.example.dao;


import java.util.List;

import com.example.beans.Todo;

public interface TodoDao {

    int saveTodo(Todo todo);

    int updateTodo(Todo todo);

    int deleteTodo(int id);

    Todo getTodo(int id);

    List<Todo> getAllTodos();
}