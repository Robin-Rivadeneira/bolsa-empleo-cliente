import {Postulante} from './../../models/postulante';
import {Component, OnInit} from '@angular/core';
import {PostulanteService} from '../../services/postulante.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-hoja-vida',
  templateUrl: './hoja-vida.component.html',
  styleUrls: ['./hoja-vida.component.css']
})
export class HojaVidaComponent implements OnInit {
  postulantes = [];

  constructor(private postulanteService: PostulanteService) {
  }

  ngOnInit() {

    this.validarEstudiosRealizados();
  }

  guardarCambios() {

  }

  validarEstudiosRealizados() {
    if (this.postulanteService.postulante.estudiosRealizados == null) {
      swal({
        title: 'Por favor complete sus datos',
        text: 'Mientras no actualice su información no aparecerá en Profesionales!',
        type: 'warning'
      });
    }
  }
}
