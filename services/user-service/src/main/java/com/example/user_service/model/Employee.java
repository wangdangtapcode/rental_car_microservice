package com.example.user_service.model;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employees") // Tên bảng trong DB
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    private Long id;

    private String position;

    @OneToOne(cascade = CascadeType.ALL)
    @MapsId
    @JoinColumn(name = "id")
    private User user;
}