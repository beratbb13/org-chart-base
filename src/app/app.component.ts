import { Component, ElementRef, ViewChild, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { BussionService } from './bussion.service';
import { concatMap } from 'rxjs/operators';
import { connectorResponse, connectorTaskDestination, connectorTaskResponse, connectorTaskSource, dataStoreResponse, dataflowResponse, nodeResponse, serverResponse, dataStoreCollection } from './entities/customEntities';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5hierarchy from '@amcharts/amcharts5/hierarchy';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [BussionService],
})
export class AppComponent {

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
  private root!: am5.Root;

  constructor(private bS: BussionService) { }

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
          query: task.query,
          img: 'assets/source.png'
        }

        const destination: any = {
          pid: task.connectorId,
          node: task.node,
          universe: task.universe,
          collection: task.collection,
          img: 'assets/destination.png'
        }

        this.connectorTaskSources.push(source);
        this.connectorTaskDestination.push(destination);
      });

      this.dataStores.map((store: dataStoreResponse) => {
        let collection = {
          name: store.collection,
          pid: store.dataStoreId,
          img: 'https://static.vecteezy.com/system/resources/previews/014/705/802/non_2x/unique-server-icon-free-vector.jpg',
          columns: store.columns
        }
        this.collections.push(collection);
      })

      this.editDatas();
    });
  }

  editDatas() {

    this.connectorTasks.map(task => {
      const sources = this.connectorTaskSources.filter(source => source.pid === task.connectorId)
        .map(item => ({
          name: item.sourceDatabase,
          image: item.img,
        }));

      const destinations = this.connectorTaskDestination.filter(destination => destination.pid === task.connectorId)
        .map(item => ({
          name: item.collection,
          image: item.img,
        }));

      const children = [...sources, ...destinations];

      task.children = children;
    });

    this.bussionConnectors.map(conn => {
      const tasks = this.connectorTasks
        .filter(cT => cT.bussionConnector == conn.nodeId)
        .map(cT => ({ name: cT.name, image: 'assets/BussionConnector.png', children: cT.children }));

      const flows = this.dataFlows
        .filter(dF => dF.bussionConnectorId == conn.nodeId)
        .map(dF => ({ name: dF.name, image: 'assets/dataFlow.png' }))

      const children = [...tasks, ...flows];

      conn.children = children;
    });

    let groupedDataStores: { [key: string]: any[] } = {};

    this.dataStores.forEach(dataStore => {
      const nodeId = dataStore.nodeId.toString();

      if (!groupedDataStores[nodeId]) {
        groupedDataStores[nodeId] = [];
      }

      groupedDataStores[nodeId].push({
        name: dataStore.name,
        img: 'assets/dataStore.png',
      });
    });

    this.bussionDataNodes.forEach(bussionDataNode => {
      const nodeId = bussionDataNode.nodeId.toString();
      bussionDataNode.children = groupedDataStores[nodeId] || [];
    });

    let groupedNodes: { [key: string]: any[] } = {};

    this.bussionDataNodes.forEach(node => {

      const nodeType = node.dataNodeType;

      if (!groupedNodes[nodeType]) {
        groupedNodes[nodeType] = [];
      }

      groupedNodes[nodeType].push({
        name: node.name,
        children: node.children || [],
        image: 'assets/DataStore.png',
        collapsed: true
      });
    });

    if (this.bussionServers && this.bussionServers.length > 0) {
      this.bussionServers[0].children = [
        ...this.bussionConnectors.map(conn => ({
          name: conn.name,
          children: conn.children || [],
          image: 'assets/BussionConnector.png',
          collapsed: true
        })),
        ...Object.keys(groupedNodes).map(key => ({
          name: key,
          children: groupedNodes[key],
          image: 'assets/dataNode.png'
        })),

        /*...this.bussionDataNodes.map(dN => ({
          name: dN.name,
          children: dN.children || [],
          value: 1,
          image: 'https://static.vecteezy.com/system/resources/previews/014/705/802/non_2x/unique-server-icon-free-vector.jpg',
          collapsed: true
        })),*/

        /*...this.dataFlows.map(dataFlow => ({
          name: dataFlow.name,
          image: 'https://demo.bussion.com/assets/images/icons/flow.svg',
          value: 1,
          children: []
        }))*/
      ];
    } else {
      console.error('this.bussionServers dizisi tanımsız veya boş.');
    }

    this.allData.push({
      name: this.bussionServers[0].name,
      image: 'https://static.vecteezy.com/system/resources/previews/014/705/802/non_2x/unique-server-icon-free-vector.jpg',
      children: [
        ...this.bussionServers[0].children.map((child: any) => ({
          name: child.name,
          children: child.children,
          image: child.image,
          collapsed: true,
        }))
      ]
    });

    console.log(this.allData);

    this.create();

  }

  ngOnInit() {
    this.GetBussionServers();
  }

  create() {
    var root = am5.Root.new(this.content.nativeElement);
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    var container = am5.Container.new(root, {
      width: am5.percent(100),
      height: am5.percent(100),
      layout: root.verticalLayout
    });

    var series = am5hierarchy.Tree.new(root, {
      singleBranchOnly: true,
      downDepth: 1,
      initialDepth: 5,
      topDepth: 0,
      //valueField: "value",
      categoryField: "name",
      childDataField: "children",
      disabledField: "collapsed",
      orientation: "vertical",
      tooltip: am5.Tooltip.new(root, {
        labelText: '{category}'
      }),
    });

    series.labels.template.setAll({
      fill: am5.color(0x000000),
      y: 30,
      oversizedBehavior: "none",
      fontSize: 12,
    });

    series.circles.template.set("forceHidden", true);

    series.nodes.template.setup = function (target) {
      target.events.on("dataitemchanged", function (ev) {
        let obj: any = ev.target.dataItem?.dataContext;
        let image = obj.image;
        var icon = am5.Picture.new(root, {
          width: 40,
          height: 40,
          centerX: am5.percent(50),
          centerY: am5.percent(50),
          src: image,
        });
        target.children.push(icon);
      });
    }

    container.children.push(series);
    root.container.children.push(container);

    series.data.setAll(this.allData);
    series.set("selectedDataItem", series.dataItems[0]);
  }

}