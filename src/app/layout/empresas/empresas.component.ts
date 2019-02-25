import {Component, OnInit, ViewChild} from '@angular/core';
import {EmpresaService} from '../../services/empresa.service';
import {OfertaService} from '../../services/oferta.service';
import {PostulanteService} from '../../services/postulante.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {
  contadorEmpresas: number;
  contadorPostulantes: number;
  contadorOfertas: number;


  constructor(
    public empresaService: EmpresaService,
    public ofertaService: OfertaService,
    public postulanteService: PostulanteService) {
  }



  ngOnInit() {

    this.contadorEmpresas = 0;
    this.contadorPostulantes = 0;
    this.contadorOfertas = 0;
    this.contarEmpresas();
    this.contarPostulantes();
    this.contarOfertas();
  }

  contarEmpresas() {
    this.empresaService.getTotalCompanies().subscribe(
      response => {
        this.contadorEmpresas = response['totalCompanies'];
      });
  }

  contarPostulantes() {
    this.postulanteService.getTotalProfessionals().subscribe(
      response => {
        this.contadorPostulantes = response['totalProfessionals'];
      });

  }

  contarOfertas() {
    this.ofertaService.getTotalOffers().subscribe(
      response => {
        this.contadorOfertas = response['totalOffers'];
      });
  }

}
