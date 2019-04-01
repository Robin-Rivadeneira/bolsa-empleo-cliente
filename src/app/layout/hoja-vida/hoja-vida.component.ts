import {Component, OnInit} from '@angular/core';
import {PostulanteService} from '../../services/postulante.service';
import swal from 'sweetalert2';
import {catalogos} from '../../../environments/catalogos';

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

  }


}
