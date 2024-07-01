package org.sid.services;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.sid.dao.ProcedureRepository;
import org.sid.dao.planRepository;
import org.sid.entites.ProcedurePaa;
import org.sid.entites.plan_anuell_achat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProcedurePaaService {

    @Autowired
    private ProcedureRepository repository;

    @Autowired
    private ReportService reportService;

    @Autowired
    private planRepository plan;

    public List<ProcedurePaa> findAll() {
        return repository.findAll();
    }

    public Optional<ProcedurePaa> findById(Integer id) {
        return repository.findById(id);
    }

    public ProcedurePaa save(ProcedurePaa procedurePaa) {
        return repository.save(procedurePaa);
    }

    public void deleteById(Integer id) {
        repository.deleteById(id);
    }

    public ProcedurePaa createProcedure(ProcedurePaa procedurePaa, MultipartFile file) {
        plan_anuell_achat paa = plan.findById(procedurePaa.getPaa().getId())
                .orElseThrow(() -> new IllegalArgumentException("Paa not found"));

        paa.setMontantRestant(paa.getMntEstimatif() - procedurePaa.getMontant());
        ProcedurePaa savedProcedure = repository.save(procedurePaa);
        try {
            String directoryPath = "C:\\Users\\JELIL\\Desktop\\stage_project\\uploads\\procedures\\besoins";
            Path directory = Paths.get(directoryPath);

            // Check if the directory exists, if not, create it
            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
            }

            String fileName = file.getOriginalFilename();
            Path filePath = directory.resolve(savedProcedure.getId() + "_" + fileName);
            Files.copy(file.getInputStream(), filePath);

            byte[] report = reportService.generateProcedureReport(savedProcedure);
            String reportPath = "C:\\Users\\JELIL\\Desktop\\stage_project\\uploads\\procedures\\report_" + savedProcedure.getId() + ".pdf";
            Files.write(Paths.get(reportPath), report);

            savedProcedure.setPathInitialProcedure(reportPath);
            savedProcedure.setPathBesoin(filePath.toString());
            repository.save(savedProcedure);
            plan.save(paa);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return savedProcedure;
    }

    public ProcedurePaa updateProcedure(Integer id, ProcedurePaa procedurePaa, MultipartFile file) {
        Optional<ProcedurePaa> existingProcedureOpt = repository.findById(id);
        if (existingProcedureOpt.isPresent()) {
            ProcedurePaa existingProcedure = existingProcedureOpt.get();
            existingProcedure.setDeadlineEstime(procedurePaa.getDeadlineEstime());
            existingProcedure.setDescription(procedurePaa.getDescription());
            existingProcedure.setDestinataire(procedurePaa.getDestinataire());
            existingProcedure.setMontant(procedurePaa.getMontant());
            existingProcedure.setOrigin(procedurePaa.getOrigin());
            existingProcedure.setSourceFinanciere(procedurePaa.getSourceFinanciere());
            existingProcedure.setPaa(procedurePaa.getPaa());

            if (file != null && !file.isEmpty()) {
                try {
                    String directoryPath = "C:\\Users\\lapto\\Desktop\\stage_project_old\\uploads\\procedures\\besoins";
                    Path directory = Paths.get(directoryPath);

                    if (!Files.exists(directory)) {
                        Files.createDirectories(directory);
                    }

                    String fileName = file.getOriginalFilename();
                    Path filePath = directory.resolve(existingProcedure.getId() + "_" + fileName);
                    Files.copy(file.getInputStream(), filePath);

                    byte[] report = reportService.generateProcedureReport(existingProcedure);
                    String reportPath = "C:\\Users\\lapto\\Desktop\\stage_project_old\\uploads\\procedures\\report_" + existingProcedure.getId() + ".pdf";
                    Files.write(Paths.get(reportPath), report);

                    existingProcedure.setPathInitialProcedure(reportPath);
                    existingProcedure.setPathBesoin(filePath.toString());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            repository.save(existingProcedure);
            return existingProcedure;
        } else {
            throw new IllegalArgumentException("Procedure not found");
        }
    }
}
