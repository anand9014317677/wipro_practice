package com.example.repo;

import com.example.beans.Userr;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<Userr,Integer> {
}
