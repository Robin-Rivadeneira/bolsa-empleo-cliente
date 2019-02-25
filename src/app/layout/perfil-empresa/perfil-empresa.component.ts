import {Component, OnInit} from '@angular/core';
import {EmpresaService} from '../../services/empresa.service';
import {OfertaService} from '../../services/oferta.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './perfil-empresa.component.html',
  styleUrls: ['./perfil-empresa.component.css']
})
export class PerfilEmpresaComponent implements OnInit {
  contadorEmpresas: number;

  constructor(public empresaService: EmpresaService, public ofertaService: OfertaService) {
  }

  ngOnInit() {
    this.contadorEmpresas = 0;
  }

}
