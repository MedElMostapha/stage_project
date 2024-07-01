package org.sid.web;

import java.util.List;
import java.util.Optional;

import org.sid.entites.ProcedurePaa;
import org.sid.services.ProcedurePaaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/rest/procedure")
@CrossOrigin("*")
public class ProcedurePaaController {

    @Autowired
    private ProcedurePaaService service;

    @GetMapping(produces = "application/json")
    public List<ProcedurePaa> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProcedurePaa> getById(@PathVariable Integer id) {
        Optional<ProcedurePaa> procedurePaa = service.findById(id);
        return procedurePaa.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public ProcedurePaa create(
            @RequestPart("procedure") ProcedurePaa procedureRequest,
            @RequestPart("file") MultipartFile file) {
        return service.createProcedure(procedureRequest, file);
    }

    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<ProcedurePaa> update(
            @PathVariable Integer id,
            @RequestPart("procedure") ProcedurePaa procedureRequest,
            @RequestPart("file") MultipartFile file) {
        try {
            ProcedurePaa updatedProcedure = service.updateProcedure(id, procedureRequest, file);
            return ResponseEntity.ok(updatedProcedure);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
