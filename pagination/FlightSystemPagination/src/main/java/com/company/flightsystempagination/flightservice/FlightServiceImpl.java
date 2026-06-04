package com.company.flightsystempagination.flightservice;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.company.flightsystempagination.entities.Flight;
import com.company.flightsystempagination.flightrepository.FlightRepository;

@Service
public class FlightServiceImpl implements FlightService {

    @Autowired
    FlightRepository flightRepository;

    @Override
    public Flight addFlightDetails(Flight flight) {

        return flightRepository.save(flight);
    }

    @Override
    public Flight updateFlightDetails(Integer flightNumber, Flight flight) {

        Flight existingFlight =
                flightRepository.findById(flightNumber).orElse(null);

        if(existingFlight != null) {

            existingFlight.setFlightName(flight.getFlightName());
            existingFlight.setArrival(flight.getArrival());
            existingFlight.setDeparture(flight.getDeparture());
            existingFlight.setJourney(flight.getJourney());

            return flightRepository.save(existingFlight);
        }

        return null;
    }

    @Override
    public Flight getFlightDetails(Integer flightNumber) {

        return flightRepository.findById(flightNumber).orElse(null);
    }

    @Override
    public List<Flight> getAllFlightsDetails() {

        return flightRepository.findAll();
    }

    @Override
    public String deleteFlightDetails(Integer flightNumber) {

        Flight flight =
                flightRepository.findById(flightNumber).orElse(null);

        if(flight != null) {

            flightRepository.delete(flight);

            return "Flight deleted successfully";
        }

        return "Flight not found";
    }

    @Override
    public Page<Flight> getAllFlights(Pageable pageable) {

        return flightRepository.findAll(pageable);
    }
}
