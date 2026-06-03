package com.company.controller;

import com.company.dto.StudentDTO;
import com.company.entity.Student;
import com.company.entity.Teacher;
import com.company.repo.PersonRepo;
import com.company.repo.TeacherRepo;
import com.company.service.StudentService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class DemoController {

    private final StudentService studentService;
    private final PersonRepo personRepo;
    private final TeacherRepo teacherRepo;

    public DemoController(StudentService studentService,
                          PersonRepo personRepo,
                          TeacherRepo teacherRepo) {

        this.studentService = studentService;
        this.personRepo = personRepo;
        this.teacherRepo = teacherRepo;
    }

    // add student
    @PostMapping(value = "/addStudent", consumes = "application/json")
    public String addStudent(@RequestBody Student student)
    {
        studentService.save(student);
        return "Student added";
    }

    // get students with email
    @GetMapping("/studentswithemail")
    public List<StudentDTO> students()
    {
        return studentService.findAllWithEmails()
                .stream()
                .map(s -> new StudentDTO(
                        s.getId(),
                        s.getName(),
                        s.getAddress().getCity(),
                        s.getEmails()
                                .stream()
                                .map(e -> e.getEmail())
                                .toList()
                ))
                .collect(Collectors.toList());
    }

    // get all students
    @GetMapping("/getStudents")
    public List<Student> findAllStudents()
    {
        return personRepo.findAllStudents();
    }

    // add teacher
    @PostMapping(value = "/addTeacher", consumes = "application/json")
    public String addTeacher(@RequestBody Teacher teacher)
    {
        teacherRepo.save(teacher);
        return "Teacher added";
    }

    // get teachers
    @GetMapping("/teacherswithemail")
    public List<Teacher> getTeachers()
    {
        return teacherRepo.findAll();
    }
}