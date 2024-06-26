package org.sid.entites;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Entity
@Data
@Table(name = "etablissement")

public class Etablissement {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "fourDigitIdGenerator")
    @GenericGenerator(name = "fourDigitIdGenerator", strategy = "org.sid.entites.FourDigitIdGenerator")
    private Integer id;

    private String nom;
    private String adresse;

   


    // @OneToMany(mappedBy = "etablissement", cascade = CascadeType.ALL)
    // private List<plan_anuell_achat> paa;

    // @OneToMany(mappedBy = "etablissement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // private List<InputBudgetaire> inputBudgetaires;
    // Ajoute d'autres attributs selon tes besoins

    // Constructeurs, getters et setters
}
