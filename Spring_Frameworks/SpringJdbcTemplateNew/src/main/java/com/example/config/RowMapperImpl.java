package com.example.config;




import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.example.beans.Todo;

public class RowMapperImpl implements RowMapper<Todo> {

    @Override
    public Todo mapRow(ResultSet rs, int rowNum)
            throws SQLException {

        Todo todo = new Todo();

        todo.setId(rs.getInt(1));
        todo.setTitle(rs.getString(2));
        todo.setDescription(rs.getString(3));

        return todo;
    }
}