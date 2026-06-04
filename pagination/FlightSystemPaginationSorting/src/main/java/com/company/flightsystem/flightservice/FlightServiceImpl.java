package com.company.flightsystem.flightservice;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.company.flightsystem.entities.Flight;
import com.company.flightsystem.flightrepository.FlightRepository;

@Service
public class FlightServiceImpl implements FlightService {

    @Autowired
    private FlightRepository flightRepository;

    @Override
    public Flight addFlightDetails(Flight flight) {
        Flight flightSaved = flightRepository.save(flight);
        System.out.println("Flight details are saved");
        return flightSaved;
    }

    @Override
    public Flight updateFlightDetails(Integer flightNumber, Flight flight) {
        if (flightRepository.existsById(flightNumber)) {
            flight.setFlightNumber(flightNumber);
            return flightRepository.save(flight);
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
        if (flightRepository.existsById(flightNumber)) {
            flightRepository.deleteById(flightNumber);
            return "Flight details deleted successfully";
        }
        return "Flight details could not be deleted";
    }

    @Override
    public Page<Flight> getAllFlights(Pageable pageable) {
        return flightRepository.findAll(pageable);
    }
}
