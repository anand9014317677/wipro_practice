package com.smartpizza.entity;

/**
 * User roles supported by the platform. Stored as a string in the DB
 * and mapped to a Spring Security authority "ROLE_<NAME>".
 */
public enum Role {
    CUSTOMER,
    ADMIN,
    DELIVERY
}
