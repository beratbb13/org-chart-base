import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { BussionService } from './app/bussion.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin, isObservable } from 'rxjs';
import OrgChart from '@balkangraph/orgchart.js';
import { filter } from 'rxjs/operators';
import {
  connectorResponse,
  connectorTaskResponse,
  dataStoreResponse,
  dataflowResponse,
  nodeResponse,
  serverResponse
} from './app/entities/customEntities'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [BussionService],
})
export class AppComponent {
  constructor(private bS: BussionService) { }

  @ViewChild('content') content!: ElementRef;

  bussionServers: serverResponse[] = [];
  bussionConnectors: connectorResponse[] = [];
  bussionDataNodes: nodeResponse[] = [];
  connectorTasks: connectorTaskResponse[] = [];
  dataStores: dataStoreResponse[] = [];
  dataFlows: dataflowResponse[] = [];

  Try(): Observable<any> {
    return this.bS.refreshData();
  }

  GetBussionServers() {
    this.bS.GetBussionServers().subscribe((res) => {
      /* this.bS.bussionServers
          .asObservable()
          .subscribe((res) => (this.bussionServers = res));*/
      if (res.result === true) {
        this.bussionServers = [{ name: res.message[0] as string }];
      }
    });
  }

  GetBussionDataNodes() {
    this.bS.GetBussionDataNodes().subscribe((res) => {
      /* this.bS.bussionDataNodes
          .asObservable()
          .subscribe((res) => (this.bussionDataNodes = res));*/
      if (res.result === true) {
        this.bussionDataNodes = res.message as nodeResponse[];
      }
    });
  }

  GetConnectorTasks() {
    this.bS.GetConnectorTasks().subscribe((res) => {
      /*this.bS.connectorTasks
          .asObservable()
          .subscribe((res) => (this.connectorTasks = res));*/
      if (res.result === true) {
        this.connectorTasks = res.message as connectorTaskResponse[];
      }
    });
  }

  GetDataStores() {
    this.bS.GetDataStores().subscribe((res) => {
      /*this.bS.dataStores
          .asObservable()
          .subscribe((res) => (this.dataStores = res));*/
      if (res.result === true) {
        this.dataStores = res.message as dataStoreResponse[];
      }
    });
  }

  GetBussionConnectors() {
    this.bS.GetBussionConnectors().subscribe((res) => {
      /* this.bS.bussionConnectors
          .asObservable()
          .subscribe((res) => (this.bussionConnectors = res));*/
      if (res.result === true) {
        this.bussionConnectors = res.message as connectorResponse[];
      }
    });
  }

  GetDataFlows() {
    this.bS.GetDataFlows().subscribe((res) => {
      /*this.bS.dataFlows
          .asObservable()
          .subscribe((res) => (this.dataFlows = res));*/
      if (res.result === true) {
        this.dataFlows = res.message as dataflowResponse[];
      }
    });
  }

  ngOnInit() {
    const observables = [
      this.Try(),
      this.GetBussionServers(),
      this.GetBussionDataNodes(),
      this.GetConnectorTasks(),
      this.GetDataStores(),
      this.GetBussionConnectors(),
      this.GetDataFlows(),
    ];

    const validObservables = observables.filter(isObservable);

    forkJoin(validObservables).subscribe(
      (results) => {
        console.log('ForkJoin Results:', results);
      },
      (error) => console.error('ForkJoin Error:', error),
      () => console.log('ForkJoin completed')
    );
    setTimeout(() => {
      this.edit();
    }, 1000);
  }

  allData: any[] = [];

  edit() {
    this.bussionServers.forEach((s) => {
      s.id = '1';
      s.img =
        'https://static.vecteezy.com/system/resources/previews/014/705/802/non_2x/unique-server-icon-free-vector.jpg'; //'https://static.vecteezy.com/system/resources/previews/010/754/395/non_2x/server-icon-logo-template-free-vector.jpg';
    });

    this.bussionConnectors.forEach((c) => {
      c.id = c.nodeId;
      c.pid = '1';
      c.img = 'http://dev.bussion.com/assets/images/icons/node7000.jpeg';
    });

    this.connectorTasks.forEach((t) => {
      t.pid = t.bussionConnector;
      t.id = t.connectorId;
      t.img =
        'http://dev.bussion.com/BussionImages/Pictures/BussionConnector.png';
    });

    this.bussionDataNodes.forEach((b) => {
      b.pid = '1';
      b.id = b.nodeId.toString();
      b.img = 'http://dev.bussion.com/assets/images/icons/node.jpeg';
    });


    this.allData = this.bussionServers.concat(
      this.bussionConnectors,
      this.connectorTasks,
      this.bussionDataNodes
    );

    this.gettree();
  }

  gettree() {
    const tree = this.content.nativeElement;

    if (tree) {
      var chart = new OrgChart(tree, {
        layout: OrgChart.layout.normal,
        editForm: {
          readOnly: true,
        },
        levelSeparation: 120,
        menu: {
          svg: { text: 'Export SVG' },
          csv: { text: 'Export CSV' },
          export_pdf: {
            text: 'Export PDF',
            icon: OrgChart.icon.pdf(24, 24, '#7A7A7A'),
            onClick: (nodeId: any) => {
              chart.exportPDF({
                format: 'A4',
                padding: 50,
              });
            },
          },
        },
        //mode: 'dark',
        nodeCircleMenu: {
          editNode: {
            //icon: OrgChart.icon.edit(24, 24, '#aeaeae'),
            text: 'Edit node',
            color: 'white',
          },
          addClink: {
            icon: OrgChart.icon.link(24, 24, '#aeaeae'),
            text: 'Add C link',
            color: '#fff',
            draggable: true,
          },
        },
        padding: 20,
        toolbar: {
          zoom: true,
          fit: true,
          expandAll: true,
          fullScreen: true,
          layout: false,
        },

        nodeMenu: {
          details: { text: 'Details' },
          //edit: { text: 'Edit' },
          add: { text: 'Add' },
          remove: { text: 'Remove' },
        },
        nodeBinding: {
          field_0: 'name',
          img_0: 'img',
        },
      });

      chart.config.enableDragDrop = false;

      chart.load(this.allData);
    }
  }
}
