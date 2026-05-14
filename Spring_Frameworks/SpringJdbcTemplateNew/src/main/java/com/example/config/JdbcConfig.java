package com.example.config;



import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

@Configuration
@ComponentScan("com.example.dao")
public class JdbcConfig {

    @Bean
    public DataSource getDataSource() {

        DriverManagerDataSource dataSource =
                new DriverManagerDataSource();

        dataSource.setDriverClassName(
                "com.mysql.cj.jdbc.Driver");

        dataSource.setUrl(
                "jdbc:mysql://localhost:3306/wipro_training");

        dataSource.setUsername("root");

        dataSource.setPassword("1234");

        return dataSource;
    }

    @Bean
    public JdbcTemplate getJdbcTemplate() {

        JdbcTemplate jdbcTemplate =
                new JdbcTemplate();

        jdbcTemplate.setDataSource(
                getDataSource());

        return jdbcTemplate;
    }
}