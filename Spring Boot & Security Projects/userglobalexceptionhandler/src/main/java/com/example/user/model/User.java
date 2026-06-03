package com.example.user.model;



import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class User {

    private int id;

    @Min(value = 18, message = "Age should be greater than 18")
    private int age;

    @NotBlank(message = "Aadhar number should not be empty")
    @Pattern(regexp = "\\d{12}", message = "Aadhar number must be 12 digits")
    private String aadharNo;

    @NotBlank(message = "PAN number should not be empty")
    @Pattern(regexp = "[A-Z]{5}[0-9]{4}[A-Z]{1}", message = "Invalid PAN Number")
    private String panNo;

    public User() {
    }

    public User(int id, int age, String aadharNo, String panNo) {
        this.id = id;
        this.age = age;
        this.aadharNo = aadharNo;
        this.panNo = panNo;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getAadharNo() {
        return aadharNo;
    }

    public void setAadharNo(String aadharNo) {
        this.aadharNo = aadharNo;
    }

    public String getPanNo() {
        return panNo;
    }

    public void setPanNo(String panNo) {
        this.panNo = panNo;
    }
}