import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EtudiantService } from '../services/etudiant.service';
import { Etudiant} from '../model/etudiant.model';
import { Departement } from '../model/departement.model';
import { Image } from '../model/image.model';
@Component({
  selector: 'app-update-etudiant',
  templateUrl: './update-etudiant.component.html',
  })
export class UpdateEtudiantComponent implements OnInit {
  currentEtudiant = new Etudiant();
  departements! : Departement[];
  updatedDepId! : number;
  myImage! : string;
  uploadedImage!: File;
  isImageUpdated: Boolean=false;


  constructor(private activatedRoute: ActivatedRoute,
    private router :Router,
    private etudiantService: EtudiantService) { }

  // ngOnInit(): void {
  //   this.etudiantService.listeDepartements().subscribe(deps =>  {console.log(deps);
  //     this.departements = deps._embedded.departements;})//remplir la liste des departements
  //     this.etudiantService.consulterEtudiant(this.activatedRoute.snapshot.params['id']).subscribe( etud =>{ this.currentEtudiant = etud; 
  //       this.updatedDepId = this.currentEtudiant.departement.idDepart;} ) ; //selectionner  departement par defaut
 
  //     }
  ngOnInit(): void {
    this.etudiantService.listeDepartements().subscribe(deps => {this.departements = deps._embedded.departements;
      console.log(deps);
      });
      this.etudiantService.consulterEtudiant(this.activatedRoute.snapshot.params['id']).subscribe( etud =>{ this.currentEtudiant = etud;
      this.updatedDepId = etud.departement.idDepart;
      this.etudiantService.loadImage(this.currentEtudiant.image.idImage).subscribe((img: Image) => {
      this.myImage = 'data:' + img.type + ';base64,' + img.image;
      }); 
      } ) ;
      }
      
  updateEtudiant() {
    this.currentEtudiant.departement = this.departements.find(dep => dep.idDepart == this.updatedDepId)!;
    // this.etudiantService.updateEtudiant(this.currentEtudiant).subscribe(etud => {
    // this.router.navigate(['etudiants']); });
    if (this.isImageUpdated) {
      this.etudiantService.uploadImage(this.uploadedImage, this.uploadedImage.name).subscribe((img: Image) => {
      this.currentEtudiant.image = img;
      this.etudiantService.updateEtudiant(this.currentEtudiant).subscribe((etud) => {
      this.router.navigate(['etudiants']);
    });
    });
    }
    else {
      this.etudiantService.updateEtudiant(this.currentEtudiant).subscribe((etud) => {
      this.router.navigate(['etudiants']);
    });
    }
  }

    onImageUpload(event: any) {
      if(event.target.files && event.target.files.length) {
      this.uploadedImage = event.target.files[0];
      this.isImageUpdated =true;
      const reader = new FileReader();
      reader.readAsDataURL(this.uploadedImage);
      reader.onload = () => { this.myImage = reader.result as string; };
      }
      }
      


}
