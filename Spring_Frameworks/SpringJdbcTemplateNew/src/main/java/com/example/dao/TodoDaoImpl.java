package com.example.dao;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.beans.Todo;
import com.example.config.RowMapperImpl;

@Repository
public class TodoDaoImpl
        implements TodoDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int saveTodo(Todo todo) {

        String insertQuery =
                "insert into Todo(id,title,description) values(?,?,?)";

        return jdbcTemplate.update(
                insertQuery,
                todo.getId(),
                todo.getTitle(),
                todo.getDescription()
        );
    }

    @Override
    public int updateTodo(Todo todo) {

        String updateQuery =
                "update Todo set title=?, description=? where id=?";

        return jdbcTemplate.update(
                updateQuery,
                todo.getTitle(),
                todo.getDescription(),
                todo.getId()
        );
    }

    @Override
    public int deleteTodo(int id) {

        String deleteQuery =
                "delete from Todo where id=?";

        return jdbcTemplate.update(
                deleteQuery,
                id
        );
    }

    @Override
    public Todo getTodo(int id) {

        String selectQuery =
                "select * from Todo where id=?";

        return jdbcTemplate.queryForObject(
                selectQuery,
                new RowMapperImpl(),
                id
        );
    }

    @Override
    public List<Todo> getAllTodos() {

        String selectQuery =
                "select * from Todo";

        return jdbcTemplate.query(
                selectQuery,
                new BeanPropertyRowMapper<>(Todo.class)
        );
    }
}