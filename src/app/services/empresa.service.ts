import {Injectable} from '@angular/core';
import {Empresa} from '../models/empresa';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  empresa: Empresa;
  headers: HttpHeaders;

  constructor(public _http: HttpClient) {
  }

  applyPostulant(data: any, api_token: string) {
    const url = environment.apiUrl + 'postulants/apply';
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.post(url, JSON.stringify(data), {headers: this.headers});
  }

  detachPostulant(data: any, api_token: string) {
    const url = environment.apiUrl + 'postulants/detach';
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.post(url, JSON.stringify(data), {headers: this.headers});
  }

  getTotalCompanies() {
    const url = environment.apiUrl + 'totalCompanies';
    return this._http.get(url);
  }

  getCompany(id, api_token) {
    const url = environment.apiUrl + 'companies/' + id;
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.get(url, {headers: this.headers});
  }

  getAppliedProfessionals(actual_page: number, records_per_page: number, user_id: number, api_token: string) {
    const url = environment.apiUrl + 'companies/professionals?limit=' + records_per_page + '&page=' + actual_page
      + '&field=id&order=ASC&user_id=' + user_id;
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.get(url, {headers: this.headers});
  }

  updateCompany(data: any, api_token: string) {
    const url = environment.apiUrl + 'companies';
    this.headers.set('Api-Token', api_token);
    return this._http.put(url, JSON.stringify(data), {headers: this.headers});
  }

  getOffers(actual_page: number, records_per_page: number, company_id: number, api_token: string) {
    const url = environment.apiUrl + 'companies/offers?limit=' + records_per_page + '&page=' + actual_page
      + '&field=id&order=ASC&id=' + company_id;
    this.headers.set('Api-Token', api_token);
    return this._http.get(url, {headers: this.headers});
  }

  getProfessionals(actual_page: number, records_per_page: number, offer_id: number, api_token: string) {
    const url = environment.apiUrl + 'offers/professionals?limit=' + records_per_page + '&page=' + actual_page
      + '&field=id&order=ASC&offer_id=' + offer_id;
    this.headers.set('Api-Token', api_token);
    return this._http.get(url, {headers: this.headers});
  }

  createOffer(data: any, api_token: string) {
    const url = environment.apiUrl + 'companies/offers';
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.post(url, JSON.stringify(data), {headers: this.headers});
  }

  updateOffer(data: any, api_token: string) {
    const url = environment.apiUrl + 'companies/offers';
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.put(url, JSON.stringify(data), {headers: this.headers});
  }

  deleteOffer(id: number, api_token: string) {
    const url = environment.apiUrl + 'offers?id=' + id;
    this.headers.set('Api-Token', api_token);
    return this._http.delete(url, {headers: this.headers});
  }

  finishOffer(id: number, api_token: string) {
    const url = environment.apiUrl + 'offers/finish?id=' + id;
    this.headers.set('Api-Token', api_token);
    return this._http.delete(url, {headers: this.headers});
  }


}
