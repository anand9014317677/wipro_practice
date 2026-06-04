package com.company.flightsystempagination.flightrepository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.flightsystempagination.entities.Flight;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Integer> {

}
