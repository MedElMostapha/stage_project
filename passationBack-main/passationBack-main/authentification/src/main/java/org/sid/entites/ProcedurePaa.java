package org.sid.entites;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "PROCEDUREPAA")

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ProcedurePaa  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;
    
    private String origin;
    private String destinataire;
    private String sourceFinanciere;
    private String description;
    private LocalDate deadlineEstime;
    private double montant;

    @ManyToOne
    @JoinColumn(name = "paaid")
    private plan_anuell_achat paa;

}
