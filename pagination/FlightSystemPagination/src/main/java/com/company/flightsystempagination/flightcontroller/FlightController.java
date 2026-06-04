package com.company.flightsystempagination.flightcontroller;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.company.flightsystempagination.entities.Flight;
import com.company.flightsystempagination.flightservice.FlightService;

@RestController
@RequestMapping("/flight.com")
public class FlightController {

    @Autowired
    FlightService flightService;

    @PostMapping("/addFlight")
    public Flight addFlightDetails(@RequestBody Flight flight) {

        return flightService.addFlightDetails(flight);
    }

    @PutMapping("/updateFlight/{flightNumber}")
    public Flight updateFlightDetails(
            @PathVariable Integer flightNumber,
            @RequestBody Flight flight) {

        return flightService.updateFlightDetails(flightNumber, flight);
    }

    @GetMapping("/allFlights")
    public List<Flight> getAllFlights() {

        return flightService.getAllFlightsDetails();
    }

    @GetMapping("/allFlights/{flightNumber}")
    public Flight getFlightDetailByFlightNumber(
            @PathVariable Integer flightNumber) {

        return flightService.getFlightDetails(flightNumber);
    }

    @DeleteMapping("/deleteFlight/{flightNumber}")
    public String deleteFlight(@PathVariable Integer flightNumber) {

        return flightService.deleteFlightDetails(flightNumber);
    }

    @GetMapping("/allFlightPaged")
    public ResponseEntity<Page<Flight>> getAllPagedFlights(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "5") int size,

            @RequestParam(defaultValue = "flightNumber")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String sortDirection
    ) {

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(
                                Sort.Direction.fromString(sortDirection),
                                sortBy
                        )
                );

        Page<Flight> flights =
                flightService.getAllFlights(pageable);

        return ResponseEntity.ok(flights);
    }
}
