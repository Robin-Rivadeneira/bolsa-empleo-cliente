import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  headers: HttpHeaders;

  constructor(public _http: HttpClient) {

  }

  insertar(data: any){
    const url = 'http://localhost:8089/users';
    return this._http.post(url, data);
  }

  actualizar(data: any){
    const url = 'http://localhost:8089/users';
    return this._http.put(url, data);
  }

  consultar(){
    const url = 'http://localhost:8089/users';
    return this._http.get(url);
  }

  eliminar(data: any){
    const url = 'http://localhost:8089/users';
    return this._http.delete(url);
  }
  updatePassword(data: any, api_token: string) {
    const url = environment.apiUrl + 'users/password';
    console.log(data);
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.put(url, JSON.stringify(data), {headers: this.headers});
  }

  recoverPassword(data: any, api_token: string) {
    const url = environment.apiUrl + 'users/password';
    console.log(data);
    this.headers = new HttpHeaders().set('Api-Token', api_token);
    return this._http.put(url, JSON.stringify(data), {headers: this.headers});
  }
}
