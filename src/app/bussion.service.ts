import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {
  connectorResponse,
  connectorTaskResponse,
  dataStoreResponse,
  dataflowResponse,
  generalResponse,
  nodeResponse,
  serverResponse,
} from './entities/customEntities';

@Injectable({
  providedIn: 'root',
})
export class BussionService {
  constructor(private http: HttpClient) { }

  bussionServers: BehaviorSubject<serverResponse[]> = new BehaviorSubject<
    serverResponse[]
  >([]);
  bussionConnectors: BehaviorSubject<connectorResponse[]> = new BehaviorSubject<
    connectorResponse[]
  >([]);
  bussionDataNodes: BehaviorSubject<nodeResponse[]> = new BehaviorSubject<
    nodeResponse[]
  >([]);
  connectorTasks: BehaviorSubject<connectorTaskResponse[]> =
    new BehaviorSubject<connectorTaskResponse[]>([]);
  dataStores: BehaviorSubject<dataStoreResponse[]> = new BehaviorSubject<
    dataStoreResponse[]
  >([]);
  dataFlows: BehaviorSubject<dataflowResponse[]> = new BehaviorSubject<
    dataflowResponse[]
  >([]);

  apis = [
    'GetBussionServers',
    'BussionConnectors',
    'BussionDataNodes',
    'ConnectorTasks',
    'DataStores',
    'DataFlows',
  ];

  Endpoints = {
    dataops: 'http://demo.bussion.com/api/V3/Arctitecture/',
    token: '83174568146567311316',
  };

  refreshData(): Observable<generalResponse> {
    const body = {
      Token: this.Endpoints.token,
      Operation: 'read',
      Encrypted: '1951',
    };
    return this.http.post(this.Endpoints.dataops + 'RefreshData', body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  GetBussionServers(): Observable<generalResponse> {
    const body = {
      Token: this.Endpoints.token,
      Operation: 'read',
      Encrypted: '1951',
    };
    return this.http
      .post(this.Endpoints.dataops + 'GetBussionServers', body)
      .pipe(
        map((response: any) => {
          //this.bussionServers.next(response.message);
          return response;
        })
      );
  }

  GetBussionDataNodes(): Observable<generalResponse> {
    const body = {
      Token: this.Endpoints.token,
      Operation: 'read',
      Encrypted: '1951',
    };
    return this.http
      .post(this.Endpoints.dataops + 'BussionDataNodes', body)
      .pipe(
        map((response: any) => {
          //this.bussionDataNodes.next(response.message);
          return response;
        })
      );
  }

  GetConnectorTasks(): Observable<generalResponse> {
    const body = {
      Token: this.Endpoints.token,
      Operation: 'read',
      Encrypted: '1951',
    };
    return this.http.post(this.Endpoints.dataops + 'ConnectorTasks', body).pipe(
      map((response: any) => {
        //this.connectorTasks.next(response.message);
        return response;
      })
    );
  }

  GetDataStores(): Observable<generalResponse> {
    const body = {
      Token: this.Endpoints.token,
      Operation: 'read',
      Encrypted: '1951',
    };
    return this.http.post(this.Endpoints.dataops + 'DataStores', body).pipe(
      map((response: any) => {
        //this.dataStores.next(response.message);
        return response;
      })
    );
  }

  GetBussionConnectors(): Observable<generalResponse> {
    const body = {
      Token: this.Endpoints.token,
      Operation: 'read',
      Encrypted: '1951',
    };
    return this.http
      .post(this.Endpoints.dataops + 'BussionConnectors', body)
      .pipe(
        map((response: any) => {
          //this.bussionConnectors.next(response.message);
          return response;
        })
      );
  }

  GetDataFlows(): Observable<generalResponse> {
    const body = {
      Token: this.Endpoints.token,
      Operation: 'read',
      Encrypted: '1951',
    };
    return this.http.post(this.Endpoints.dataops + 'DataFlows', body).pipe(
      map((response: any) => {
        //this.dataFlows.next(response.message);
        return response;
      })
    );
  }
}
