package org.sid.web;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sid.dao.AppUserRepository;
import org.sid.dao.InputBudgetaireRepository;
import org.sid.dao.planRepository;
import org.sid.entites.AppUser;
import org.sid.entites.InputBudgetaire;
import org.sid.entites.plan_anuell_achat;
import org.sid.entites.DTO.PaaFormProcedure;
import org.sid.services.PaaService;
import org.sid.services.PaaServiceImpl;
import org.sid.services.ServiceReport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.node.ArrayNode;

import net.sf.jasperreports.engine.JRException;

@RestController
@RequestMapping(value = "/api/rest/Paa", produces = MediaType.APPLICATION_JSON_VALUE)

public class PaaController {

    private static final Logger logger = LoggerFactory.getLogger(PaaController.class);

    @Autowired
    PaaService paaService;

    @Autowired
    PaaServiceImpl service;

    @Autowired
    private InputBudgetaireRepository input;

    @Autowired
    AppUserRepository userRepo;

    @Autowired
    private planRepository repo;

    @Autowired
    ServiceReport report;

    @CrossOrigin(origins = "*")
    @GetMapping(value = "/getAllPaaa", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<plan_anuell_achat> getAllPaaa() {
        return service.getAllPaa();
    }

    @CrossOrigin(origins = "*")
    @GetMapping(value = "/getPaaa/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Optional<plan_anuell_achat> getPaaa(@PathVariable Integer id) {
        return service.getPaa(id);
    }

    @CrossOrigin(origins = "*")
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<plan_anuell_achat>> getPlansByEtablissementId(@PathVariable Integer id) {
        List<plan_anuell_achat> plans = service.getPlansByEtablissementId(id);
        return ResponseEntity.ok(plans);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        logger.info("File received: " + file.getOriginalFilename());
        try {
            service.saveExcelData(file);
            return new ResponseEntity<>("File uploaded and data saved successfully.", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error uploading file: ", e);
            return new ResponseEntity<>("Failed to upload file and save data: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/test")
    public String test() {
        return "hello";
    }

    // @GetMapping("/listPaa")
    // public ArrayNode getListDocs() {
    // return service.getListPaa();
    // }

    @CrossOrigin(origins = "*")
    @PostMapping("/updatePaa")
    public plan_anuell_achat updatePaa(@RequestBody PaaFormProcedure data) {
        System.out.println("**********************************" + data);
        return paaService.updatePaa(data.getId(), data.getOrigine(), data.getDestinataire());
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/modifier/{id}")
    public plan_anuell_achat modifierPaa(@PathVariable Integer id, @RequestBody PaaFormProcedure data) {
        System.out.println("**********************************" + data);
        return service.modifierPaa(id, data);
    }

    @CrossOrigin(origins = "*")
    @GetMapping(value = "/report/{id}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity generateReport(@PathVariable Integer id) throws IOException, JRException {
        return report.exportReport(id);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/addPaa")
    public plan_anuell_achat addPaa(@RequestBody PaaFormProcedure data) {
        // plan_anuell_achat newPaa = paaService.addPaa(data);
        // return ResponseEntity.ok(newPaa);

        InputBudgetaire inputBudgetaire = input.findByBudgetNumber(data.getInpuBudgetaire());

        // AppUser user = userRepo.getUser(data.getUserId());

        if (inputBudgetaire != null) {

            plan_anuell_achat newPaa = new plan_anuell_achat();
            newPaa.setObjetDepense(data.getObjetDepense());
            newPaa.setInpuBudgetaire(data.getInpuBudgetaire());
            newPaa.setFkidTypeMarche(inputBudgetaire.getTypeMarcher().getId());
            newPaa.setFkidModPassation(inputBudgetaire.getTypeSelection().getId());
            newPaa.setEtablissement(inputBudgetaire.getEtablissement());
            newPaa.setMntEstimatif(data.getMntEstimatif());
            newPaa.setDatePreviLancement(data.getDatePreviLancement());
            newPaa.setDatePreviAttribution(data.getDatePreviAttribution());
            newPaa.setMontantRestant(data.getMntEstimatif());
            // newPaa.setUser(user);
            return repo.save(newPaa);
        }
        return null;

        // return userRepo.getUser(data.getUserId());
    }

    @PutMapping("valider/{id}")
    public plan_anuell_achat validerPaa(@PathVariable Integer id) {

        return service.validatePlanAnuellAchat(id);
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/deletePaa/{id}")
    public ResponseEntity<String> deletePaa(@PathVariable Integer id) {
        paaService.deletePaa(id);
        return ResponseEntity.ok("PAA deleted successfully");
    }

}
