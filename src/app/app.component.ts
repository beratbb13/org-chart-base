import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { BussionService } from './bussion.service';
import OrgChart from '@balkangraph/orgchart.js';
import { concatMap } from 'rxjs/operators';
import {
  connectorResponse,
  connectorTaskDestination,
  connectorTaskResponse,
  connectorTaskSource,
  dataStoreResponse,
  dataflowResponse,
  nodeResponse,
  serverResponse,
  columns, script,
  dataflowParameters,
  dataStoreCollection
} from './entities/customEntities';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [BussionService],
})
export class AppComponent {

  /*

    Try() {
      this.bS.refreshData().subscribe(() => this.GetBussionServers());
    }

    GetBussionServers() {
      this.bS.GetBussionServers().pipe(
        tap((response) => {
          this.bussionServers = [{ name: response.message[0] as string }];
        }),
        tap(() => {
          this.GetBussionConnectors().subscribe(res => {
            if (res.result === true) {
              this.bussionConnectors = res.message as connectorResponse[];
            }
          });
        }),
        tap(() => {
          this.GetBussionDataNodes().subscribe(res => {
            if (res.result === true) {
              this.bussionDataNodes = res.message as nodeResponse[];
            }
          })
        }),
        tap(() => {
          this.GetConnectorTasks().pipe(map((res) => {
            if (res.result === true) {
              this.connectorTasks = res.message as connectorTaskResponse[];
            }
          })
          ).subscribe(() => {
            this.connectorTasks.map(task => {
              const source: any = {
                pid: task.connectorId,
                sourceType: task.sourceType,
                sourceDatabase: task.sourceDatabase,
                sourceServer: task.sourceServer,
                sourceUser: task.sourceUser,
                sourcePassword: task.sourcePassword,
                sourcePort: task.sourcePort
              }
              this.connectorTaskSources.push(source);
            })
          });
        }),
        tap(() => {
          this.GetDataStores().subscribe(res => {
            if (res.result === true) {
              this.dataStores = res.message as dataStoreResponse[];
            }
          });
        }),
        tap(() => {
          this.GetDataFlows().subscribe(res => {
            if (res.result === true) {
              this.dataFlows = res.message as dataflowResponse[];
            }
          });
        }),
      ).subscribe(() => {
        this.edit();
      })
    }
  */

  /*GetBussionServers() {
    this.bS.GetBussionServers().pipe(
      concatMap((response) => {
        if (response.result === true) {
          this.bussionServers = [{ name: response.message[0] as string }];
        }
        return this.bS.GetBussionConnectors();
      }),
      concatMap((response) => {
        if (response.result === true) {
          this.bussionServers = [{ name: response.message[0] as string }];
        }
        return this.bS.GetBussionConnectors();
      }),
      concatMap((response) => {
        if (response.result === true) {
          this.bussionServers = [{ name: response.message[0] as string }];
        }
        return this.bS.GetBussionConnectors();
      }),
      concatMap((response) => {
        if (response.result === true) {
          this.bussionServers = [{ name: response.message[0] as string }];
        }
        return this.bS.GetBussionConnectors();
      }),
      concatMap((response) => {
        if (response.result === true) {
          this.bussionServers = [{ name: response.message[0] as string }];
        }
        return this.bS.GetBussionConnectors();
      }),
      concatMap((response) => {
        if (response.result === true) {
          this.bussionServers = [{ name: response.message[0] as string }];
        }
        return this.bS.GetBussionConnectors();
      }),
      concatMap(() => this.bS.GetBussionDataNodes()),
      concatMap(() => this.bS.GetConnectorTasks()),
      concatMap(() => this.bS.GetDataStores()),
      concatMap(() => this.bS.GetDataFlows())
    ).subscribe(() => {
      this.edit();
    });
  }*/

  /*
  GetBussionDataNodes() {
    this.bS.GetBussionDataNodes().subscribe((res) => {
      if (res.result === true) {
        this.bussionDataNodes = res.message as nodeResponse[];
      }
      return res;
    });
  }

  GetConnectorTasks() {
    this.bS.GetConnectorTasks().pipe(map((res) => {
      if (res.result === true) {
        this.connectorTasks = res.message as connectorTaskResponse[];
      }
      return res;
    })
    ).subscribe((res) => {
      this.connectorTasks.map(task => {
        const source: any = {
          pid: task.connectorId,
          sourceType: task.sourceType,
          sourceDatabase: task.sourceDatabase,
          sourceServer: task.sourceServer,
          sourceUser: task.sourceUser,
          sourcePassword: task.sourcePassword,
          sourcePort: task.sourcePort
        }
        this.connectorTaskSources.push(source);
      })
      return res; // Bu satırı kullanıp kullanmamaya karar verebilirsiniz
    });
  }

  GetDataStores() {
    this.bS.GetDataStores().subscribe((res) => {
      if (res.result === true) {
        this.dataStores = res.message as dataStoreResponse[];
      }
      return res; // Bu satırı kullanıp kullanmamaya karar verebilirsiniz
    });
  }

  GetBussionConnectors() {
    this.bS.GetBussionConnectors().subscribe((res) => {
      if (res.result === true) {
        this.bussionConnectors = res.message as connectorResponse[];
      }
      return res; // Bu satırı kullanıp kullanmamaya karar verebilirsiniz
    });
  }

  GetDataFlows() {
    this.bS.GetDataFlows().subscribe((res) => {
      if (res.result === true) {
        this.dataFlows = res.message as dataflowResponse[];
      }
      return res; // Bu satırı kullanıp kullanmamaya karar verebilirsiniz
    });
  }
  */

  constructor(private bS: BussionService) { }

  @ViewChild('content') content!: ElementRef;

  allData: any[] = [];
  bussionServers: serverResponse[] = [];
  bussionConnectors: connectorResponse[] = [];
  bussionDataNodes: nodeResponse[] = [];
  connectorTasks: connectorTaskResponse[] = [];
  dataStores: dataStoreResponse[] = [];
  dataFlows: dataflowResponse[] = [];
  connectorTaskSources: connectorTaskSource[] = [];
  connectorTaskDestination: connectorTaskDestination[] = [];
  collections: dataStoreCollection[] = [];

  GetBussionServers() {

    this.bS.refreshData().pipe(
      concatMap(response => {
        if (response.result === true) {
          console.log('refreshed')
        }
        return this.bS.GetBussionServers();
      }),
      concatMap(response => {
        if (response.result === true) {
          this.bussionServers = [{ name: response.message[0] as string }];
        }
        return this.bS.GetBussionConnectors();
      }),
      concatMap(response => {
        if (response.result === true) {
          this.bussionConnectors = response.message as connectorResponse[];
        }
        return this.bS.GetBussionDataNodes();
      }),
      concatMap(response => {
        if (response.result === true) {
          this.bussionDataNodes = response.message as nodeResponse[];
        }
        return this.bS.GetDataFlows();
      }),
      concatMap(response => {
        if (response.result === true) {
          this.dataFlows = response.message as dataflowResponse[];
        }
        return this.bS.GetDataStores();
      }),
      concatMap(response => {
        if (response.result === true) {
          this.dataStores = response.message as dataStoreResponse[];
        }
        return this.bS.GetConnectorTasks();
      })
    ).subscribe((response) => {
      if (response.result === true) {
        this.connectorTasks = response.message as connectorTaskResponse[];
      }

      this.connectorTasks.map((task: connectorTaskResponse) => {
        const source: any = {
          pid: task.connectorId,
          sourceType: task.sourceType,
          sourceDatabase: task.sourceDatabase,
          sourceServer: task.sourceServer,
          sourceUser: task.sourceUser,
          sourcePassword: task.sourcePassword,
          sourcePort: task.sourcePort,
          query: task.query
        }

        const destination: any = {
          pid: task.connectorId,
          node: task.node,
          universe: task.universe,
          collection: task.collection,
        }

        this.connectorTaskSources.push(source);
        this.connectorTaskDestination.push(destination);
      });

      this.dataStores.map((store: dataStoreResponse) => {
        console.log(store)
        let collection = {
          name: store.collection,
          pid: store.dataStoreId,
          img: 'https://demo.bussion.com/assets/images/icons/data_store.svg',
          columns: store.columns
        }
        this.collections.push(collection);
      })

      this.editDatas();
    });
  }

  ngOnInit() {
    this.GetBussionServers();
  }

  editDatas() {
    this.bussionServers.forEach((s) => {
      s.id = '1';
      s.img =
        'https://static.vecteezy.com/system/resources/previews/014/705/802/non_2x/unique-server-icon-free-vector.jpg'; //'https://static.vecteezy.com/system/resources/previews/010/754/395/non_2x/server-icon-logo-template-free-vector.jpg';
    });

    this.bussionConnectors.forEach((c) => {
      c.id = c.nodeId;
      c.pid = '1';
      c.img = 'http://demo.bussion.com/assets/images/icons/node7000.jpeg';
    });

    this.bussionDataNodes.forEach((b) => {
      b.pid = '1';
      b.id = b.nodeId.toString();
      b.img = 'http://demo.bussion.com/assets/images/icons/node.jpeg';
    });

    this.connectorTasks.forEach((t) => {
      t.pid = t.bussionConnector;
      t.id = t.connectorId;
      t.img =
        'http://demo.bussion.com/BussionImages/Pictures/BussionConnector.png';
    });

    this.connectorTaskSources.forEach((b, i) => {
      b.id = b.sourceDatabase + i;
      b.name = b.sourceDatabase;
      b.img = 'https://e7.pngegg.com/pngimages/688/143/png-clipart-location-map-map-pin-logo.png';
    });

    this.connectorTaskDestination.forEach((b, i) => {
      b.id = b.collection + i;
      b.name = b.collection;
      b.img = 'https://e7.pngegg.com/pngimages/626/221/png-clipart-computer-icons-destination-map-miscellaneous-map.png';
    });

    this.dataStores.map(n => {
      n.id = n.dataStoreId;
      n.pid = n.nodeId;
      n.img = 'http://demo.bussion.com/assets/images/icons/data_store.svg';
    });

    this.dataFlows.map(n => {
      n.id = n.flowId;
      n.pid = '1';
      n.img = 'https://demo.bussion.com/assets/images/icons/flow.svg';
    });

    this.collections.forEach((c, i) => {
      c.id = c.name;
    })

    this.allData = [...this.bussionServers,
    ...this.bussionConnectors,
    ...this.connectorTasks,
    ...this.connectorTaskSources,
    ...this.connectorTaskDestination,
    ...this.bussionDataNodes,
    ...this.dataStores,
    //...this.collections,
    ...this.dataFlows
    ];

    this.createOrgTree();
  }

  createOrgTree() {

    const tree = this.content.nativeElement;

    if (tree) {
      var chart = new OrgChart(tree, {
        //layout: OrgChart.layout.normal,
        template: 'ula',
        enableSearch: false,
        editForm: {
          readOnly: true,
        },
        //levelSeparation: 120,
        menu: {
          svg: { text: 'Export SVG' },
          csv: { text: 'Export CSV' },
          /*export_pdf: {
            text: 'Export PDF',
            icon: OrgChart.icon.pdf(24, 24, '#7A7A7A'),
            onClick: () => {
              chart.exportPDF({
                format: 'A4',
                padding: 500,
                openInNewTab: true,
                header: 'Header HH'
              });
            },
          },*/
        },
        nodeCircleMenu: {
          editNode: {
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
          fullScreen: true,
          layout: false,
        },
        nodeMenu: {
          details: { text: 'Details' },
          //add: { text: 'Add' },
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
