package com.company.repository;



import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.company.model.User;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean findUser(String username, String password) {

        String sql = "SELECT COUNT(*) FROM USER WHERE username=? AND password=?";

        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username, password);

        return count != null && count > 0;
    }

    public boolean userExists(String username) {

        String sql = "SELECT COUNT(*) FROM USER WHERE username=?";

        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);

        return count != null && count > 0;
    }

    public int saveUser(User user) {

        String sql = "INSERT INTO USER(username,password) VALUES(?,?)";

        return jdbcTemplate.update(sql, user.getUsername(), user.getPassword());
    }
}