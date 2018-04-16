import { Component, OnInit, ElementRef, Renderer, Output, EventEmitter, Input, ViewChild, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { ValidateService } from '../../services/validate.service';
import { TabMenuModule, MenuItem } from 'primeng/primeng';
import { ProductoService } from '../../services/producto.service';
import { TipoProductoService } from '../../services/tipo-producto.service';
import { ClienteService } from '../../services/cliente.service';
import { TipoClienteService } from '../../services/tipo-cliente.service';
import { MessageGrowlService } from '../../services/message-growl.service';
import { ClientesComponent } from '../../components/clientes/clientes.component';
import { FormatterService } from '../../services/formatter.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { TarjetaService } from '../../services/tarjeta.service';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component'
import * as myGlobals from '../../components/globals';
import { FacturaService } from '../../services/factura.service';
import { PromocionService } from '../../services/promocion.service';
import { DecimalPipe, DatePipe, SlicePipe } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { FacturacionComponent } from '../../components/facturacion/facturacion.component';
import { PersonalService } from '../../services/personal.service';
import { ActiveCardsService } from '../../services/active-cards.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Subject } from 'rxjs/Subject';
import { CajaService } from '../../services/caja.service';
import { Router } from '@angular/router';
import { CoverService } from '../../services/cover.service';
import { CoverprodRenderComponent } from '../coverprod-render/coverprod-render.component';
import { PrintRenderComponent } from '../image-render/print-render.component';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})


export class CardComponent implements OnInit {

  cardNumber: string;
  validCard: String;
  baseColor: String;
  validCedula: String;
  // Atributos cliente
  cedula: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  fecha_nacimiento: string;
  sexo: string;
  selected_tipo_cliente: string;
  numero;
  cantHombres: number;
  cantMujeres: number;
  cantSalenM: number;
  cantSalenH: number;
  showDialog = false;
  showDialogPrint = false;
  flagUserFound = false;
  flagCardFound = false;
  flagCaUsFound = false;
  nfLael = "";
  selectedTab: number;
  public dt: Date = new Date();
  tabs: any[];
  mapTP: any[];
  mapP: any[];
  public headers = [];
  mapProdShow: any[];
  color = 'primary';
  selectedPromos: any[];
  promos: any[];
  selectedPromo: string;
  blockedPanel: boolean = true;
  lstConsumo: any[] = [];
  types: any[];
  selectedIeMujeres = 'Egreso';
  selectedIeHombres = 'Egreso';
  es: any;
  sexs = [
    { "name": 'Masculino', "pseudo": "M" },
    { "name": 'Femenino', "pseudo": "F" },
  ];
  tipo_clientes: any = [];
  public clientes: any = [];
  clientesC: any = [];
  citiesDD: any[];
  private foo: ClientesComponent;
  searchUser: any;
  cardNumberS;
  settingsT = {
    mode: 'external',
    noDataMessage: 'No existen registros',
    columns: {
      numero: {
        title: 'Numero Tarjeta',
        width: '12%',
      },
      cedula: {
        title: 'CI. Cliente',
        width: '12%'
      },
      nombre: {
        title: 'Nombre Cliente',
        width: '15%'
      },
      apellido: {
        title: 'Apellido Cliente',
        width: '15%'
      },
      limite: {
        title: 'Limite Consumo',
        width: '10%'
      },
      tipo: {
        title: 'Tipo',
        width: '10%'
      },
      descripcion: {
        title: 'Descripcion',
        width: '26%'
      }
    },
    actions: {
      // columnTitle: '',
      add: true,
      edit: true,
      delete: true
    },
    attr: {
      class: 'table-bordered table-hover table-responsive'
    }
  };
  sourceT: LocalDataSource = new LocalDataSource();
  showDialogT = false;
  selectedClientGP: any;
  tipoTarjetas: any = [];
  limiteConsumo;
  descTarjeta;
  cardNumberGT;
  selectedTipoTarjeta: any;
  naCliente;
  flagCN = false;
  lstAddCardCI: any = [];
  lstAddCardCI1: any = [];
  showDialogTU = false;
  flagCNU = false;
  updateTarjeta: any;
  oldCard;
  ind = 0;
  lstCards: any = [];
  flagActivateInsertCard = true;
  lstPromociones: any = [];
  showDialogPB = false;
  value: number = 0;
  @ViewChild('cedulaNew')
  myInputVariable1: any;
  cc;
  flagTC = false;
  flagTCU = false;
  coverMujeres = 3;
  coverHombres = 3;
  showDialogFP = false;
  rucFactura;
  flagFP = false;
  lstFP: any = [];
  selectedFP: any;
  flagInsertRuc = true;
  selectedRucFactura = false;
  totalConsumo: number = 0;
  flagCheckVenta = true;
  nombreS;
  telefonoS;
  direccionS;
  flagConfirmFP = true;
  flagCardSFound = false;
  nfLaelS;
  searchUserS: any;
  totalPagar;
  showDateHour;
  cardNumberE;
  flagCardEFound = false;
  nfLaelE;
  searchUserE = {
    abono: 0,
    ci: '',
    nombre: '',
    cantMujeres: 0,
    cantHombres: 0,
    egresoMujeres: 0,
    egresoHombres: 0,
    fechaHora: '',
    idFactura: '',
    cardNumber: '',
    ingresoMujeres: 0,
    ingresoHombres: 0,
    productosV: [],
    estado: 1,
    _id: ''
  }
  validCI = false;
  flagCheckFP = false;
  flagFP2 = false;
  fpEfectivo = 0;
  fpTarjeta = 0;
  fpPorCobrar = 0;
  fpCheque = 0;
  flagConsCero = true;
  abono = 0;
  flagFP3 = false;
  cardNumberG;
  flagCheckCI = true;
  checked = true;
  tipoDoc = true;
  tipo_documentos: any;
  selected_tipo_doc;
  position = 'below';
  showCompras = false;
  showDateApertura;
  showHourApertura;
  currentDateTime;
  lstComprasCliente: any = [];
  lstComprasClienteOld: any = [];
  cantColor = '#0000FF';
  displayOpenCaja;
  displayCloseCaja;
  displayOptions;
  username;
  us;
  btnLabel;
  btnClass;
  public static updateDisplayCaja: Subject<boolean> = new Subject();
  displayOpenCajaN = false;
  displayCloseCajaN = false;
  montoO = 0;
  montoF = 0;
  efectivoExis = 0;
  efectivoEsp = 0;
  flagShowAlert;
  public static checkOpenCaja: Subject<boolean> = new Subject();
  displayCloseCajaL = false;
  colorConsCero = 'ui-state-error ui-message ui-corner-all';
  textoConsumo = 'Consumo Cero';
  flagErrorFP = false;
  campoFP;
  maximoFP;
  limCons = 0;
  lstCovers: any = [];
  selectedCoverM: any;
  selectedCoverH: any;
  lstResumenOpen: any[];
  blockCaja = false;

  constructor(
    private validateService: ValidateService,
    public el: ElementRef, public renderer: Renderer,
    private productoService: ProductoService,
    private tipoProductoService: TipoProductoService,
    private clienteService: ClienteService,
    private tipoClienteService: TipoClienteService,
    private messageGrowlService: MessageGrowlService,
    private formatterService: FormatterService,
    public dialog: MdDialog,
    private tarjetaService: TarjetaService,
    private facturaService: FacturaService,
    private promocionService: PromocionService,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private slicePipe: SlicePipe,
    private localStorageService: LocalStorageService,
    private personalService: PersonalService,
    private activeCardsService: ActiveCardsService,
    private cajaService: CajaService,
    public authService: AuthService,
    private router: Router,
    private coverService: CoverService,
    private configurationService: ConfigurationService) {

    this.cardNumber = "";
    this.validCard = "ñ1006771_";
    this.baseColor = "#f8f5f0";
    // Atributos cliente
    this.cedula = "";
    this.nombre = "";
    this.apellido = "";
    this.telefono = "";
    this.correo = "";
    this.sexo = "M";
    this.selected_tipo_cliente = "";
    this.es = {
      firstDayOfWeek: 1,
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: 'Hoy',
      clear: 'Borrar'
    }
    setTimeout(function () {
      if (document.getElementById('cedulaNew') !== null)
        document.getElementById('cedulaNew').focus();
    }, 50);

    this.tipoTarjetas = [];
    this.tipoTarjetas.push({ label: 'Normal', value: 'Normal' });
    this.tipoTarjetas.push({ label: 'VIP', value: 'VIP' });
    this.selectedTipoTarjeta = this.tipoTarjetas[0].label;

    this.tipo_documentos = [];
    this.tipo_documentos.push({ label: 'Cédula', value: '1' });
    this.tipo_documentos.push({ label: 'Pasaporte', value: '2' });
    this.selected_tipo_doc = this.tipo_documentos[0];

    this.updateTarjeta = {
      'numero': '',
      'cedula': '',
      'tipo': '',
      'limite': '',
      'descripcion': ''
    };

    this.lstFP = [];
    this.lstFP.push({ label: 'Efectivo', value: 0 });
    this.lstFP.push({ label: 'Tarjeta de Crédito', value: 1 });
    this.lstFP.push({ label: 'Efectivo y Tarjeta de Crédito', value: 2 });
    this.lstFP.push({ label: 'Por Cobrar', value: 3 });
    this.lstFP.push({ label: 'Consumo en Cero', value: 4 });
    this.selectedFP = this.lstFP[0];

    this.currentDateTime = this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm:ss');
    this.showDateApertura = this.currentDateTime.split(' ')[0];
    this.showHourApertura = this.currentDateTime.split(' ')[1];

    this.displayOpenCaja = false;
    this.displayCloseCaja = false;
    this.displayOptions = false;
    //Traer datos de usuario logeado desde Personal
    this.getLoggedUser();
    //Traer lista de cajas para intercambios monetarios
    this.getCajas();
    //Chequear caja abierta no loguin
    this.checkOpenCajaInside();
    //Verificar si acabo de loguearse
    CardComponent.updateDisplayCaja.subscribe(res => {
      this.cajaService.getActiveCajaById('open', this.us.idPersonal).subscribe(data => {
        if (data.length > 0) {
          this.displayOptions = true;
        }
      }, err => {
        console.log(err);
      });
    })
    //Verificar si caja se cerro antes de salir
    CardComponent.checkOpenCaja.subscribe(res => {
      console.log('check open caja desde afuera')
      this.displayCloseCajaL = true;
    })

    var x = window.innerWidth;
    this.onRzOnInit(x);
  }

  ngOnInit() {

    this.validateService.getDateTimeStamp();

    setTimeout(function () {
      document.getElementById('cedulaNew').focus();
    }, 50)
    document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';
    this.cantHombres = 0;
    this.cantMujeres = 0;
    this.cantSalenM = 0;
    this.cantSalenH = 0;
    this.selectedTab = 0;
    this.selectedPromos = [];
    this.types = [];
    this.types.push({ label: 'Entran', value: 'Ingreso' });
    this.types.push({ label: 'Salen', value: 'Egreso' });

    var initial = new Date(this.getDate()).toLocaleDateString().split("/");
    this.fecha_nacimiento = [initial[0], initial[1], initial[2]].join('/');
    this.tipoProductoService.getAll().subscribe(tp => {
      this.mapTP = tp;
      this.tabs = [];
      for (let entry of tp) {
        let aux = { label: entry.desc_tipo_producto, icon: 'fa-bar-chart' };
        this.tabs.push(aux);
      }
      this.productoService.getAll().subscribe(p => {
        this.mapP = p;
        this.promocionService.getAll().subscribe(data => {
          this.lstPromociones = data;
          this.mapProdShow = [];
          let firstElement = this.mapTP[0]._id;
          for (let entry of p) {
            if (entry.promocion.length > 0) {

              let aux = {
                nombre: entry.nombre,
                cant_existente: this.decimalPipe.transform(entry.cant_existente, '1.2-2'),
                precio_costo: this.decimalPipe.transform(entry.precio_costo, '1.2-2'),
                precio_venta: this.decimalPipe.transform(entry.precio_venta, '1.2-2'),
                selectedPromo: this.lstPromociones[0].nombre,
                precio_promo: this.decimalPipe.transform(entry.precio_venta, '1.2-2')
              };
              this.selectedPromos.push(aux);
              myGlobals.addElementPromo(entry);
            }
            if (entry.id_tipo_producto.localeCompare(firstElement) === 0) {
              let aux = {
                nombre: entry.nombre,
                cant_existente: this.decimalPipe.transform(entry.cant_existente, '1.2-2'),
                precio_costo: this.decimalPipe.transform(entry.precio_costo, '1.2-2'),
                precio_venta: this.decimalPipe.transform(entry.precio_venta, '1.2-2'),
                selectedPromo: '',
                precio_promo: this.decimalPipe.transform(entry.precio_venta, '1.2-2')
              };
              if (this.lstPromociones.length > 0) {
                aux.selectedPromo = this.lstPromociones[0].nombre;
              }
              this.mapProdShow.push(aux);
            }
          }
          this.FillHeaders(this.mapP);
        }, err => {
          console.log(err);
        })

      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err);
      return false;
    })
    this.ngOnInitCards();
    this.rucFactura = '';
    this.lstResumenOpen = [];
    this.lstResumenOpenE = [];
    this.ngOnInitReimpresion();
    this.ngOnInitCloseTab();
  }

  getLoggedUser() {
    this.us = JSON.parse(localStorage.getItem('user'));
    if (this.us !== null) {
      this.personalService.getByCedula(this.us.username).subscribe(data => {
        if (data.length > 0) {
          let nombres = data[0].nombres.split(' ');
          this.username = nombres[0];
        }
      }, err => {
        console.log(err);
      })
    }
  }

  getCajas() {
    this.personalService.getByTipo('59a054715c0bf80b7cab502d').subscribe(data => {
      this.lstCajas = data;
      let user = this.us.username;
      this.lstCajas = this.lstCajas.filter(function (obj) {
        return obj.cedula.localeCompare(user) !== 0;
      });
      if (this.lstCajas.length > 0) {
        this.selectedCaja = this.lstCajas[0];
      }
    }, err => {
      console.log(err);
    });
  }

  checkOpenCajaInside() {
    this.cajaService.getActiveCajaById('open', this.us.idPersonal).subscribe(data => {
      this.objOpenCash = data;
      if (data.length == 0) {
        this.btnLabel = 'Abrir Turno';
        this.btnClass = '#2398E5';
        this.blockCaja = true;
      } else {
        this.btnLabel = 'Cerrar Turno';
        this.btnClass = '#EFAD4D';
        this.blockCaja = false;
      }
    }, err => {
      console.log(err);
    });
  }

  insertFakeCaja() {
    /*let caja1 = {
      idUser: '5a2f07113d4776179c860761',
      montoO: '50',
      montoF: 'open',
      fechaO: this.currentDateTime,
      fechaF: ''
    }
    this.cajaService.register(caja1).subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    });
    let caja2 = {
      idUser: '5a30a66f747bd11f78a51330',
      montoO: '35',
      montoF: 'open',
      fechaO: this.currentDateTime,
      fechaF: ''
    }
    this.cajaService.register(caja2).subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    });*/
  }

  objOpenCash: any;
  openCloseCaja() {
    if (this.btnLabel.localeCompare('Cerrar Turno') == 0) {
      this.displayCloseCajaN = true;
      //Calcular efectivo esperado ((montoO + entradas) - salidas) + ventas desde apertura
      this.efectivoEsp = this.calcEfectivoEsperado();
      this.efectivoExis = 0;
      setTimeout(function () {
        document.getElementById('efectivoExis1').focus();
      }, 0);
    } else {
      this.displayOpenCajaN = true;
      this.montoO = 0;
      setTimeout(function () {
        document.getElementById('montoO').focus();
      }, 0);
    }
  }

  genericAdd() {
    const add = (a, b) => a + b;
    return add;
  }

  calcEfectivoEsperado() {
    console.log(this.objOpenCash)
    let totalEntradas = 0;
    if (this.objOpenCash[0].entradas.length > 0) {
      //totalEntradas = this.objOpenCash.entradas.reduce(this.genericAdd());
      totalEntradas = this.genericAddObject(this.objOpenCash[0].entradas)
    }
    let totalSalidas = 0;
    if (this.objOpenCash[0].salidas.length > 0) {
      //totalSalidas = this.objOpenCash.salidas.reduce(this.genericAdd());
      totalSalidas = this.genericAddObject(this.objOpenCash[0].salidas)
    }

    this.objOpenCash[0].montoO = parseFloat(this.objOpenCash[0].montoO);
    return (((this.objOpenCash[0].montoO + totalEntradas) - totalSalidas));
  }

  closeCaja() {
    this.cajaService.getActiveCajaById('open', this.us.idPersonal).subscribe(data => {
      let caja = {
        _id: data[0]._id,
        idUser: data[0].idUser,
        montoO: data[0].montoO,
        montoF: this.efectivoExis,
        fechaO: data[0].fechaO,
        fechaF: this.validateService.getDateTimeStamp(),
        entradas: data[0].entradas,
        salidas: data[0].salidas
      }

      this.cajaService.update(caja).subscribe(data => {
        this.checkOpenCajaInside();
        this.displayCloseCajaN = false;
        this.messageGrowlService.notify('info', 'Información', 'Se ha cerrado caja exitosamente.\nEnviando correo al administrador.');
      }, err => {
        console.log(err);
      })
    }, err => {
      console.log(err);
    });
    //this.sendEmail();
  }

  sendEmail() {
    const user = {
      name: 'asd',
      email: 'mrjleo1989@gmail.com',
      username: this.us.name,
      npass: this.formatterService.makeId()
    }
    this.cajaService.sendCorte(user).subscribe(data => {
      console.log(data);
    });
  }

  openCaja() {
    this.cajaService.getActiveCajaById('open', this.us.idPersonal).subscribe(data => {
      if (data.length == 0) {
        let caja = {
          idUser: this.us.idPersonal,
          montoO: this.montoO,
          montoF: 'open',
          fechaO: this.validateService.getDateTimeStamp(),
          fechaF: '',
          entradas: [],
          salidas: []
        }
        this.cajaService.register(caja).subscribe(data => {
          this.checkOpenCajaInside();
          this.displayOpenCajaN = false;
          this.messageGrowlService.notify('info', 'Información', 'Caja habilitada para el cobro a las ' + this.validateService.getDateTimeEs() + '.' + '\nUsuario: ' + this.us.name);
        }, err => {
          console.log(err);
        });

      } else {
        this.messageGrowlService.notify('error', 'Error', 'La caja ya está abierta!');
        console.log("+ de 1 caja abierta por el mismo user")
      }
    }, err => {
      console.log(err);
    })
  }

  closeCajaL() {
    this.cajaService.getActiveCajaById('open', this.us.idPersonal).subscribe(data => {
      let caja = {
        idUser: this.us.idPersonal,
        montoO: data[0].montoO,
        montoF: this.efectivoExis,
        fechaO: data[0].fechaO,
        fechaF: this.validateService.getDateTimeStamp(),
        entradas: [],
        salidas: []
      }
      this.cajaService.register(caja).subscribe(data => {
        this.messageGrowlService.notify('info', 'Información', 'Se ha cerrado caja exitosamente.\nEnviando correo al administrador.');
        this.displayCloseCajaL = false;
        this.authService.logout();
        this.router.navigate(['/login']);
      }, err => {
        console.log(err);
      })
    }, err => {
      console.log(err);
    })
  }

  logOut() {
    this.displayCloseCajaL = false;
    this.authService.logout();
    this.messageGrowlService.notify('info', 'Información', 'Saliste!');
    this.router.navigate(['/login']);
  }

  onChangeExis() {
    if ((this.efectivoExis - this.efectivoEsp) == 0) {
      this.flagShowAlert = true;
    } else {
      this.flagShowAlert = false;
    }
  }

  FillHeaders(mapP) {
    for (let property in mapP[0]) {
      if (mapP[0].hasOwnProperty(property)) {
        if (property.localeCompare("nombre") === 0 || property.localeCompare("cant_existente") === 0 || property.localeCompare("precio_venta") === 0 || property.localeCompare("precio_costo") === 0)
          this.headers.push({
            field: property,
            header: (property.charAt(0).toUpperCase() + property.substr(1).toLowerCase()).replace("_", " ")
          });
      }
    }
  }

  setCursorAdd() {
    if (!this.flagUserFound) {
      this.showDialog = true;
      setTimeout(function () {
        document.getElementById('ciA').focus();
      }, 0)
      this.onChangeCI();
    }
  }

  onChangeTipoDoc() {
    if (this.selected_tipo_doc.value == 1) {
      this.tipoDoc = true;
      setTimeout(function () {
        let v = document.getElementById('cedulaNew');
        if (v != null)
          v.click();
      }, 50);
    } else {
      this.checked = false;
      this.tipoDoc = false;
      setTimeout(function () {
        let v = document.getElementById('cedulaNew');
        if (v != null)
          v.click();
      }, 50);
    }
  }

  public getDate(): number {
    return this.dt && this.dt.getTime() || new Date().getTime();
  }

  saveClient() {
    const newClient = {
      cedula: this.cedula,
      nombre: this.nombre,
      apellido: this.apellido,
      telefono: this.telefono,
      correo: this.correo,
      fecha_nacimiento: this.fecha_nacimiento,
      sexo: this.sexo,
      id_tipo_cliente: this.searchByName(this.selected_tipo_cliente, this.tipo_clientes),
      tarjeta: ""
    }
    //Required fields
    if (!this.validateService.validateClient(newClient)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    this.clienteService.registerCliente(newClient).subscribe(data => {
      this.ngOnInitClient();
      this.clientes.push(data)
      this.showDialog = false;
      this.checkClient();
      this.messageGrowlService.notify('success', 'Éxito', 'Ingreso Existoso!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }

  onAddTSubmit() {
    const newCard = {
      numero: this.cardNumberGT,
      nombre: '',
      apellido: '',
      cedula: '',
      limite: this.limiteConsumo,
      descripcion: this.descTarjeta,
      tipo: this.selectedTipoTarjeta
    }
    //Required fields
    if (!this.validateService.validateTarjeta(newCard)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacíos!');
      return false;
    }
    if (this.flagTC == false) {
      newCard.nombre = this.selectedClientGP.nombre;
      newCard.apellido = this.selectedClientGP.apellido;
      newCard.cedula = this.selectedClientGP.cedula;
      let row = this.lstAddCardCI.find(x => x.value.cedula === newCard.cedula);
      this.lstAddCardCI = this.lstAddCardCI.filter(function (obj) {
        return obj.value.cedula !== row.value.cedula;
      });
    }
    this.tarjetaService.register(newCard).subscribe(data => {
      this.sourceT.add(newCard);
      this.sourceT.refresh();
      let row = this.lstAddCardCI.find(x => x.value.cedula === newCard.cedula);
      //this.lstAddCardCI.push(asdsad)

      this.ngOnInitCards();
      this.showDialogT = false;
      this.messageGrowlService.notify('success', 'Exito', 'Ingreso Existoso!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })

  }

  onDeleteT(event): void {
    this.openDialog(event.data);
  }

  openDialog(dataT) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined)
        if (result.localeCompare("Aceptar") == 0) {
          //remove from database
          this.tarjetaService.delete(dataT._id).subscribe(data => {
            this.sourceT.remove(dataT);
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
            //add to lstclientesadd
            let busCI = this.clientes.find(x => x.cedula === dataT.cedula);
            let aux = {
              'value': {
                'apellido': busCI.apellido,
                'cedula': busCI.cedula,
                'correo': busCI.correo,
                'fecha_nacimiento': busCI.fecha_nacimiento,
                'id_tipo_cliente': busCI.id_tipo_cliente,
                'nombre': busCI.nombre,
                'sexo': busCI.sexo,
                'telefono': busCI.telefono,
                '_id': busCI._id
              },
              'label': busCI.nombre + ' ' + busCI.apellido,
            }
            this.lstAddCardCI.push(aux);

          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');

          })
        }
    });
  }

  deletePromos() {
    let dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined)
        if (result.localeCompare("Aceptar") == 0) {
          this.showDialogPB = true;
          let n = this.mapP.length;
          let exp = 100 / n;
          this.value = 0;
          for (let entry of this.mapP) {
            entry.promocion = [];
            this.productoService.updateProducto(entry).subscribe(data => {
              this.value += exp;
              if (this.value >= 100) {
                this.value = 100;
                this.showDialogPB = false;
              }
            }, err => {
              console.log(err)
            })
            this.messageGrowlService.notify('success', 'Éxito', 'Promociones Activas Eliminadas!');
          }
        }
    });
  }

  onUpdateTSubmit() {
    this.updateTarjeta.cedula = '';
    this.updateTarjeta.nombre = '';
    this.updateTarjeta.apellido = '';
    //Required fields
    if (!this.validateService.validateTarjeta(this.updateTarjeta)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    if (this.flagTCU == false) {
      this.updateTarjeta.cedula = this.selectedClientGP.cedula;
      this.updateTarjeta.nombre = this.selectedClientGP.nombre;
      this.updateTarjeta.apellido = this.selectedClientGP.apellido;
      let row = this.lstAddCardCI.find(x => x.value.cedula === this.updateTarjeta.cedula);
      this.lstAddCardCI = this.lstAddCardCI.filter(function (obj) {
        return obj.value.cedula !== row.value.cedula;
      });
    }
    this.tarjetaService.update(this.updateTarjeta).subscribe(data => {
      this.sourceT.update(this.oldCard, this.updateTarjeta);
      this.sourceT.refresh();
      this.ngOnInitCards();
      this.showDialogTU = false;
      this.messageGrowlService.notify('info', 'Información', 'Modificación Existosa!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }

  lessWoman() {
    if (this.cantMujeres > 0)
      //this.cantMujeres--;
      this.cantMujeres -= this.stepMujeres;
  }

  stepMujeres = 0;
  plusWoman() {
    if (this.cantMujeres < 100)
      this.cantMujeres += this.stepMujeres;
  }

  lessMan() {
    if (this.cantHombres > 0)
      this.cantHombres -= this.stepHombres;
  }

  stepHombres = 0;
  plusMan() {
    if (this.cantHombres < 100)
      this.cantHombres += this.stepHombres;
  }

  public alertMe1(st) {
    if (this.selectedTab != st && this.selectedTab > 0) {
      setTimeout(function () {
        let v = document.getElementById('cedulaNew');
        if (v != null)
          v.click();
      }, 50);
    }
    this.selectedTab = 1;
  };

  public alertMe2(st) {
    if (!this.selectedTab != st) {
      setTimeout(function () {
        let v = document.getElementById('numeroS');
        if (v != null)
          v.click();
      }, 50);
    }
    this.selectedTab = 2;
  };

  public alertMe3(st) {
    if (!this.selectedTab != st) {
      setTimeout(function () {
        let v = document.getElementById('numeroT');
        if (v != null)
          v.click();
      }, 50);
    }
    this.selectedTab = 3;
  };

  public alertMe4(st) {
    if (!this.selectedTab != st) {
      setTimeout(function () {
        let v = document.getElementById('numeroTar');
        if (v != null)
          v.click();
      }, 50);
    }
    this.selectedTab = 3;
  };

  onRowUnselect(event) {
    this.productoService.getByNombre(event.data.nombre).subscribe(data => {
      data[0].promocion = [];
      const producto = {
        _id: data[0]._id,
        nombre: data[0].nombre,
        precio_costo: parseFloat(data[0].precio_costo),
        precio_venta: parseFloat(data[0].precio_venta),
        utilidad: parseFloat(data[0].utilidad),
        cant_existente: data[0].cant_existente,
        contenido: parseFloat(data[0].contenido),
        path: data[0].path,
        subproductoV: data[0].subproductoV,
        id_tipo_producto: data[0].id_tipo_producto,
        promocion: data[0].promocion
      };
      myGlobals.sliceElement(producto);
      console.log(myGlobals.globalPromos);
      if (myGlobals.globalPromos.length > 0) {
        localStorage.removeItem('promosActivas');
        localStorage.setItem('promosActivas', JSON.stringify(myGlobals.globalPromos));
      } else {
        localStorage.removeItem('promosActivas');
      }
      FacturacionComponent.updateUserStatus.next(true);
      this.productoService.updateProducto(producto).subscribe(data => {
        this.messageGrowlService.notify('info', 'Información', "Se ha deshabilitado la promoción!");
        FacturacionComponent.updateUserStatus.next(true);
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', "Algo salió mal!");
      })
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', "Algo salió mal!");
    })
  }

  onRowSelect(event) {
    //Update productos
    this.productoService.getByNombre(event.data.nombre).subscribe(data => {
      let aux = {
        cant_existente: event.data.cant_existente,
        nombre: event.data.nombre,
        precio_costo: event.data.precio_costo,
        precio_promo: event.data.precio_promo,
        precio_venta: event.data.precio_venta,
        selectedPromo: event.data.selectedPromo
      }
      data[0].promocion = aux;
      const producto = {
        _id: data[0]._id,
        nombre: data[0].nombre,
        precio_costo: parseFloat(data[0].precio_costo),
        precio_venta: parseFloat(data[0].precio_venta),
        utilidad: parseFloat(data[0].utilidad),
        cant_existente: data[0].cant_existente,
        contenido: parseFloat(data[0].contenido),
        path: data[0].path,
        subproductoV: data[0].subproductoV,
        id_tipo_producto: data[0].id_tipo_producto,
        promocion: [data[0].promocion]
      };
      myGlobals.addElementPromo(producto);
      console.log(myGlobals.globalPromos);
      localStorage.removeItem('promosActivas');
      localStorage.setItem('promosActivas', JSON.stringify(myGlobals.globalPromos));
      FacturacionComponent.updateUserStatus.next(true)
      this.productoService.updateProducto(producto).subscribe(data => {
        this.messageGrowlService.notify('info', 'Información', "Se ha habilitado una promoción!");
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', "Algo salió mal!");
      })
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', "Algo salió mal!");
    })
  }

  handleChange(e) {
    this.mapProdShow = []
    for (let entry of this.mapP) {
      if (entry.id_tipo_producto.localeCompare(this.mapTP[e.index]._id) === 0) {
        let aux = {
          nombre: entry.nombre,
          cant_existente: this.decimalPipe.transform(entry.cant_existente, '1.2-2'),
          precio_costo: this.decimalPipe.transform(entry.precio_costo, '1.2-2'),
          precio_venta: this.decimalPipe.transform(entry.precio_venta, '1.2-2'),
          selectedPromo: this.lstPromociones[0].nombre,
          precio_promo: this.decimalPipe.transform(entry.precio_venta, '1.2-2'),
        };
        this.mapProdShow.push(aux);
      }
    }
  }

  searchById(id, myArray) {
    for (let entry of myArray) {
      if (entry._id === id) {
        return entry.desc_tipo_cliente;
      }
    }
  }

  searchByName(name, myArray) {
    for (let entry of myArray) {
      if (entry.desc_tipo_cliente === name) {
        return entry._id;
      }
    }
  }

  onChangeOpen(event) {
    this.cardNumber = this.cardNumber.toLowerCase();
    let finalChar = this.cardNumber.slice(-1)
    if (this.cardNumber.length == 9) {
      if (finalChar.localeCompare("_") == 0) {
        this.checkCard();
      }
    } else {
      this.flagCaUsFound = false;
      this.flagCardFound = false;
      document.getElementById('basic-addon2').style.backgroundColor = '#FF4B36';//soft red
      document.getElementById('basic-addon1').style.backgroundColor = '';//default color
    }
  }

  checkCard() {
    if (this.cardNumber.length == 9) {
      this.activeCardsService.searchByCardActive(this.cardNumber).subscribe(data => {
        if (data.length > 0) {
          this.messageGrowlService.notify('warn', 'Advertencia', 'Esta tarjeta ya se ecuentra activa!');
          this.flagCaUsFound = false;
          this.flagCardFound = false;
          document.getElementById('basic-addon2').style.backgroundColor = '#FF4B36';//soft red
          document.getElementById('basic-addon1').style.backgroundColor = '';//default color
        } else {
          this.tarjetaService.getByNumero(this.cardNumber).subscribe(data => {
            if (data.length > 0) {
              this.flagCardFound = true;
              this.limCons = data[0].limite;
              document.getElementById('basic-addon1').style.backgroundColor = '#8FC941';//soft green
              document.getElementById('basic-addon2').style.backgroundColor = '';//default color
              setTimeout(function () {
                document.getElementById('cantMujeres').focus();
              }, 0)
              if (this.flagCardFound && this.flagUserFound) {
                this.flagCaUsFound = true;
              } else {
                this.flagCaUsFound = false;
              }
            } else {
              this.flagCaUsFound = false;
              this.flagCardFound = false;
              document.getElementById('basic-addon2').style.backgroundColor = '#FF4B36';//soft red
              document.getElementById('basic-addon1').style.backgroundColor = '';//default color
            }
          }, err => {
            console.log(err);
          })
        }
      }, err => {
        console.log(err);
      });
    }
  }

  onChangePassLength($event) {

    this.nfLael = "";
    this.flagUserFound = false;
    this.cardNumber = "";
    this.flagCaUsFound = false;

    document.getElementById('basic-addonPass1').style.backgroundColor = '';
  }

  searchPass() {
    this.clienteService.getByCedula(this.cedula).subscribe(data => {
      if (data.length > 0) {
        this.searchUser = data[0];
        document.getElementById('basic-addonPass1').style.backgroundColor = '#8FC941';
        this.flagUserFound = true;
      } else {
        this.flagCaUsFound = false;
        this.nfLael = "Cliente no encontrado.";
        document.getElementById("basic-addonPass1").style.backgroundColor = "#FF4B36";
        this.flagUserFound = false;
        this.cardNumber = "";
      }
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }

  onChangeCILength($event) {
    if (this.cedula.length == 0) {
      document.getElementById('basic-addon3').style.backgroundColor = '';
      this.nfLael = "";
      this.flagUserFound = false;
      document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';
      document.getElementById('basic-addon2').style.backgroundColor = '#f8f5f0';
      this.cardNumber = "";
      this.flagCaUsFound = false;
    } else {
      if (this.cedula.length != 10) {
        this.nfLael = "";
        document.getElementById("basic-addon3").style.backgroundColor = "#FF4B36";
        this.flagUserFound = false;
        document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';
        document.getElementById('basic-addon2').style.backgroundColor = '#f8f5f0';
        this.cardNumber = "";
        this.flagCaUsFound = false;
      }
      if (this.cedula.length == 10) {
        if (this.checked === true) {
          if (!this.validateService.validarRucCedula(this.cedula)) {
            this.messageGrowlService.notify('error', 'Error', 'Cedula Inválida!');
          } else {
            this.checkClient();
          }
        } else {
          this.checkClient();
        }
      }
    }
  }

  checkClient() {
    let a = undefined;
    this.activeCardsService.searchByCIActive(this.cedula).subscribe(data => {
      a = data[0];
      if (a === undefined) {
        this.searchUser = this.clientes.find(x => x.cedula === this.cedula);
        if (this.searchUser !== undefined) {
          this.searchUser.id_tipo_cliente = this.searchById(this.searchUser.id_tipo_cliente, this.tipo_clientes);
          document.getElementById('basic-addon3').style.backgroundColor = '#8FC941';
          this.flagUserFound = true;
          this.checkCard();
          setTimeout(function () {
            document.getElementById('numero').focus();
          }, 0)
          if (this.flagCardFound && this.flagUserFound) {
            this.flagCaUsFound = true;
          } else {
            this.flagCaUsFound = false;
          }
        } else {
          this.flagCaUsFound = false;
          this.nfLael = "Cliente no encontrado.";
          document.getElementById("basic-addon3").style.backgroundColor = "#FF4B36";
          this.flagUserFound = false;
          this.cardNumber = "";
        }
      } else {
        this.messageGrowlService.notify('warn', 'Advertencia', 'El usuario ingresado ya registra un tarjeta activa!');
      }
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }

  onChangeCI() {
    if (this.cedula.length != 10) {
      document.getElementById("ciA").style.borderColor = "#FF4B36";
      this.validCI = false;
    } else {
      if (this.checked === true) {
        if (!this.validateService.validarRucCedula(this.cedula)) {
          this.messageGrowlService.notify('error', 'Error', 'Cedula Inválida!');
          document.getElementById("ciA").style.borderColor = "#FF4B36";
          this.validCI = false;
        } else {
          document.getElementById("ciA").style.borderColor = "#5ff442";
          this.checkClient1();
        }
      } else {
        this.checkClient1();
      }
    }
  }

  checkClient1() {
    this.searchUser = this.clientes.find(x => x.cedula === this.cedula);
    if (this.searchUser === undefined) {
      this.validCI = true;
    } else {
      this.validCI = false;
      this.messageGrowlService.notify('warn', 'Advertencia', 'El cliente ya ha sido ingresado!');
    }
  }

  onChangeNombre($event) {
    this.nombre = this.nombre.trim();
    this.nombre = this.formatterService.toTitleCase(this.nombre);
  }

  onChangeApellido($event) {
    this.apellido = this.apellido.trim();
    this.apellido = this.formatterService.toTitleCase(this.apellido);
  }

  onChangeEmail($event) {
    this.correo = this.correo.toLocaleLowerCase();
    if (this.validateService.validateEmail(this.correo)) {
      document.getElementById("correo").style.borderColor = "#5ff442";
    }
    else {
      document.getElementById("correo").style.borderColor = "#FF4B36";
    }
  }

  onChangeDescAdd($event) {
    this.descTarjeta = this.descTarjeta.trim();
    this.descTarjeta = this.descTarjeta.toLowerCase();
  }

  onChangeDescUpdate($event) {
    this.updateTarjeta.descripcion = this.updateTarjeta.descripcion.trim();
    this.updateTarjeta.descripcion = this.updateTarjeta.descripcion.toLowerCase();
  }

  doDate() {
    /*console.log(this.validateService.getDateTimeStamp());
    console.log(this.validateService.getDateTimeStamp());*/
    let aux = {
      fecha_ini: '2018-03-20T13:01:00',
      fecha_fin: '2018-03-20T17:26:32',
      cajero: '5a30a66f747bd11f78a51330'
    };
    this.facturaService.getByDateCajero(aux).subscribe(data => {
      console.log(data)
    }, err => {
      console.log(err);
    });

    /*this.facturaService.getAll().subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    })*/
  }

  insertClientCard() {
    let activeCard = {
      idFactura: '',
      ci: '',
      nombre: '',
      cardNumber: '',
      cantMujeres: 0,
      cantHombres: 0,
      egresoMujeres: 0,
      egresoHombres: 0,
      ingresoMujeres: 0,
      ingresoHombres: 0,
      abono: 0,
      fechaHora: this.validateService.getDateTimeStamp(),
      productosV: this.loadProductosCover(this.lstResumenOpen),
      estado: 1
    };
    //this.searchUser.id_tipo_cliente = this.searchByName(this.searchUser.id_tipo_cliente, this.tipo_clientes);
    activeCard.ci = this.searchUser.cedula;
    activeCard.cardNumber = this.cardNumber;
    //Se deberia recorrer lista de covers, no directamente del spinner
    console.log(this.lstResumenOpen);
    for (let entry of this.lstResumenOpen) {
      if (entry.genero.localeCompare('Mujer') === 0) {
        activeCard.cantMujeres += entry.cantidad;
      } else {
        activeCard.cantHombres += entry.cantidad;
      }
    }
    if (this.lstResumenOpen.length > 0) {
      //set factura & detalle factura
      let detalle: any = [];
      detalle = this.formatDetalleFactura(this.lstResumenOpen);
      this.updateStockProductos(detalle);
      let newFactura = {
        cedula: this.searchUser.cedula,
        num_factura: '',
        num_autorizacion: '',
        ruc: '',
        nombre: this.searchUser.nombre + ' ' + this.searchUser.apellido,
        telefono: this.searchUser.telefono,
        direccion: 'Riobamba',
        fecha_emision: '',
        detalleFacturaV: detalle,
        formaPago: [],
        //cajero: this.us.id
        cajero: null
      }
      activeCard.nombre = newFactura.nombre;
      this.setDvInsertCard();
      this.facturaService.register(newFactura).subscribe(data => {
        activeCard.idFactura = data._id;
        this.insertActiveCard(activeCard);
        this.messageGrowlService.notify('info', 'Información', 'Tarjeta ingresada!');
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
      })

    } else {
      this.messageGrowlService.notify('error', 'Error', 'No se han ingresado covers!');
    }
  }

  formatDetalleFactura(lstResumen) {
    let lst = [];
    for (let entry of lstResumen) {
      let aux = {
        fecha: this.validateService.getDateTimeStamp(),
        cantidad: entry.cantidad,
        descripcion: entry.nombre,
        total: entry.precio,
        precio_venta: entry.precio,
        vendedor: this.us.idPersonal,
        promocion: [{ 'tipo': 'cover' }]
      }
      //Insert productos promo-cover
      lst.push(aux);
      if (entry.producto.length > 0) {
        for (let prod of entry.producto) {
          let aux = {
            fecha: this.validateService.getDateTimeStamp(),
            cantidad: prod.cantidad,
            descripcion: prod.label,
            total: 0,
            precio_venta: 0,
            vendedor: this.us.id,
            promocion: prod.promocion
          }
          lst.push(aux);
        }
      }
    }
    return lst;
  }

  loadProductosCover(lstResumen) {
    let vec: any = [];
    for (let entry of lstResumen) {
      if (entry.producto.length > 0) {
        let a = entry.cantidad;
        if (entry.genero === 'Mujer') {
          let index = this.lstCovers.findIndex(i => i.nombre === entry.nombre);
          if (this.lstCovers[index].productoMujeres.length > 0) {
            let b = this.lstCovers[index].numMujeres;
            let cant = a / b;
            for (let el of this.lstCovers[index].productoMujeres) {
              let cantProd = el.cantidad * cant;
              let prod = el.value;
              let aux = { cantidad: cantProd, producto: prod, despachado: 'No' };
              vec.push(aux);
            }
          }
        } else {
          let index = this.lstCovers.findIndex(i => i.nombre === entry.nombre);
          if (this.lstCovers[index].productoHombres.length > 0) {
            let b = this.lstCovers[index].numHombres;
            let cant = a / b;
            for (let el of this.lstCovers[index].productoHombres) {
              let cantProd = el.cantidad * cant;
              let prod = el.value;
              let aux = { cantidad: cantProd, producto: prod, despachado: 'No' };
              vec.push(aux);
            }
          }
        }
      }
    }
    return vec;
  }

  updateStockProductos(lstResumen) {
    let newList = this.validateService.formatSailsStock(lstResumen);
    if (newList.length > 0) {
      for (let entry of newList) {
        this.productoService.getByNombre(entry.descripcion).subscribe(data => {
          if (data.length > 0) {
            data[0].cant_existente = parseFloat(data[0].cant_existente);
            data[0].cant_existente -= entry.cantidad;
            this.productoService.updateProducto(data[0]).subscribe(data => {
              //console.log('success');
            }, err => {
              console.log(err);
            });
          }
        }, err => {
          console.log(err);
        });
      }
    }
  }

  setDvInsertCard() {
    this.flagUserFound = false;
    this.flagCardFound = false;
    this.nfLael = '';
    this.cardNumber = '';
    this.cedula = '';
    this.cantMujeres = 0;
    this.cantHombres = 0;
    document.getElementById("basic-addon3").style.backgroundColor = '';
    document.getElementById("basic-addon1").style.backgroundColor = '';
    document.getElementById("basic-addon2").style.backgroundColor = '';
    document.getElementById("basic-addon4").style.backgroundColor = '';
    this.lstResumenOpen = [];
    this.selectedCoverM = this.lstCoversM[0];
    this.selectedCoverH = this.lstCoversH[0];
  }

  insertActiveCard(activeCard) {
    this.activeCardsService.register(activeCard).subscribe(data => {
      console.log(data)
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }

  onChangeAddT($event) {
    this.cardNumberGT = this.cardNumberGT.toLowerCase();
    if (this.cardNumberGT.length === 9) {
      if (this.cardNumberGT.charAt(0).localeCompare('ñ') == 0 && this.cardNumberGT.charAt(8).localeCompare('_') == 0) {
        let existingCard = this.lstCards.find(x => x.numero === this.cardNumberGT);
        if (existingCard === undefined) {
          this.flagCN = true;
          document.getElementById('basic-addon7').style.backgroundColor = '#8FC941';
          document.getElementById('basic-addon8').style.backgroundColor = '#f8f5f0';
        } else {
          this.messageGrowlService.notify('warn', 'Advertencia', 'La tarjeta ya fue ingresada!');
        }
      } else {
        this.flagCN = false;
        document.getElementById("basic-addon8").style.backgroundColor = "#FF4B36";
        document.getElementById('basic-addon7').style.backgroundColor = '#f8f5f0';
      }
    } else {
      this.flagCN = false;
      document.getElementById("basic-addon8").style.backgroundColor = "#FF4B36";
      document.getElementById('basic-addon7').style.backgroundColor = '#f8f5f0';
    }
  }

  onChangeAddTU($event) {
    if (this.cardNumberGT.length === 9) {
      if (this.cardNumberGT.charAt(0).localeCompare('ñ') == 0 && this.cardNumberGT.charAt(8).localeCompare('_') == 0) {
        this.flagCN = true;
        document.getElementById('basic-addon9').style.backgroundColor = '#8FC941';
        document.getElementById('basic-addon10').style.backgroundColor = '#f8f5f0';
      } else {
        this.flagCN = false;
        document.getElementById("basic-addon10").style.backgroundColor = "#FF4B36";
        document.getElementById('basic-addon9').style.backgroundColor = '#f8f5f0';
      }
    } else {
      this.flagCN = false;
      document.getElementById("basic-addon10").style.backgroundColor = "#FF4B36";
      document.getElementById('basic-addon9').style.backgroundColor = '#f8f5f0';
    }
  }

  changeTC() {
    console.log(this.selectedTipoTarjeta)
    if (this.selectedTipoTarjeta.localeCompare('VIP')) {
      this.flagTC = true;
    } else {
      this.flagTC = false;
    }
  }

  changeTCU() {
    if (this.updateTarjeta.tipo.localeCompare('VIP')) {
      this.flagTCU = true;
    } else {
      this.flagTCU = false;
    }
  }

  changeTC1() {
    console.log(this.selectedClientGP)
    /*if (this.selectedTipoTarjeta.localeCompare('VIP')) {
      this.flagTC = true;
    } else {
      this.flagTC = false;
    }*/
  }

  setCursorAddT() {
    document.getElementById('basic-addon7').style.backgroundColor = '#f8f5f0';
    document.getElementById('basic-addon8').style.backgroundColor = '#f8f5f0';
    this.cardNumberGT = "";
    this.descTarjeta = "";
    this.limiteConsumo = this.limite;
    this.flagTC = true;
    setTimeout(function () {
      document.getElementById('numeroGT').focus();
    }, 0)
  }

  setCursorUpdateT() {
    document.getElementById('basic-addon9').style.backgroundColor = '#f8f5f0';
    document.getElementById('basic-addon10').style.backgroundColor = '#f8f5f0';
    setTimeout(function () {
      document.getElementById('limiteU').focus();
      console.log()
    }, 0)
  }

  filterCardCI(clientesC, lstCardCI) {
    for (let entry of lstCardCI) {
      clientesC = clientesC.filter(function (obj) {
        return obj.value.cedula !== entry.cedula;
      });
    }
    return clientesC;
  }

  onUpdateT(event: any) {
    if (event.data.tipo.localeCompare('VIP')) {
      this.flagTCU = true;
    } else {
      this.flagTCU = false;
    }
    this.updateTarjeta = event.data;
    this.oldCard = event.data;
    this.lstAddCardCI1 = [];
    for (let entry of this.lstAddCardCI) {
      this.lstAddCardCI1.push(entry);
    }
    let b = this.clientes.find(x => x.cedula === event.data.cedula);
    if (b !== undefined) {
      let aux = {
        'value': {
          'apellido': b.apellido,
          'cedula': b.cedula,
          'correo': b.correo,
          'fecha_nacimiento': b.fecha_nacimiento,
          'id_tipo_cliente': b.id_tipo_cliente,
          'nombre': b.nombre,
          'sexo': b.sexo,
          'telefono': b.telefono,
          '_id': b._id
        },
        'label': b.nombre + ' ' + b.apellido
      }
      this.lstAddCardCI1.push(aux);
      this.selectedClientGP = aux.value;
    }
  }

  totalCovers = 0;
  factorMult = 0;
  addCoverM() {

    let cantTotalPersonas = this.cantMujeres;
    for (let entry of this.lstResumenOpen) {
      cantTotalPersonas += entry.cantidad;
    }

    if (cantTotalPersonas <= this.numMax) {
      if (this.cantMujeres > 0) {
        let aux = {
          nombre: this.selectedCoverM.nombre,
          cantidad: this.cantMujeres,
          genero: 'Mujer',
          producto: this.selectedCoverM.productoMujeres,
          precio: 0
        }
        this.factorMult = this.cantMujeres / parseFloat(this.selectedCoverM.numMujeres);
        aux.precio = this.factorMult * parseFloat(this.selectedCoverM.precioMujeres);
        this.totalCovers = 0;
        var index = this.lstResumenOpen.findIndex(i => i.nombre === aux.nombre && i.genero === aux.genero);
        if (index == -1) {
          this.lstResumenOpen = [...this.lstResumenOpen, aux];
        } else {
          this.lstResumenOpen[index].precio = parseFloat(this.lstResumenOpen[index].precio)
          this.lstResumenOpen[index].cantidad += aux.cantidad;
          this.lstResumenOpen[index].precio += aux.precio;
        }
        document.getElementById('coverM').style.borderColor = '';
        this.totalCovers = this.calcTotalCovers(this.lstResumenOpen);
      } else {
        document.getElementById('coverM').style.borderColor = '#FF4B36';
        this.messageGrowlService.notify('error', 'Error', 'Selecciona la cantidad de mujeres!');
      }
    } else {
      this.messageGrowlService.notify('error', 'Error', 'La cantidad máxima de personas por tarjeta es de: ' + this.numMax);
    }
  }

  addCoverH() {

    let cantTotalPersonas = this.cantHombres;
    for (let entry of this.lstResumenOpen) {
      cantTotalPersonas += entry.cantidad;
    }

    if (cantTotalPersonas <= this.numMax) {
      if (this.cantHombres > 0) {
        let aux = {
          nombre: this.selectedCoverH.nombre,
          cantidad: this.cantHombres,
          genero: 'Hombre',
          producto: this.selectedCoverH.productoHombres,
          precio: 0
        }

        this.factorMult = this.cantHombres / parseFloat(this.selectedCoverH.numHombres);
        aux.precio = this.factorMult * parseFloat(this.selectedCoverH.precioHombres);

        this.totalCovers = 0
        var index = this.lstResumenOpen.findIndex(i => i.nombre === aux.nombre && i.genero === aux.genero);
        if (index == -1) {
          this.lstResumenOpen = [...this.lstResumenOpen, aux];
        } else {
          this.lstResumenOpen[index].precio = parseFloat(this.lstResumenOpen[index].precio)
          this.lstResumenOpen[index].cantidad += aux.cantidad;
          this.lstResumenOpen[index].precio += aux.precio;
        }
        document.getElementById('coverH').style.borderColor = '';
        this.totalCovers = this.calcTotalCovers(this.lstResumenOpen);
      } else {
        document.getElementById('coverH').style.borderColor = '#FF4B36';
        this.messageGrowlService.notify('error', 'Error', 'Selecciona la cantidad de hombres!');
      }
    } else {
      this.messageGrowlService.notify('error', 'Error', 'La cantidad máxima de personas por tarjeta es de: ' + this.numMax);
    }

  }

  calcTotalCovers(lstCovers) {
    let total = 0;
    for (let entry of lstCovers) {
      total += parseFloat(entry.precio);
    }
    return total;
  }

  onChangeSelectCoverM($event) {
    this.stepMujeres = parseFloat(this.selectedCoverM.numMujeres);
    this.cantMujeres = parseFloat(this.selectedCoverM.numMujeres);
  }

  onChangeSelectCoverH($event) {
    this.stepHombres = parseFloat(this.selectedCoverH.numHombres);
    this.cantHombres = parseFloat(this.selectedCoverH.numHombres);
  }

  deleteRowCover(index) {
    this.totalCovers = 0;
    this.lstResumenOpen.splice(index, 1);
    this.lstResumenOpen = [...this.lstResumenOpen];
    this.totalCovers = this.calcTotalCovers(this.lstResumenOpen);
  }

  lstCoversM: any[];
  lstCoversH: any[];
  selectedCoverME: any;
  selectedCoverHE: any;
  public ngOnInitCards() {

    this.tipoClienteService.getAll().subscribe(tc => {
      if (tc.length > 0) {
        if (tc[0].tipoClienteV.length > 0) {
          for (let entry of tc[0].tipoClienteV) {
            let aux = { nombre: entry.nombre };
            this.tipo_clientes.push(aux);
          }
          this.selected_tipo_cliente = this.tipo_clientes[0]
        }
      }
      this.clienteService.getAll().subscribe(c => {
        this.clientes = c;
        let i = 0;
        this.clientesC = [];
        for (let entry of c) {
          let aux = {
            'value': {
              'apellido': entry.apellido,
              'cedula': entry.cedula,
              'correo': entry.correo,
              'fecha_nacimiento': entry.fecha_nacimiento,
              'id_tipo_cliente': entry.id_tipo_cliente,
              'nombre': entry.nombre,
              'sexo': entry.sexo,
              'telefono': entry.telefono,
              '_id': entry._id
            },
            'label': entry.nombre + ' ' + entry.apellido,
          }
          this.clientesC[i] = aux;
          i++;
        }
        this.tarjetaService.getAll().subscribe(t => {
          this.lstCards = t;
          this.sourceT.load(this.lstCards);
          this.lstAddCardCI = this.filterCardCI(this.clientesC, this.lstCards);
        }), err => {
          console.log(err);
          return false;
        }
      })
    },
      err => {
        console.log(err);
        return false;
      });
    this.coverService.getAll().subscribe(data => {
      this.lstCovers = data;
      this.lstCoversM = [];
      this.lstCoversH = [];

      for (let entry of this.lstCovers) {
        if (entry.numMujeres > 0) {
          this.lstCoversM = [...this.lstCoversM, entry];
        }
        if (entry.numHombres > 0) {
          this.lstCoversH = [...this.lstCoversH, entry];
        }
      }

      if (this.lstCovers.length > 0) {
        this.selectedCoverM = this.lstCoversM[0];
        this.selectedCoverH = this.lstCoversH[0];
        //Tab Egresos
        this.selectedCoverME = this.lstCoversM[0];
        this.selectedCoverHE = this.lstCoversH[0];
      }
      this.stepMujeres = parseFloat(this.selectedCoverM.numMujeres);
      this.cantMujeres = parseFloat(this.selectedCoverM.numMujeres);
      this.stepHombres = parseFloat(this.selectedCoverH.numHombres);
      this.cantHombres = parseFloat(this.selectedCoverH.numHombres);

      this.stepMujeresE = parseFloat(this.selectedCoverME.numMujeres);
      this.cantSalenM = parseFloat(this.selectedCoverME.numMujeres);
      this.stepHombresE = parseFloat(this.selectedCoverHE.numHombres);
      this.cantSalenH = parseFloat(this.selectedCoverHE.numHombres);

    }, err => {
      console.log(err);
    })
  }

  ngOnInitClient() {

    this.telefono = '';
    this.nombre = '';
    this.apellido = '';
    this.correo = '';
    this.sexo = 'M'
    var initial = new Date(this.getDate()).toLocaleDateString().split("/");
    this.fecha_nacimiento = [initial[0], initial[1], initial[2]].join('/');
    this.selected_tipo_cliente = '';
  }

  searchLstResumen(nombre) {
    let a = this.lstResumenOpen.filter(function (obj) {
      return obj.nombre.localeCompare(nombre) === 0;
    });
    return a[0];
  }

  /*TAB CLOSE*/
  openFP(): void {
    this.showDialogFP = true;
    if (this.totalPagar !== 0) {
      this.colorConsCero = 'ui-state-highlight ui-message ui-corner-all';
      //this.colorConsCero = 'ui-state-error-text ui-message ui-corner-all';
      this.textoConsumo = 'Consumo Normal';
      this.flagConsCero = false;
    } else {
      this.fpEfectivo = 0;
      this.fpTarjeta = 0;
      this.fpPorCobrar = 0;
      this.fpCheque = 0;
    }
  }

  onChangeFPE($event) {
    if (this.fpEfectivo + this.fpTarjeta + this.fpPorCobrar + this.fpCheque > parseFloat(this.totalPagar)) {
      this.fpEfectivo = 0;
      setTimeout(function () {
        let v = document.getElementById('fpEfectivo');
        if (v != null) {
          v.click();
          this.fpEfectivo = 0;
        }
      }, 0);
      this.flagErrorFP = true;
      this.campoFP = 'Efectivo';
      this.maximoFP = this.totalPagar - (this.fpEfectivo + this.fpTarjeta + this.fpPorCobrar + this.fpCheque);
    } else {
      this.flagErrorFP = false;
    }
  }

  onChangeFPT($event) {
    if (this.fpEfectivo + this.fpTarjeta + this.fpPorCobrar + this.fpCheque > parseFloat(this.totalPagar)) {
      this.fpTarjeta = 0;
      setTimeout(function () {
        let v = document.getElementById('fpTarjeta');
        if (v != null) {
          v.click();
          this.fpTarjeta = 0;
        }
      }, 0);
      this.campoFP = 'Tarjeta de Crédito';
      this.maximoFP = this.totalPagar - (this.fpEfectivo + this.fpTarjeta + this.fpPorCobrar + this.fpCheque);
      this.flagErrorFP = true;
    } else {
      this.flagErrorFP = false;
    }
  }

  onChangeFPC($event) {
    if (this.fpEfectivo + this.fpTarjeta + this.fpPorCobrar + this.fpCheque > parseFloat(this.totalPagar)) {
      this.fpPorCobrar = 0;
      setTimeout(function () {
        let v = document.getElementById('fpPorCobrar');
        if (v != null) {
          v.click();
          this.fpPorCobrar = 0;
        }
      }, 0);
      this.campoFP = 'Crédito Directo';
      this.maximoFP = this.totalPagar - (this.fpEfectivo + this.fpTarjeta + this.fpPorCobrar + this.fpCheque);
      this.flagErrorFP = true;
    } else {
      this.flagErrorFP = false;
    }
  }

  onChangeFPCH($event) {
    if (this.fpEfectivo + this.fpTarjeta + this.fpPorCobrar + this.fpCheque > parseFloat(this.totalPagar)) {
      this.fpCheque = 0;
      setTimeout(function () {
        let v = document.getElementById('fpCheque');
        if (v != null) {
          v.click();
          this.fpCheque = 0;
        }
      }, 0);
      this.campoFP = 'Cheque';
      this.maximoFP = this.totalPagar - (this.fpEfectivo + this.fpTarjeta + this.fpPorCobrar + this.fpCheque);
      this.flagErrorFP = true;
    } else {
      this.flagErrorFP = false;
    }
  }

  insertRuc($event) {
    this.flagInsertRuc = !this.flagInsertRuc;
    if (!this.selectedRucFactura) {
      this.rucFactura = '9999999999';
      this.telefonoS = '9999999999';
      this.nombreS = 'Consumidor Final';
      this.direccionS = 'Riobamba';
      this.flagCheckVenta = true;
      this.flagFP = false;
      document.getElementById("addonRUC1").style.color = '';
      document.getElementById("addonRUC2").style.color = '';
    } else {
      this.flagFP = true;
      if (this.searchUserS !== undefined) {
        this.rucFactura = this.searchUserS.ci;
        this.nombreS = this.searchUserS.nombre;
      }
      this.checkCiRuc();
      setTimeout(function () {
        document.getElementById('inputCiRuc').focus();
      }, 0)
    }
  }

  setDefaultValues() {
    this.rucFactura = '9999999999';
    this.telefonoS = '9999999999';
    this.nombreS = 'Consumidor Final';
    this.direccionS = 'Riobamba';
    this.flagFP = false;
    document.getElementById("pnlFp").style.borderColor = "";
    document.getElementById("inputCiRuc").style.borderColor = "";
    document.getElementById("nombreS").style.borderColor = "";
    document.getElementById("telefonoS").style.borderColor = "";
    document.getElementById("direccionS").style.borderColor = "";
  }

  setDefaultValues1() {
    document.getElementById('addonCnS2').style.backgroundColor = '';
    document.getElementById('addonCnS1').style.backgroundColor = '';
    this.flagConfirmFP = true;
    this.flagCardSFound = false;
    this.nfLaelS = '';
    this.lstConsumo = [];
    this.totalPagar = 0;
  }

  checkCiRuc() {
    if (this.rucFactura.length != 10) {
      document.getElementById("addonRUC2").style.color = '#FF4B36';
      document.getElementById("addonRUC1").style.color = '';
      this.flagCheckVenta = false;
    }
    if (this.rucFactura.length != 13) {
      document.getElementById("addonRUC2").style.color = "#FF4B36";
      document.getElementById("addonRUC1").style.color = '';
      this.flagCheckVenta = false;
    }
    if (this.rucFactura.length == 10 || this.rucFactura.length == 13) {
      if (!this.validateService.validarRucCedula(this.rucFactura)) {
        this.messageGrowlService.notify('error', 'Error', 'Cedula/Ruc Inválido!');
        document.getElementById("addonRUC2").style.color = "#FF4B36";
        document.getElementById("addonRUC1").style.color = '';
        this.flagCheckVenta = false;
      } else {
        document.getElementById("addonRUC1").style.color = "#5ff442";
        document.getElementById("addonRUC2").style.color = '';
        this.flagCheckVenta = true;
      }
    }
  }

  onChangeClose($event) {
    this.cardNumberS = this.cardNumberS.toLowerCase();
    let finalChar = this.cardNumberS.slice(-1)
    if (this.cardNumberS.length == 9) {
      if (finalChar.localeCompare("_") == 0) {
        this.checkActiveCard(this.cardNumberS);
      }
    } else {
      document.getElementById('addonCnS2').style.backgroundColor = '#FF4B36';
      document.getElementById('addonCnS1').style.backgroundColor = '';
      this.flagConfirmFP = true;
      this.flagCardSFound = false;
      this.nfLaelS = '';
      this.lstConsumo = [];
      this.totalPagar = 0;
    }
  }

  checkActiveCard(card) {
    this.activeCardsService.searchByCardActive(card).subscribe(data => {
      console.log(data[0]);
      if (data.length > 0) {
        this.searchUserS = {
          ci: data[0].ci,
          nombre: data[0].nombre,
          cantMujeres: data[0].cantMujeres,
          cantHombres: data[0].cantHombres,
          egresoMujeres: data[0].egresoMujeres,
          egresoHombres: data[0].egresoHombres,
          ingresoMujeres: data[0].ingresoMujeres,
          ingresoHombres: data[0].ingresoHombres,
          idFactura: data[0].idFactura
        }
        this.messageGrowlService.notify('info', 'Información', 'Tarjeta Encontrada!');
        this.flagConfirmFP = false;
        this.flagCardSFound = true;
        document.getElementById('addonCnS2').style.backgroundColor = '';
        document.getElementById('addonCnS1').style.backgroundColor = '#8FC941';//green
        this.searchConsumo(this.searchUserS.idFactura);
      } else {
        this.flagConfirmFP = true;
        this.flagCardSFound = false;
        this.nfLaelS = 'Tarjeta no ingresada.';
        this.lstConsumo = [];
        this.totalPagar = 0;
        this.messageGrowlService.notify('warn', 'Advertencia', 'Tarjeta No Encontrada!');
        document.getElementById('addonCnS2').style.backgroundColor = '#FF4B36';//soft red
        document.getElementById('addonCnS1').style.backgroundColor = '';//default color
      }
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Ingresa un número de personas!');
    })
  }

  searchConsumo(idFactura) {
    this.facturaService.getById(idFactura).subscribe(data => {
      console.log(data)
      this.lstConsumo = [];
      this.totalPagar = 0;
      if (data.length > 0) {
        for (let entry of data[0].detalleFacturaV) {
          let aux = {
            descripcion: entry.descripcion,
            precio_venta: entry.precio_venta,
            total: entry.total,
            cantidad: entry.cantidad,
            fecha: entry.fecha
          }
          this.totalPagar += parseFloat(aux.total);
          this.lstConsumo.push(aux);
        }
      }
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }

  idTransaction;
  confirmarSalida() {
    const newFP = {
      ruc: this.rucFactura,
      nombre: this.nombreS,
      telefono: this.telefonoS,
      direccion: this.direccionS,
      fecha_emision: this.validateService.getDateTimeStamp(),
      cajero: this.us.idPersonal,
      formaPago: {
        efectivo: this.fpEfectivo,
        tarjeta: this.fpTarjeta,
        credito: this.fpPorCobrar,
        cheque: this.fpCheque
      },
      totalPagar: parseFloat(this.totalPagar)
    }
    this.fillFP();
    //console.log(this.totalPagar)
    //Required fields
    if (!this.selectedRucFactura) {
      if (!this.validateService.validateFormaPago(newFP)) {
        this.messageGrowlService.notify('error', 'Error', 'Formas de Pago < Total Esperado');
        return false;
      }
    } else {
      if (!this.validateService.validateFormaPago1(newFP)) {
        this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
        return false;
      }
    }

    this.activeCardsService.searchByCardActive(this.cardNumberS).subscribe(data => {
      //update tabla factura
      this.facturaService.getById(data[0].idFactura).subscribe(data1 => {
        this.idTransaction = data1[0]._id;
        let vecFP: any = [];
        vecFP.push(newFP.formaPago);
        data1[0].ruc = newFP.ruc;
        data1[0].nombre = newFP.nombre;
        data1[0].telefono = newFP.telefono;
        data1[0].direccion = newFP.direccion;
        data1[0].fecha_emision = newFP.fecha_emision;
        data1[0].cajero = newFP.cajero;
        data1[0].formaPago = vecFP;
        this.facturaService.update(data1[0]).subscribe(data2 => {
          //remove from active cards
          data[0].estado = 0;
          this.activeCardsService.update(data[0]).subscribe(data => {
            this.showDialogFP = false;
            //impresion
            if (newFP.totalPagar > 0) {
              this.printOrdenSalida();
            } else {
              this.printOrdenSalidaCero();
            }
            this.setDefaultValues();
            this.setDefaultValues1();

            this.messageGrowlService.notify('success', 'Éxito', 'Se ha relizado la venta exitosamente!');
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
          });
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
        });
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
      });
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    });

  }

  printFactura() {
    console.log(this.lstConsumo);
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    let html = `
    <html>
    <head>
      <style>
        @page { size: auto;  margin: 0mm;};
      </style>
    </head>
    <body onload="window.print();window.close()">${printContents}
    <br><br><br>
    <p style="font-family: Calibri; text-align:center">Documento sin valor tributario</p>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr><td style="padding-left: 20px">&nbsp;Cliente:</td><td>`+ this.nombreS + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;CI/RUC:</td><td>`+ this.rucFactura + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Teléfono:</td><td>`+ this.telefonoS + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Dirección:</td><td>`+ this.direccionS + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Cajero:</td><td>JFlores</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Fecha:</td><td>`+ this.validateService.getDateEs() + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Hora:</td><td>`+ this.validateService.getTimeEs() + `</td></tr>
    </table>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr colspan="4">====================================</tr>
      <thead>
            <th style="text-align:center;padding-left: 7px; font-weight: normal;">Cant.</th>
            <th style="text-align:left; font-weight: normal;">Detalle</th>
            <th style="text-align:left; font-weight: normal;">Pu.</th>
            <th style="text-align:left; font-weight: normal;">Total</th>
      </thead> 
      <td colspan="4">=========================================</td>
      <tbody>
        <tr>
          <td style="padding-left: 10px; text-align:center;">1</td>
          <td style="margin-right: -10px">Ron Bellows</td>
          <td style="margin-right: -10px">15.00</td>
          <td style="margin-right: -10px">15.00</td>
        </tr>
        for (let c of this.tipo_documentos){
          <tr>
          <td style="padding-left: 10px; text-align:center;">c.cantidad</td>
          <td>c.descripcion</td>
          <td>c.precio_venta</td>
          <td>c.total</td>
        </tr>
        }
      </tbody>
    </table>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr colspan="4">====================================</tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal 12% IVA:</td><td style="padding-right: 120px">0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal 0% IVA:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal Excento IVA:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Descuento:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;ICE:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;IVA 12%:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Propina:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Valor Total:</td><td>0.00</td></tr>
    </table>
    <td colspan="4">====================================</td>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr><td style="padding-left: 20px">&nbsp;Forma de pago:</td>
        <td>Efectivo</td><td style="text-align: right; padding-right: 20px">20.00</td>
      </tr>
      <tr><td style="padding-left: 20px">&nbsp;</td>
        <td>Tarjeta</td><td style="text-align: right; padding-right: 20px">10.00</td>
      </tr>
    </table>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr><td style="padding-left: 20px">&nbsp;Total items:</td><td style="padding-right: 120px">2</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Caja Nro.:</td><td>2</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Id. Transacción:</td><td style="font-size: 13px">5a8786bf49dd4d323c28d26a</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Impresor:</td><td>Epson TM-U220D</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Serie Nro.:</td><td>P3QF303046</td></tr>
      
    </table>
    <td colspan="4">====================================</td>
    <p style="font-family: Calibri; text-align:center; padding-left: 20px; padding-right: 20px">
      Revisa tu factura electrónica ingresando
      a la siguiente dirección:
      www.riobytes.com/managerbox<br>
      User: 0502926819<br>
      Pass: 0502926819<br>
      Gracias por tu compra
    </p>
    <td colspan="4">====================================</td>

    </body>

    </html>`;
    popupWin.document.write(html);
    popupWin.document.close();
  }

  formasPagoFact: any[];
  fillFP() {
    this.formasPagoFact = [];
    if (this.fpEfectivo > 0) {
      let aux = { desc: 'Efectivo', valor: this.fpEfectivo };
      this.formasPagoFact.push(aux);
    }
    if (this.fpTarjeta > 0) {
      let aux = { desc: 'Tarjeta', valor: this.fpTarjeta };
      this.formasPagoFact.push(aux);
    }
    if (this.fpPorCobrar > 0) {
      let aux = { desc: 'Crédito', valor: this.fpPorCobrar };
      this.formasPagoFact.push(aux);
    }
    if (this.fpCheque > 0) {
      let aux = { desc: 'Cheque', valor: this.fpCheque };
      this.formasPagoFact.push(aux);
    }
  }

  printOrdenSalida() {
    this.fillFP();
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open(' ', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    let html = `
    <html>
    <head>
      <style>
        @page { size: auto;  margin: 0mm;};
      </style>
    </head>
    <body onload="window.print();window.close()">${printContents}
    <br><br><br>
    <p style="font-family: Calibri; text-align:center">Documento sin valor tributario</p>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr><td style="padding-left: 20px">&nbsp;Cliente:</td><td>`+ this.nombreS + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;CI/RUC:</td><td>`+ this.rucFactura + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Teléfono:</td><td>`+ this.telefonoS + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Dirección:</td><td>`+ this.direccionS + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Cajero:</td><td>`+ this.us.name + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Fecha:</td><td>`+ this.validateService.getDateEs() + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Hora:</td><td>`+ this.validateService.getTimeEs() + `</td></tr>
    </table>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr colspan="4">====================================</tr>
      <thead>
            <th width="10%" style="text-align:left; font-weight: normal; padding-left: 24px;">Cant.</th>
            <th width="50%" style="text-align:left; font-weight: normal; padding-left: 5px;">Detalle</th>
            <th width="20%" style="text-align:left; font-weight: normal;">Pu.</th>
            <th width="20%" style="text-align:left; font-weight: normal;">Total</th>
      </thead> 
      <td colspan="4">=========================================</td>
      <tbody>`;
    for (let c of this.lstConsumo) {
      html += `<tr><td style="text-align:left; padding-left: 26px;">` + c.cantidad + `</td>
          <td style="text-align:left; padding-left: 5px;">`+ this.slicePipe.transform(c.descripcion, 0, 13) + `</td>
          <td style="text-align:left;">`+ this.decimalPipe.transform(c.precio_venta, '1.2-2') + `</td>
          <td style="text-align:left;">`+ this.decimalPipe.transform(c.total, '1.2-2') + `</td></tr>`
    }
    html += ` </tbody>
    </table>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr colspan="4">====================================</tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal 12% IVA:</td><td style="text-align:right; padding-right: 20px;">`+ this.decimalPipe.transform(this.totalPagar / 1.12, '1.2-2') + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal 0% IVA:</td><td style="text-align:right; padding-right: 20px;">0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal Excento IVA:</td><td style="text-align:right; padding-right: 20px;">`+ this.decimalPipe.transform(this.totalPagar / 1.12, '1.2-2') + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal No Obj. IVA:</td><td style="text-align:right; padding-right: 20px;">0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Descuento:</td><td style="text-align:right; padding-right: 20px;">0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal:</td><td style="text-align:right; padding-right: 20px;">`+ this.decimalPipe.transform(this.totalPagar / 1.12, '1.2-2') + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;ICE:</td><td style="text-align:right; padding-right: 20px;">0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;IVA 12%:</td><td style="text-align:right; padding-right: 20px;">`+ this.decimalPipe.transform(this.totalPagar - (this.totalPagar / 1.12), '1.2-2') + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Propina:</td><td style="text-align:right; padding-right: 20px;">0.00</td></tr>
      <tr style="font-size:24px"><td style="padding-left: 20px">&nbsp;Valor Total:</td><td style="text-align:right; padding-right: 10px;">`+ this.decimalPipe.transform(this.totalPagar, '1.2-2') + `&nbsp;&nbsp;</td></tr>
    </table>
    <td colspan="4">====================================</td>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">`;
    let i = 0;
    for (let c of this.formasPagoFact) {
      html += `<tr>`;
      if (i == 0) {
        html += `<td style="padding-left: 20px">Forma de pago:</td>`;
      } else {
        html += `<td style="padding-left: 20px">&nbsp;</td>`;
      }
      html += `<td>` + c.desc + `</td>
                <td style="text-align: right; padding-right: 20px">` + this.decimalPipe.transform(c.valor, '1.2-2') + `</td>
              </tr>`
      i++;
    }
    html += ` 
    </table>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr><td style="padding-left: 20px">&nbsp;Total items:</td><td>`+ this.lstConsumo.length + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Caja Nro.:</td><td>2</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Id. Transacción:</td><td style="font-size: 13px">`+ this.idTransaction + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Impresor:</td><td>`+ this.printerName + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Serie Nro.:</td><td>`+ this.numModelo + `</td></tr>
    </table>
    <td colspan="4">====================================</td>

    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
        <tr><td style="padding-left: 20px">&nbsp;&nbsp;Total:</td><td style="padding-right: 50px;"> M:`
      + ((this.searchUserS.cantMujeres + this.searchUserS.ingresoMujeres) - this.searchUserS.egresoMujeres) + `</td>
        <td style="padding-right: 50px"> H:`
      + ((this.searchUserS.cantHombres + this.searchUserS.ingresoHombres) - this.searchUserS.egresoHombres) + `</td></tr>
        <tr><td style="padding-left: 20px">&nbsp;&nbsp;Egresos:</td><td> M:`+ this.searchUserS.egresoMujeres + `</td>
        <td> H:`+ this.searchUserS.egresoHombres + `</td></tr>
        <tr><td style="padding-left: 20px">&nbsp;&nbsp;Ingresos:</td><td> M:`+ this.searchUserS.ingresoMujeres + `</td>
        <td> H:`+ this.searchUserS.ingresoHombres + `</td></tr>
        <tr><td style="padding-left: 20px">&nbsp;&nbsp;Cant. Ini.:</td><td> M:`+ this.searchUserS.cantMujeres + `</td>
        <td> H:`+ this.searchUserS.cantHombres + `</td></tr>
    </table>
    <td colspan="4">====================================</td>


    <p style="font-family: Calibri; text-align:center; padding-left: 20px; padding-right: 20px">
      Revisa tu factura electrónica ingresando
      a la siguiente dirección:
      www.riobytes.com/managerbox<br>
      User: 0502926819<br>
      Pass: 0502926819<br>
      Gracias por tu compra
    </p>
    <td colspan="4">====================================</td>

    </body>

    </html>`;
    popupWin.document.write(html);
    popupWin.document.close();
  }

  printOrdenSalidaCero() {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open(' ', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    let html = `
    <html>
      <head>
        <style>
          @page { size: auto;  margin: 0mm;};
        </style>
      </head>
      <body onload="window.print();window.close()">${printContents}
        <p style="font-family: Calibri; text-align:center">Orden de Salida (Consumo Cero)</p>
        <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
          <tr><td style="padding-left: 20px">&nbsp;CI:</td><td>`+ this.searchUserS.ci + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;Cliente:</td><td>`+ this.searchUserS.nombre + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;Cajero:</td><td>`+ this.us.name + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;Fecha:</td><td>`+ this.validateService.getDateEs() + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;Hora:</td><td>`+ this.validateService.getTimeEs() + `</td></tr>
        </table>

        <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
          <tr colspan="4">====================================</tr>
          <tr style="font-size:24px"><td style="padding-left: 20px">&nbsp;Total Mujeres:</td><td style="padding-right: 50px;">`
      + ((this.searchUserS.cantMujeres + this.searchUserS.ingresoMujeres) - this.searchUserS.egresoMujeres) + `</td></tr>
          <tr style="font-size:24px"><td style="padding-left: 20px">&nbsp;Total Mujeres:</td><td style="padding-right: 50px">`
      + ((this.searchUserS.cantHombres + this.searchUserS.ingresoHombres) - this.searchUserS.egresoHombres) + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;&nbsp;Egreso Mujeres:</td><td>`+ this.searchUserS.egresoMujeres + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;&nbsp;Egreso Hombres:</td><td>`+ this.searchUserS.egresoHombres + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;&nbsp;Ingreso Mujeres:</td><td>`+ this.searchUserS.ingresoMujeres + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;&nbsp;Ingreso Hombres:</td><td>`+ this.searchUserS.ingresoHombres + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;&nbsp;Cant. Mujeres:</td><td>`+ this.searchUserS.cantMujeres + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;&nbsp;Cant. Hombres:</td><td>`+ this.searchUserS.cantHombres + `</td></tr>
        </table>

      </body>
    </html>`;
    popupWin.document.write(html);
    popupWin.document.close();

  }

  onRowSelectTC(event) {
    console.log(event.data)
    this.showDateHour = event.data.fecha;
  }

  nombreComercial;
  razonSocial;
  ruc;
  nroCont;
  flagCont;
  numMax;
  limite;
  nuevaCantidad;
  printerName;
  numModelo;
  ngOnInitCloseTab() {
    this.configurationService.getAll().subscribe(data => {
      //console.log(data);
      this.nombreComercial = data[0].valor;
      this.nombreComercial = this.nombreComercial.toUpperCase();
      this.razonSocial = data[1].valor;
      this.razonSocial = this.razonSocial.toUpperCase();
      this.ruc = data[2].valor;
      this.nroCont = data[3].valor;
      this.flagCont = data[4].valor;
      this.numMax = data[5].valor;
      this.limite = data[6].valor;
      this.printerName = data[7].valor;
      this.numModelo = data[8].valor;
      this.nuevaCantidad = data[9].valor;

      this.limiteConsumo = this.limite;

    }, err => {
      console.log(err);
    });
  }

  /*TAB EGRESO*/

  stepMujeresE = 0;
  plusWomanE() {
    if (this.flagEM == true) {
      if (this.cantSalenM < 100)
        this.cantSalenM += this.stepMujeresE;
    } else {
      if (this.cantSalenM < (this.searchUserE.cantMujeres - this.searchUserE.egresoMujeres) + this.searchUserE.ingresoMujeres)
        this.cantSalenM++;
    }
  }

  lessWomanE() {
    if (this.flagEM == true) {
      if (this.cantSalenM > 0)
        this.cantSalenM -= this.stepMujeresE;
    } else {
      if (this.cantSalenM > 0)
        this.cantSalenM--;
    }
  }

  stepHombresE = 0;
  plusManE() {
    if (this.flagEH == true) {
      if (this.cantSalenH < 100)
        this.cantSalenH += this.stepHombresE;
    } else {
      if (this.cantSalenH < (this.searchUserE.cantHombres - this.searchUserE.egresoHombres) + this.searchUserE.ingresoHombres)
        this.cantSalenH++;
    }
  }

  lessManE() {
    if (this.flagEH == true) {
      if (this.cantSalenH > 0)
        this.cantSalenH -= this.stepHombresE;
    } else {
      if (this.cantSalenH > 0)
        this.cantSalenH--;
    }
  }

  totalCoversE = 0;
  addCoverME() {

    let cantTotalPersonas = this.cantSalenM;
    for (let entry of this.lstResumenOpen) {
      cantTotalPersonas += entry.cantidad;
    }

    if (cantTotalPersonas <= this.numMax) {

      if (this.cantSalenM > 0) {
        let aux = {
          nombre: this.selectedCoverME.nombre,
          cantidad: this.cantSalenM,
          genero: 'Mujer',
          producto: this.selectedCoverME.productoMujeres,
          precio: 0
        }

        this.factorMult = this.cantSalenM / parseFloat(this.selectedCoverME.numMujeres);
        aux.precio = this.factorMult * parseFloat(this.selectedCoverME.precioMujeres);

        this.totalCoversE = 0;
        var index = this.lstResumenOpenE.findIndex(i => i.nombre === aux.nombre && i.genero === aux.genero);
        if (index == -1) {
          this.lstResumenOpenE = [...this.lstResumenOpenE, aux];
        } else {
          this.lstResumenOpenE[index].precio = parseFloat(this.lstResumenOpenE[index].precio)
          this.lstResumenOpenE[index].cantidad += aux.cantidad;
          this.lstResumenOpenE[index].precio += aux.precio;
        }
        document.getElementById('coverME').style.borderColor = '';
        this.totalCoversE = this.calcTotalCovers(this.lstResumenOpenE);
      } else {
        document.getElementById('coverME').style.borderColor = '#FF4B36';
        this.messageGrowlService.notify('error', 'Error', 'Selecciona la cantidad de mujeres!');
      }

    } else {
      this.messageGrowlService.notify('error', 'Error', 'La cantidad máxima de personas por tarjeta es de: ' + this.numMax);
    }

  }

  addCoverHE() {

    let cantTotalPersonas = this.cantSalenH;
    for (let entry of this.lstResumenOpen) {
      cantTotalPersonas += entry.cantidad;
    }

    if (cantTotalPersonas <= this.numMax) {
      if (this.cantSalenH > 0) {
        let aux = {
          nombre: this.selectedCoverHE.nombre,
          cantidad: this.cantSalenH,
          genero: 'Hombre',
          producto: this.selectedCoverHE.productoHombres,
          precio: parseFloat(this.selectedCoverHE.precioHombres)
        }

        this.factorMult = this.cantSalenH / parseFloat(this.selectedCoverHE.numHombres);
        aux.precio = this.factorMult * parseFloat(this.selectedCoverHE.precioHombres);

        this.totalCoversE = 0;
        var index = this.lstResumenOpenE.findIndex(i => i.nombre === aux.nombre && i.genero === aux.genero);
        if (index == -1) {
          this.lstResumenOpenE = [...this.lstResumenOpenE, aux];
        } else {
          this.lstResumenOpenE[index].precio = parseFloat(this.lstResumenOpenE[index].precio)
          this.lstResumenOpenE[index].cantidad += aux.cantidad;
          this.lstResumenOpenE[index].precio += aux.precio;
        }
        document.getElementById('coverHE').style.borderColor = '';
        this.totalCoversE = this.calcTotalCovers(this.lstResumenOpenE);
      } else {
        document.getElementById('coverHE').style.borderColor = '#FF4B36';
        this.messageGrowlService.notify('error', 'Error', 'Selecciona la cantidad de hombres!');
      }
    } else {
      this.messageGrowlService.notify('error', 'Error', 'La cantidad máxima de personas por tarjeta es de: ' + this.numMax);
    }

  }

  onChangeSelectCoverME($event) {
    this.stepMujeresE = parseFloat(this.selectedCoverME.numMujeres);
    this.cantSalenM = parseFloat(this.selectedCoverME.numMujeres);
  }

  onChangeSelectCoverHE($event) {
    this.stepHombresE = parseFloat(this.selectedCoverHE.numHombres);
    this.cantSalenH = parseFloat(this.selectedCoverHE.numHombres);
  }

  lstResumenOpenE: any[];
  deleteRowCoverE(index) {
    this.totalCoversE = 0;
    this.lstResumenOpenE.splice(index, 1);
    this.lstResumenOpenE = [...this.lstResumenOpenE];
    this.totalCoversE = this.calcTotalCovers(this.lstResumenOpenE);
  }

  onChangeAbono($event) {
    if (this.abono > (this.totalPagar - this.searchUserE.abono)) {
      this.abono = 0;
      setTimeout(function () {
        let v = document.getElementById('inputAbono');
        if (v != null) {
          v.click();
          this.abono = 0;
        }
      }, 0);
    }
  }

  flagEM = false;
  onChangeEM($event) {
    if (this.selectedIeMujeres.localeCompare('Ingreso') === 0) {
      this.flagEM = true;
      this.stepMujeresE = parseFloat(this.selectedCoverME.numMujeres);
      this.cantSalenM = parseFloat(this.selectedCoverME.numMujeres);
    } else {
      this.flagEM = false;
      this.cantSalenM = 0;
    }
  }

  flagEH = false;
  onChangeEH($event) {
    if (this.selectedIeHombres.localeCompare('Ingreso') === 0) {
      this.flagEH = true;
      this.stepHombresE = parseFloat(this.selectedCoverHE.numHombres);
      this.cantSalenH = parseFloat(this.selectedCoverHE.numHombres);
    } else {
      this.flagEH = false;
      this.cantSalenH = 0;
    }
  }

  onChangeEgreso($event) {
    this.cardNumberE = this.cardNumberE.toLowerCase();
    let finalChar = this.cardNumberE.slice(-1)
    if (this.cardNumberE.length == 9) {
      if (finalChar.localeCompare("_") == 0) {
        this.checkActiveCardE(this.cardNumberE);
      }
    } else {
      document.getElementById('addonCnE2').style.backgroundColor = '#FF4B36';
      document.getElementById('addonCnE1').style.backgroundColor = '';
      this.flagCardEFound = false;
      this.nfLaelE = '';
      this.lstResumenOpenE = [];
      this.cantSalenH = 0;
      this.cantSalenM = 0;
    }
  }

  checkActiveCardE(card) {
    this.activeCardsService.searchByCardActive(card).subscribe(data => {

      if (data.length > 0) {
        this.searchUserE = data[0];
        this.fillPartialSales(data[0].idFactura);
        this.showDateApertura = data[0].fechaHora.split(' ')[0];
        this.showHourApertura = data[0].fechaHora.split(' ')[1];
        this.messageGrowlService.notify('info', 'Información', 'Tarjeta Encontrada!');
        this.flagCardEFound = true;
        document.getElementById('addonCnE2').style.backgroundColor = '';
        document.getElementById('addonCnE1').style.backgroundColor = '#8FC941';//green
        this.searchConsumo(this.searchUserE.idFactura);
        this.cantSalenH = 0;
        this.cantSalenM = 0;
      } else {
        this.lstResumenOpenE = [];
        this.flagCardEFound = false;
        this.nfLaelE = 'Tarjeta no ingresada.';
        this.messageGrowlService.notify('warn', 'Advertencia', 'Tarjeta No Encontrada!');
        document.getElementById('addonCnE2').style.backgroundColor = '#FF4B36';//soft red
        document.getElementById('addonCnE1').style.backgroundColor = '';//default color
        this.cantSalenH = 0;
        this.cantSalenM = 0;
      }
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Ingresa un número de personas!');
    })
  }

  changeCantidad($event) {
    for (let i = 0; i < this.lstComprasCliente.length; i++) {
      if (this.lstComprasCliente[i].cantidad !== this.lstComprasCliente[i].cantidadOld) {
        this.cantColor = '#FF0000';
      } else {
        this.cantColor = '#0000FF'
      }
    }
  }

  fillPartialSales(idFactura) {
    this.facturaService.getById(idFactura).subscribe(data => {
      this.lstComprasCliente = [];
      for (let entry of data[0].detalleFacturaV) {
        let aux = {
          'fecha': entry.fecha.split(' ')[0],
          'hora': entry.fecha.split(' ')[1],
          'cantidad': entry.cantidad,
          'descripcion': entry.descripcion,
          'precio_venta': entry.precio_venta,
          'total': entry.total,
          'cantidadOld': entry.cantidad
        }
        this.lstComprasCliente.push(aux);
      }
    }, err => {
      console.log(err);
    })
  }

  /*confirmarEgreso() {
    if ((this.cantSalenH + this.cantSalenM) > 0) {
      if (this.selectedIeMujeres.localeCompare('Ingreso') == 0) {
        this.searchUserE.ingresoMujeres = this.cantSalenM;
      } else {
        this.searchUserE.egresoMujeres = this.cantSalenM;
      }
      if (this.selectedIeHombres.localeCompare('Ingreso') == 0) {
        this.searchUserE.ingresoHombres = this.cantSalenH;
      } else {
        this.searchUserE.egresoHombres = this.cantSalenH
      }
      let lstNuevosProdsAC: any[] = this.loadProductosCover(this.lstResumenOpenE);
      for (let entry of lstNuevosProdsAC) {
        this.searchUserE.productosV.push(entry);
      }
      this.searchUserE.abono = parseFloat(this.searchUserE.abono.toString());
      this.searchUserE.abono += this.abono;
      console.log(this.searchUserE)
      if (this.searchUserE.ingresoMujeres + this.searchUserE.ingresoHombres > 1) {
        let detalle: any = [];
        detalle = this.formatDetalleFactura(this.lstResumenOpenE);
        if (this.lstResumenOpenE.length > 0) {
          this.updateAC();
          this.updateConsumo(this.searchUserE.idFactura, detalle);
          this.setDvInsertEgreso();
        } else {
          this.messageGrowlService.notify('error', 'Error', 'Agrega el tipo que cover que aplica para las personas que ingresan!');
        }
      } else {
        this.updateAC();
        this.setDvInsertEgreso();
      }
    } else {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona la cantidad de personas que entran/salen!');
    }
  }*/

  confirmarEgreso() {
    if ((this.cantSalenH + this.cantSalenM) > 0) {
      let newAC = {
        ingresoM: 0,
        egresoM: 0,
        ingresoH: 0,
        egresoH: 0
      }
      if (this.selectedIeMujeres.localeCompare('Ingreso') == 0) {
        newAC.ingresoM = this.cantSalenM;
      } else {
        newAC.egresoM = this.cantSalenM;
      }
      if (this.selectedIeHombres.localeCompare('Ingreso') == 0) {
        newAC.ingresoH = this.cantSalenH;
      } else {
        newAC.egresoH = this.cantSalenH;
      }

      this.searchUserE.abono = parseFloat(this.searchUserE.abono.toString());
      this.searchUserE.abono += this.abono;



      if (newAC.ingresoM + newAC.ingresoH > 1) {
        if (this.lstResumenOpenE.length > 0) {


          this.searchUserE.ingresoMujeres += newAC.ingresoM;
          this.searchUserE.egresoMujeres += newAC.egresoM;
          this.searchUserE.ingresoHombres += newAC.ingresoH;
          this.searchUserE.egresoHombres += newAC.egresoH;


          let lstNuevosProdsAC: any[] = this.loadProductosCover(this.lstResumenOpenE);
          for (let entry of lstNuevosProdsAC) {
            this.searchUserE.productosV.push(entry);
          }
          let detalle: any = [];
          detalle = this.formatDetalleFactura(this.lstResumenOpenE);
          this.updateAC();
          this.updateConsumo(this.searchUserE.idFactura, detalle);
          this.setDvInsertEgreso();
        } else {
          this.messageGrowlService.notify('error', 'Error', 'Agrega el tipo que cover que aplica para las personas que ingresan!');
        }
      } else {
        let totalM = (this.searchUserE.cantMujeres - this.searchUserE.egresoMujeres) + this.searchUserE.ingresoMujeres;
        let totalH = (this.searchUserE.cantHombres - this.searchUserE.egresoHombres) + this.searchUserE.ingresoHombres;

        if (newAC.egresoM + newAC.egresoH < totalM + totalH) {


          this.searchUserE.ingresoMujeres += newAC.ingresoM;
          this.searchUserE.egresoMujeres += newAC.egresoM;
          this.searchUserE.ingresoHombres += newAC.ingresoH;
          this.searchUserE.egresoHombres += newAC.egresoH;


          this.updateAC();
          //print 
          this.printOrdenSalidaEgreso();
          this.setDvInsertEgreso();
        } else {
          this.messageGrowlService.notify('error', 'Error', 'Cantidad personas salientes = numero total de personas');
        }
      }
    } else {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona la cantidad de personas que entran/salen!');
    }
  }

  updateConsumo(idFactura, detalle) {
    this.facturaService.getById(idFactura).subscribe(data => {
      for (let entry of detalle) {
        data[0].detalleFacturaV.push(entry);
      }
      this.facturaService.update(data[0]).subscribe(fact => {
        this.messageGrowlService.notify('info', 'Información', 'Se ha actualizado la factura!');
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
      })
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }

  updateAC() {
    this.activeCardsService.update(this.searchUserE).subscribe(data => {
      this.messageGrowlService.notify('info', 'Información', 'Se ha actualizado la factura!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    });
  }

  printOrdenSalidaEgreso() {

    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open(' ', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    let html = `    
      <html>
      <head>
        <style>
          @page { size: auto;  margin: 0mm;};
        </style>
      </head>
      <body onload="window.print();window.close()">${printContents}
        <p style="font-family: Calibri; text-align:center">Orden de Salida</p>
        <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
          <tr><td style="padding-left: 20px">&nbsp;CI:</td><td>`+ this.searchUserE.ci + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;Cliente:</td><td>`+ this.searchUserE.nombre + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;Cajero:</td><td>`+ this.us.name + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;Fecha:</td><td>`+ this.validateService.getDateEs() + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;Hora:</td><td>`+ this.validateService.getTimeEs() + `</td></tr>
        </table>

        <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
          <tr colspan="4">====================================</tr>
          <tr style="font-size:24px"><td style="padding-left: 20px">&nbsp;Total Mujeres:</td><td style="padding-right: 50px;">`
      + this.cantSalenM + `</td></tr>
          <tr style="font-size:24px"><td style="padding-left: 20px">&nbsp;Total Hombres:</td><td style="padding-right: 50px">`
      + this.cantSalenH + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;&nbsp;Egreso Mujeres:</td><td>`+ this.searchUserE.egresoMujeres + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;&nbsp;Egreso Hombres:</td><td>`+ this.searchUserE.egresoHombres + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;&nbsp;Ingreso Mujeres:</td><td>`+ this.searchUserE.ingresoMujeres + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;&nbsp;Ingreso Hombres:</td><td>`+ this.searchUserE.ingresoHombres + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;&nbsp;Cant. Mujeres:</td><td>`+ this.searchUserE.cantMujeres + `</td></tr>
          <tr><td style="padding-left: 20px">&nbsp;&nbsp;Cant. Hombres:</td><td>`+ this.searchUserE.cantHombres + `</td></tr>
        </table>

      </body>
      </html>`;
    popupWin.document.write(html);
    popupWin.document.close();

  }

  openCheckout(searchUserE) {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_oi0sKPJYLGjdvOXOM8tE8cMa',
      locale: 'auto',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
      }
    });

    handler.open({
      name: 'ManagerBox',
      description: 'Pago en Línea',
      amount: 20
    });

  }

  showComprasDetail() {
    this.showCompras = true;
  }

  updateComprasDetail() {
    console.log(this.lstComprasCliente);
    let flagDtChanges = false;
    let n = this.lstComprasCliente.length;
    for (let i = 0; i < n; i++) {
      if (this.lstComprasCliente[i].cantidad !== this.lstComprasCliente[i].cantidadOld) {
        flagDtChanges = true;
        break;
      }
    }
    if (flagDtChanges) {
      this.facturaService.getById(this.searchUserE.idFactura).subscribe(data => {
        let updatedFact = data;
        let vecDF: any = [];
        for (let entry of this.lstComprasCliente) {
          let aux = {
            precio_venta: entry.precio_venta,
            total: (entry.precio_venta * entry.cantidad),
            descripcion: entry.descripcion,
            cantidad: entry.cantidad,
            fecha: entry.fecha
          }
          vecDF.push(aux);
        }
        updatedFact[0].detalleFacturaV = vecDF;
        this.facturaService.update(updatedFact[0]).subscribe(data => {
          this.messageGrowlService.notify('info', 'Información', 'Se ha actualizado la factura!');
          this.showCompras = false;
          this.checkActiveCardE(this.cardNumberE);
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
        })
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
      })
    } else {
      this.messageGrowlService.notify('warn', 'Advertencia', 'No se realizaron cambios!');
    }
  }

  setDvInsertEgreso() {
    this.cardNumberE = '';
    document.getElementById("addonCnE1").style.backgroundColor = '';
    document.getElementById("addonCnE2").style.backgroundColor = '';
    this.searchUserE = {
      abono: 0,
      ci: '',
      nombre: '',
      cantMujeres: 0,
      cantHombres: 0,
      egresoMujeres: 0,
      egresoHombres: 0,
      fechaHora: '',
      idFactura: '',
      cardNumber: '',
      ingresoMujeres: 0,
      ingresoHombres: 0,
      productosV: [],
      estado: 1,
      _id: ''
    }
    this.abono = 0;
    this.totalCoversE = 0;
    this.cantSalenM = 0;
    this.cantSalenH = 0;
    document.getElementById("coverME").style.backgroundColor = '';
    document.getElementById("coverHE").style.backgroundColor = '';
    this.flagEM = false;
    this.flagEH = false;
    this.selectedCoverME = this.lstCoversM[0];
    this.selectedCoverHE = this.lstCoversH[0];
    this.lstResumenOpenE = [];
    this.flagCardEFound = false;
    this.selectedIeMujeres = 'Egreso';
    this.selectedIeHombres = 'Egreso';
  }
  /* TAB TARJETAS*/
  onChangeG($event) {
    this.cardNumberG = this.cardNumberG.toLowerCase();
    if (this.cardNumberG.length == 0) {
      document.getElementById('addonCnT2').style.backgroundColor = '';
      document.getElementById('addonCnT1').style.backgroundColor = '';
    } else {
      if (this.cardNumberG.length == 9) {
        let finalChar = this.cardNumberG.slice(-1);
        if (finalChar.localeCompare("_") == 0) {
          this.tarjetaService.getByNumero(this.cardNumberG).subscribe(data => {
            if (data.length === 0) {
              document.getElementById('addonCnT1').style.backgroundColor = '#8FC941';//green
              document.getElementById('addonCnT2').style.backgroundColor = '';
              this.onAddTSubmitNew();
            } else {
              document.getElementById('addonCnT2').style.backgroundColor = '#FF4B36';
              document.getElementById('addonCnT1').style.backgroundColor = '';
              this.messageGrowlService.notify('warn', 'Advertencia', 'Esta tarjeta ya ha sido ingrsada!');
            }
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
          })
        }
      } else {
        document.getElementById('addonCnT2').style.backgroundColor = '#FF4B36';
        document.getElementById('addonCnT1').style.backgroundColor = '';
        this.flagCardEFound = false;
        this.nfLaelE = '';
      }
    }
  }

  searchCard(card) {
  }

  onAddTSubmitNew() {
    const newCard = {
      numero: this.cardNumberG,
      nombre: '',
      apellido: '',
      cedula: '',
      limite: this.limiteConsumo,
      descripcion: '',
      tipo: ''
    }
    this.tarjetaService.register(newCard).subscribe(data => {
      this.sourceT.add(newCard);
      this.sourceT.refresh();
      let row = this.lstAddCardCI.find(x => x.value.cedula === newCard.cedula);
      this.ngOnInit();
      this.ngOnInitCards();
      this.showDialogT = false;
      this.messageGrowlService.notify('success', 'Exito', 'Ingreso Existoso!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })

  }
  /* TAB REIMPRESION */
  lstFacturas: any[];
  settingsR = {
    mode: 'external',
    noDataMessage: 'No existen registros',
    columns: {
      _id: {
        title: 'Id. Transacción',
        width: '17.5%',
      },
      cedula: {
        title: 'CI.',
        width: '12.5%'
      },
      ruc: {
        title: 'Ruc',
        width: '12.5%'
      },
      nombre: {
        title: 'Cliente',
        width: '17.5%'
      },
      cajero: {
        title: 'Cajero',
        width: '10%'
      },
      fecha_emision: {
        title: 'Fecha',
        width: '10%'
      },
      monto: {
        title: 'Monto',
        width: '10%'
      },
      print: {
        title: 'Impresión',
        width: '10%',
        filter: false,
        type: 'custom',
        renderComponent: PrintRenderComponent
      }
    },
    actions: {
      //columnTitle: '',
      add: false,
      edit: false,
      delete: false
    },
    attr: {
      class: 'table-bordered table-hover table-responsive'
    }
  };
  sourceR: LocalDataSource = new LocalDataSource();

  printTicket(lstFact) {
    this.fillFP();
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open(' ', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    let html = `
    <html>
    <head>
      <style>
        @page { size: auto;  margin: 0mm;};
      </style>
    </head>
    <body onload="window.print();window.close()">${printContents}
    <br><br><br>
    <p style="font-family: Calibri; text-align:center">Documento sin valor tributario</p>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr><td style="padding-left: 20px">&nbsp;Cliente:</td><td>`+ this.nombreS + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;CI/RUC:</td><td>`+ this.rucFactura + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Teléfono:</td><td>`+ this.telefonoS + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Dirección:</td><td>`+ this.direccionS + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Cajero:</td><td>JFlores</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Fecha:</td><td>`+ this.validateService.getDateEs() + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Hora:</td><td>`+ this.validateService.getTimeEs() + `</td></tr>
    </table>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr colspan="4">====================================</tr>
      <thead>
            <th style="text-align:center;padding-left: 7px; font-weight: normal;">Cant.</th>
            <th style="text-align:left; font-weight: normal;">Detalle</th>
            <th style="text-align:left; font-weight: normal;">Pu.</th>
            <th style="text-align:left; font-weight: normal;">Total</th>
      </thead> 
      <td colspan="4">=========================================</td>
      <tbody>
        `;

    for (let c of this.lstConsumo) {
      html += `<tr><td style="padding-left: 10px; text-align:center;">` + c.cantidad + `</td>
          <td style="margin-right: -10px">`+ this.slicePipe.transform(c.descripcion, 0, 13) + `</td>
          <td style="margin-right: -10px">`+ this.decimalPipe.transform(c.precio_venta, '1.2-2') + `</td>
          <td style="margin-right: -10px">`+ this.decimalPipe.transform(c.total, '1.2-2') + `</td></tr>`
    }

    html += ` 
      </tbody>
    </table>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr colspan="4">====================================</tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal 12% IVA:</td><td style="padding-right: 120px">`+ this.decimalPipe.transform(this.totalPagar / 1.12, '1.2-2') + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal 0% IVA:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal Excento IVA:</td><td>`+ this.decimalPipe.transform(this.totalPagar / 1.12, '1.2-2') + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal No Obj. IVA:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Descuento:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal:</td><td>`+ this.decimalPipe.transform(this.totalPagar / 1.12, '1.2-2') + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;ICE:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;IVA 12%:</td><td>`+ this.decimalPipe.transform(this.totalPagar - (this.totalPagar / 1.12), '1.2-2') + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Propina:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Valor Total:</td><td>`+ this.decimalPipe.transform(this.totalPagar, '1.2-2') + `</td></tr>
    </table>
    <td colspan="4">====================================</td>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">`;
    let i = 0;
    for (let c of this.formasPagoFact) {
      html += `<tr>`;
      if (i == 0) {
        html += `<td style="padding-left: 20px">Forma de pago:</td>`;
      } else {
        html += `<td style="padding-left: 20px">&nbsp;</td>`;
      }
      html += `<td>` + c.desc + `</td>
                <td style="text-align: right; padding-right: 20px">` + this.decimalPipe.transform(c.valor, '1.2-2') + `</td>
              </tr>`
      i++;
    }

    html += ` </table>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr><td style="padding-left: 20px">&nbsp;Total items:</td><td>`+ this.lstConsumo.length + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Caja Nro.:</td><td>2</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Id. Transacción:</td><td style="font-size: 13px">5a8786bf49dd4d323c28d26a</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Impresor:</td><td>Epson TM-U220D</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Serie Nro.:</td><td>P3QF303046</td></tr>
      
    </table>
    <td colspan="4">====================================</td>
    <p style="font-family: Calibri; text-align:center; padding-left: 20px; padding-right: 20px">
      Revisa tu factura electrónica ingresando
      a la siguiente dirección:
      www.riobytes.com/managerbox<br>
      User: 0502926819<br>
      Pass: 0502926819<br>
      Gracias por tu compra
    </p>
    <td colspan="4">====================================</td>

    </body>

    </html>`;
    popupWin.document.write(html);
    popupWin.document.close();
  }

  ngOnInitReimpresion() {
    this.lstFacturas = [];
    this.facturaService.getAll().subscribe(data => {
      for (let entry of data) {
        let factura = {
          _id: entry._id,
          cedula: entry.cedula,
          ruc: entry.ruc,
          nombre: entry.nombre,
          telefono: entry.telefono,
          direccion: entry.direccion,
          cajero: entry.cajero,
          fecha_emision: entry.fecha_emision,
          monto: entry.detalleFacturaV,
          print: entry
        }
        let sum = 0;
        for (let s of factura.monto) {
          sum += s.total;
        }
        factura.cajero = this.us.name;
        factura.monto = sum;
        this.lstFacturas.push(factura);
      }
      this.sourceR.load(this.lstFacturas);
      //console.log(this.lstFacturas)
    }, err => {
      console.log(err);
    });

  }

  /* INTERCAMBIO DE CAJAS */
  showDialogInOut = false;
  lstCajas: any = [];
  selectedCaja: any;
  montoTrans = 0;
  totalEfectivoCaja = 0;

  setInOutValues() {
    this.showDialogInOut = true;
    setTimeout(function () {
      document.getElementById('montoTrans').focus();
    }, 0);
    this.montoTrans = 0;
    this.cajaService.getActiveCajaById('open', this.us.idPersonal).subscribe(data => {
      let totalEntradas = 0;
      if (data[0].entradas.length > 0) {
        totalEntradas = this.genericAddObject(data[0].entradas);
      }
      let totalSalidas = 0;
      if (data[0].salidas.length > 0) {
        totalSalidas = this.genericAddObject(data[0].salidas);
      }
      data[0].montoO = parseFloat(data[0].montoO);
      this.totalEfectivoCaja = (data[0].montoO + totalEntradas) - totalSalidas;

    }, err => {
      console.log(err);
    });

  }

  genericAddObject(lst) {
    let acum = 0;
    for (let entry of lst) {
      acum += parseFloat(entry.cantidad);
    }
    return acum;
  }

  onChangeMontoTrans() {
    if (this.montoTrans > this.totalEfectivoCaja) {
      this.montoTrans = 0;
      setTimeout(function () {
        let v = document.getElementById('montoTrans');
        if (v != null) {
          v.click();
          this.montoTrans = 0;
        }
      }, 0);
    }
  }

  doExchange() {
    this.cajaService.getActiveCajaById('open', this.selectedCaja._id).subscribe(data => {
      if (data.length > 0) {
        let caja = {
          _id: data[0]._id,
          idUser: data[0].idUser,
          montoO: data[0].montoO,
          montoF: data[0].montoF,
          fechaO: data[0].fechaO,
          fechaF: data[0].fechaF,
          entradas: data[0].entradas,
          salidas: data[0].salidas
        }
        caja.entradas.push({ cantidad: this.montoTrans, fecha: this.validateService.getDateTimeStamp(), caja: this.us.idPersonal });
        this.cajaService.update(caja).subscribe(data => {
          this.cajaService.getActiveCajaById('open', this.us.idPersonal).subscribe(data1 => {
            let caja1 = {
              _id: data1[0]._id,
              idUser: data1[0].idUser,
              montoO: data1[0].montoO,
              montoF: data1[0].montoF,
              fechaO: data1[0].fechaO,
              fechaF: data1[0].fechaF,
              entradas: data1[0].entradas,
              salidas: data1[0].salidas
            }
            caja1.salidas.push({ cantidad: this.montoTrans, fecha: this.validateService.getDateTimeStamp(), caja: this.selectedCaja._id });
            this.cajaService.update(caja1).subscribe(resp => {
              this.messageGrowlService.notify('info', 'Información', 'Se ha transferido: $' + this.montoTrans + ' a la caja: ' + this.selectedCaja.nombres + ' ' + this.selectedCaja.apellidos + '--' + this.selectedCaja.cedula);
            }, err => {
              console.log(err);
            });
          }, err => {
            console.log(err);
          });
        }, err => {
          console.log(err);
        });
      } else {
        this.messageGrowlService.notify('error', 'error', 'No se puede transferir a una caja cerrada:' + this.selectedCaja.nombres + ' ' + this.selectedCaja.apellidos + '--' + this.selectedCaja.cedula);
      }
    }, err => {
      console.log(err);
    });
  }

  /* Width detection */
  marginBot = '0px';
  textAlign = 'right';
  textAlignTitle = 'left';
  flagSp = false;
  flagSp1 = false;


  onResize(event) {
    let x = event.target.innerWidth;
    if (x < 768) {
      this.marginBot = '20px';
      this.textAlign = 'center';
      this.textAlignTitle = 'center';
    } else {
      this.marginBot = '0px';
      this.textAlign = 'right';
      this.textAlignTitle = 'left';
    }
  }

  onRzOnInit(x) {
    if (x < 768) {
      this.marginBot = '20px';
      this.textAlign = 'center';
      this.textAlignTitle = 'center';
    } else {
      this.marginBot = '0px';
      this.textAlign = 'right';
      this.textAlignTitle = 'left';
    }
  }
}