import { Component, OnInit } from '@angular/core';
import { Etudiant } from '../model/etudiant.model';
import { EtudiantService } from '../services/etudiant.service';
import { AuthService } from '../services/auth.service';
import { Image } from '../model/image.model';


@Component({
  selector: 'app-etudiants',
  templateUrl: './etudiants.component.html'
})
export class EtudiantsComponent implements OnInit {

 etudiants: Etudiant[];
  constructor(private etudiantService : EtudiantService , public authService: AuthService) { 
   this.etudiants=[];
  }

  ngOnInit(): void {
      this.chargerEtudiants();
  }

  chargerEtudiants(){
    this.etudiantService.listeEtudiant().subscribe(etuds => {
    //console.log(etuds);
    this.etudiants = etuds;
    this.etudiants.forEach((etud) => {
    this.etudiantService.loadImage(etud.image.idImage).subscribe((img: Image) => {
    etud.imageStr = 'data:' + img.type + ';base64,' + img.image;
      });
      }); 
    }); 
    }
    supprimerEtudiant(e: Etudiant)
    {
    let conf = confirm("Etes-vous sûr ?");
    if (conf)
    this.etudiantService.supprimerEtudiant(e.idEtudiant).subscribe(() => {
    //console.log("produit supprimé");
    this.chargerEtudiants();
    });
    }

  // supprimerEtudiant(e : Etudiant) {
  //   //console.log(e);
  //   let conf = confirm("Etes-vous sûr ?");
  //   if (conf)

  //   this.etudiantService.supprimerEtudiant(e);

  //   }

}
