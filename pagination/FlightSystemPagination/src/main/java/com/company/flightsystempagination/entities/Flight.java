package com.company.flightsystempagination.entities;



import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Flight {

    @Id
    private Integer flightNumber;

    private String flightName;

    private String arrival;

    private String departure;

    private String journey;
}