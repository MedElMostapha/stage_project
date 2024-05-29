package org.sid.dao;

import org.sid.entites.AppUser;
import org.sid.entites.DTO.DossierDTO;
import org.sid.entites.DTO.DossierFileDTO;
import org.sid.entites.DTO.LettreReportDTO;
import org.sid.entites.DTO.PaaProcedure;
import org.sid.entites.Dossier;
import org.sid.entites.Lettre;
import org.sid.entites.plan_anuell_achat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@RepositoryRestResource
public interface DossierRepository extends JpaRepository<Dossier, Integer> {


    @Query(value = "select d from Dossier d where d.id=?1")
    Dossier getDossier(Integer id);

    @Query(value = "select new org.sid.entites.DTO.DossierFileDTO(d.id,d.reference,d.idPaa,d.LettreCree,p.objetDepense,p.inpuBudgetaire,f.idElm,f.name,f.fileNameOnDisc,f.fileSubFolder)  from Dossier d inner join FileDB f on d.id = f.idElm inner join plan_anuell_achat p on d.idPaa=p.id  where d.fkIduser=4 and f.fkIdTbl = 2")
    List<DossierFileDTO> getDossiers();

    @Modifying
    @Transactional
    @Query(value = "update Dossier set LettreCree=?1 where id=?2")
    void updateDossier(Boolean dosssierCree, Integer id);

    @Query(value = "select new org.sid.entites.DTO.LettreReportDTO(l.id,l.nomFournissuer,l.nonAutoriteContractante,l.dateLimiteDepot," +
            "l.lieuOverturePlis,d.reference,p.objetDepense) " +
            "from Lettre l inner join Dossier d ON l.idDossier=d.id  inner join plan_anuell_achat p ON d.idPaa=p.id where l.id=?1")
    List<LettreReportDTO> getLettreReport(Integer id);

    @Query(value = "select l from Lettre  l where l.idDossier=?1")
    List<Lettre> getLettres(Integer id);

    //@Query(value = "SELECT l.* FROM lettre l JOIN dossier d ON l.id_dossier=d.id WHERE l.id not IN(SELECT l.id FROM lettre l JOIN plis p on l.id=p.id_lettre) AND d.id=?1",nativeQuery = true)
    @Query(value = "SELECT l FROM Lettre l JOIN Dossier d ON l.idDossier=d.id WHERE l.id not IN(SELECT l.id FROM Lettre l JOIN Plis p on l.id=p.idLettre) AND d.id=?1")
    List<Lettre> LettresNotInPlis(Integer id);

}
