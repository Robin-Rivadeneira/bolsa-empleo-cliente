import {Postulante} from './../models/postulante';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PostulanteService {
  postulante: Postulante;
  headers: HttpHeaders;

  constructor(
    public _http: HttpClient
  ) {
  }


  validateAppliedPostulant(userId: number, professionalId: number) {
    const url = environment.apiUrl + 'postulants/validateAppliedPostulant?user_id=' + userId + '&professional_id=' + professionalId;
    return this._http.get(url);
  }

  getAllProfessionals() {
    const url = environment.apiUrl + 'professionals';
    return this._http.get(url);
  }

  getPostulants(actual_page: number, records_per_page: number) {
    const url = environment.apiUrl + 'postulants?limit=' + records_per_page + '&page=' + actual_page + '&field=id&order=DESC';
    return this._http.get(url);
  }

  filterPostulants(data: any, actual_page: number, records_per_page: number) {
    const url = environment.apiUrl + 'postulants/filter?limit=' + records_per_page + '&page=' + actual_page + '&field=id&order=DESC';
    console.log(JSON.stringify(data));
    return this._http.post(url, JSON.stringify(data));
  }

  filterPostulantsField(filter: string, actual_page: number, records_per_page: number) {
    const url = environment.apiUrl + 'postulants/filter?limit=' + records_per_page + '&page=' + actual_page + '&field=id&order=DESC&filter='
      + filter;
    return this._http.get(url);
  }

  getTotalProfessionals() {
    const url = environment.apiUrl + 'totalProfessionals';
    return this._http.get(url);
  }

  getAppliedOffers(actual_page: number, records_per_page: number, user_id: number, api_token: string) {
    const url = environment.apiUrl + 'professionals/offers?limit=' + records_per_page + '&page=' + actual_page
      + '&field=id&order=ASC&user_id=' + user_id;
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.get(url, {headers: this.headers});
  }

  getAppliedCompanies(actual_page: number, records_per_page: number, user_id: number, api_token: string) {
    const url = environment.apiUrl + 'professionals/companies?limit=' + records_per_page + '&page=' + actual_page
      + '&field=id&order=ASC&user_id=' + user_id;
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.get(url, {headers: this.headers});
  }

  getAbilities(actual_page: number, records_per_page: number, id: number, api_token: string) {
    const url = environment.apiUrl + 'abilities?limit=' + records_per_page + '&page=' + actual_page
      + '&field=id&order=ASC&user_id=' + id;
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.get(url, {headers: this.headers});
  }

  getAcademicFormations(actual_page: number, records_per_page: number, id: number, api_token: string) {
    const url = environment.apiUrl + 'academicFormations?limit=' + records_per_page + '&page=' + actual_page
      + '&field=id&order=ASC&user_id=' + id;
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.get(url, {headers: this.headers});
  }

  getCourses(actual_page: number, records_per_page: number, id: number, api_token: string) {
    const url = environment.apiUrl + 'courses?limit=' + records_per_page + '&page=' + actual_page
      + '&field=id&order=ASC&user_id=' + id;
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.get(url, {headers: this.headers});
  }

  getLanguages(actual_page: number, records_per_page: number, id: number, api_token: string) {
    const url = environment.apiUrl + 'languages?limit=' + records_per_page + '&page=' + actual_page
      + '&field=id&order=ASC&user_id=' + id;
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.get(url, {headers: this.headers});
  }

  getProfessionalReferences(actual_page: number, records_per_page: number, id: number, api_token: string) {
    const url = environment.apiUrl + 'professionalReferences?limit=' + records_per_page + '&page=' + actual_page
      + '&field=id&order=ASC&user_id=' + id;
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.get(url, {headers: this.headers});
  }

  getProfessionalExperiences(actual_page: number, records_per_page: number, id: number, api_token: string) {
    const url = environment.apiUrl + 'professionalExperiences?limit=' + records_per_page + '&page=' + actual_page
      + '&field=id&order=ASC&user_id=' + id;
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.get(url, {headers: this.headers});
  }

  getProfessional(id, api_token) {
    const url = environment.apiUrl + 'professionals/' + id;
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.get(url, {headers: this.headers});
  }
}
