import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";
import { EnvironmentsService } from "../utility/environments.service";
import { RestApiService } from "./rest-api.service";

@Injectable({providedIn: 'root'})
export class AuthApiService extends RestApiService  {
  get api(): string {
    return this._env.apiUrl;
  }

  constructor(
    protected override _http: HttpClient,
    private _env: EnvironmentsService
  ) {
    super(_http);
  }

  public callback(route: string, payload: any): Observable<any> {
    return this.post<any>(route, payload).pipe(catchError(_ => of(null)));
  }
}
