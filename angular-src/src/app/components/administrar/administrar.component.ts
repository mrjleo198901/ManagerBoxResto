import { Component, OnInit, ViewChild, KeyValueDiffer, KeyValueDiffers, DoCheck } from '@angular/core';
import { FormBuilder, FormControl, NgModel, FormGroup, Validators } from '@angular/forms';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { MessageGrowlService } from '../../services/message-growl.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { CoverService } from '../../services/cover.service';
import { PersonalService } from '../../services/personal.service';
import { FormatterService } from '../../services/formatter.service';
import { ProductoService } from '../../services/producto.service';
import { ValidateService } from '../../services/validate.service';
import { SelectItem, Listbox } from 'primeng/primeng';
import { DecimalPipe, DatePipe } from '@angular/common';
import { CoverprodRenderComponent } from '../coverprod-render/coverprod-render.component';
import { ActiveCardsService } from '../../services/active-cards.service';
import { TarjetaService } from '../../services/tarjeta.service';
import { FacturaService } from '../../services/factura.service';
import { PromocionService } from '../../services/promocion.service';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.component.html',
  styleUrls: ['./administrar.component.css']
})
export class AdministrarComponent implements OnInit {

  settingsC = {
    mode: 'external',
    noDataMessage: 'No existen registros',
    columns: {
      nombre: {
        title: 'Nombre',
        width: '26%'
      },
      numMujeres: {
        title: 'Nro. Mujeres',
        width: '9%'
      },
      precioMujeres: {
        title: 'Precio Mujeres',
        width: '9%'
      },
      productoMujeres: {
        title: 'Producto Mujeres',
        width: '19%',
        type: 'custom',
        renderComponent: CoverprodRenderComponent,
        filter: false
      },
      numHombres: {
        title: 'Nro. Hombres',
        width: '9%'
      },
      precioHombres: {
        title: 'Precio Hombres',
        width: '9%'
      },
      productoHombres: {
        title: 'Producto Hombres',
        width: '19%',
        type: 'custom',
        renderComponent: CoverprodRenderComponent,
        filter: false
      }
    },
    actions: {
      // columnTitle: '',
      add: true,
      edit: false,
      delete: true
    },
    attr: {
      class: 'table-bordered table-hover table-responsive'
    }
  };
  sourceC: LocalDataSource = new LocalDataSource();
  showDialogCC = false;
  showDialogCU = false;
  objCover = {
    nombre: '',
    numMujeres: 1,
    productoMujeres: [],
    precioMujeres: 0,
    numHombres: 0,
    productoHombres: [],
    precioHombres: 0
  };
  objCoverUpdate = {
    nombre: '',
    numMujeres: 1,
    productoMujeres: [],
    precioMujeres: 0,
    numHombres: 1,
    productoHombres: [],
    precioHombres: 0
  };
  lstProductos: any[];
  borderStyleProdExistente = '#DADAD2';
  flagProdM = false;
  flagProdH = false;
  sexs = [
    { "name": 'Femenino', "pseudo": "F" },
    { "name": 'Masculino', "pseudo": "M" },
    { "name": 'Ambos', "pseudo": "A" }
  ];
  color = 'primary';
  sexo: string;
  checked = false;
  cantMujeres = 1;
  cantHombres = 1;
  lstCover: any = [];
  nombreProdM;
  nombreProdH;
  widthPanel = '98%';
  onUpdateFlag = false;
  ventasTotales;
  ventasEfectivo = 750;
  ventasTarjeta = 100;
  ventasCheque = 50;
  ventasCredito = 10;
  dineroCaja;
  fondoCaja = 100;
  abonosEfectivo = 200;
  entradas = 80;
  salidas = 30;
  ganancia = 320;
  cantPersonas;
  inMujeres = 48;
  inHombres = 57;
  outMujeres = 12;
  outHombres = 28;
  selected_caja
  lstCajas: any = [];
  currentDateTime;
  widthCover = 600;

  @ViewChild('listBoxMU') accessor: Listbox;
  @ViewChild('listBoxMU', { read: NgModel }) model: NgModel;
  differ: any;
  fechaApertura;

  constructor(private messageGrowlService: MessageGrowlService,
    private dialog: MdDialog, private coverService: CoverService,
    private formatterService: FormatterService,
    private productoService: ProductoService,
    private differs: KeyValueDiffers,
    private validateService: ValidateService,
    private personalService: PersonalService,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private activeCardsService: ActiveCardsService,
    private tarjetaService: TarjetaService,
    private facturaService: FacturaService,
    private promocionService: PromocionService) {

    this.differ = differs.find([]).create(null);
    this.calcVentas();
    this.calcMoney();
    this.calcPersonas();

    var x = window.innerWidth;
    this.onRzOnInit(x);
  }

  ngOnInit() {
    this.coverService.getAll().subscribe(data => {
      this.productoService.getAll().subscribe(p => {
        this.lstProductos = [...p];
        //this.fillLstProdsPromo();
        this.lstCover = [];
        for (let entry of data) {
          let aux = {
            _id: entry._id,
            nombre: entry.nombre,
            numMujeres: entry.numMujeres,
            precioMujeres: this.decimalPipe.transform(entry.precioMujeres, '1.2-2'),
            productoMujeres: entry.productoMujeres,
            numHombres: entry.numHombres,
            precioHombres: this.decimalPipe.transform(entry.precioHombres, '1.2-2'),
            productoHombres: entry.productoHombres,
          };
          this.lstCover.push(aux);
        }
        this.sourceC = new LocalDataSource();
        this.sourceC.load(this.lstCover);
      }, err => {
        console.log(err)
      });
    }, err => {
      console.log(err);
    });

    this.currentDateTime = this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm:ss');
    //Get Cajas
    this.personalService.getByTipo('59a054715c0bf80b7cab502d').subscribe(data => {
      if (data.length > 0) {
        this.lstCajas = data;
        //console.log(this.lstCajas);
        this.selected_caja = 'Todas';
      }
    }, err => {
      console.log(err);
    });

    this.lstSelectedProdM = [];
    this.lstSelectedProdH = [];

    this.ngOnInitTarjetas();
    this.ngOnInitPromo();
  }

  setCursorAddC() {
    setTimeout(function () {
      document.getElementById('nombre').focus();
    }, 0);
    this.setOriginalColorsCover();
    this.checked = false;
    this.flagProdM = false;
    this.flagProdH = false;
    this.objCover = {
      nombre: '',
      numMujeres: 1,
      precioMujeres: 0,
      productoMujeres: [],
      numHombres: 0,
      precioHombres: 0,
      productoHombres: []
    };
    this.widthPanel = '98%';
    this.widthCover = 600;
    this.lstSelectedProdM = [];
    this.lstSelectedProdH = [];
  }

  onUpdateC(event: any) {
    /*this.onUpdateFlag = true;
    this.setOriginalColorsCoverU();
    this.objCoverUpdate = event.data;
    if (this.objCoverUpdate.productoMujeres !== undefined) {
      this.flagProdM = true;
      //this.objCoverUpdate.productoMujeres = this.lstProductos[1].value;
      //console.log(this.lstProductos[1].value);
      this.productoService.getByNombre(this.objCoverUpdate.productoMujeres).subscribe(data => {
        this.objCoverUpdate.productoMujeres = data[0];
        console.log(this.objCoverUpdate);
        this.accessor.registerOnChange = (fn: (val: any) => void) => {
          this.accessor.onModelChange = (val) => {
            if (val && val.groupId === 0) {
              this.model.control.setValue(this.model.value);
              return;
            }
            return fn(val);
          };
        }

      }, err => {
        console.log(err)
      })
    }
    if (this.objCoverUpdate.productoHombres !== undefined) {
      this.flagProdH = true;
    }
    if (JSON.stringify(this.objCoverUpdate.productoMujeres) == JSON.stringify(this.objCoverUpdate.productoHombres)
      && this.objCoverUpdate.cantProdMujeres == this.objCoverUpdate.cantProdHombres
      && this.objCoverUpdate.numMujeres == this.objCoverUpdate.numHombres
      && this.objCoverUpdate.precioMujeres == this.objCoverUpdate.precioHombres) {

      this.checked = false;
      this.widthPanel = '98%';
    } else {

      this.checked = true;
      this.widthPanel = '48%';
    }*/
  }

  setCursorUpdateC() {
    setTimeout(function () {
      document.getElementById('nombreU').focus();
    }, 0);
  }

  onDeleteC(event): void {
    this.openDialogCover(event.data);
  }

  openDialogCover(data) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.localeCompare('Aceptar') === 0) {
          this.sourceC.remove(data);
          // remove from database
          this.coverService.delete(data._id).subscribe(data => {
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');
          });
        }
      }
    });
  }

  onChangeNombreCover($event) {
    this.objCover.nombre = this.objCover.nombre.trim();
    this.objCover.nombre = this.formatterService.toTitleCase(this.objCover.nombre);
  }

  onChangeNombreCoverU($event) {
    this.objCoverUpdate.nombre = this.formatterService.toTitleCase(this.objCoverUpdate.nombre);
  }

  onChangeCheckBox($event) {
    if (this.checked) {
      this.widthPanel = '48%';
      this.widthCover = 900;
      setTimeout(function () {
        document.getElementById('numMujeres').style.borderColor = '';
        document.getElementById('numHombres').style.borderColor = '';
      }, 0);
      this.objCover.numMujeres = 1;
      this.objCover.numHombres = 1;
    } else {
      this.widthPanel = '98%';
      this.widthCover = 600;
      this.objCover.numMujeres = 1;
      this.objCover.numHombres = 0;
      setTimeout(function () {
        document.getElementById('numMujeres').style.borderColor = '';
      }, 0);
    }
  }

  changeProdM($event) {
    this.objCover.productoMujeres = [];
    this.objCoverUpdate.productoMujeres = [];
    this.lstSelectedProdM = [];
    this.lstSelectedProdH = [];
    /*if (!this.flagProdM) {
      this.objCover.productoMujeres = [];
      this.objCoverUpdate.productoMujeres = [];
    } else {
      if (this.onUpdateFlag == false) {
        if (this.lstProductos.length > 0) {
          this.objCover.productoMujeres = this.lstProductos[0].value;
          this.objCoverUpdate.productoMujeres = this.lstProductos[1].value;
        }
      }
    }*/
  }

  changeProdH($event) {
    if (!this.flagProdH) {
      this.objCover.productoHombres = [];
      this.objCoverUpdate.productoHombres = [];
    } else {
      if (this.lstProductos.length > 0) {
        this.objCover.productoHombres = this.lstProductos[0].value;
        this.objCoverUpdate.productoHombres = this.lstProductos[0].value;
      }
    }
  }

  saveCover() {
    this.objCover.nombre = this.objCover.nombre.trim();
    if (this.objCover.numMujeres + this.objCover.numHombres > 0) {
      if (!this.validateService.customValidateCover(this.objCover)) {
        this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
        return false;
      }
      if (!this.checked) {
        this.objCover.numHombres = this.objCover.numMujeres;
        this.objCover.precioHombres = this.objCover.precioMujeres;
        this.objCover.productoHombres = this.objCover.productoMujeres;
      }
      this.coverService.register(this.objCover).subscribe(data => {
        this.messageGrowlService.notify('success', 'Existo', 'Ingreso Existoso!');
        this.ngOnInit();
        this.showDialogCC = false;
      }, err => {
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
        console.log(err);
      });
    } else {
      if (this.checked) {
        this.messageGrowlService.notify('error', 'Error', 'La cantidad total de personas de ser mayor que 0!');
        document.getElementById('numMujeres').style.borderColor = '#FE2E2E';
        document.getElementById('numHombres').style.borderColor = '#FE2E2E';
      } else {
        document.getElementById('numMujeres').style.borderColor = '#FE2E2E';
      }
    }
  }

  updateCover() {

  }

  plusMan() {
    if (this.objCover.numHombres < 100)
      this.objCover.numHombres++;
  }

  lessMan() {
    if (this.objCover.numHombres > 0)
      this.objCover.numHombres--;
  }

  plusWoman() {
    if (this.objCover.numMujeres < 100)
      this.objCover.numMujeres++;
  }

  lessWoman() {
    if (this.objCover.numMujeres > 0)
      this.objCover.numMujeres--;
  }

  plusCantProdM() {
    if (this.cantProdMujeres < 100)
      this.cantProdMujeres++;
  }

  lessCantProdM() {
    if (this.cantProdMujeres > 1)
      this.cantProdMujeres--;
  }

  plusCantProdH() {
    if (this.cantProdHombres < 100)
      this.cantProdHombres++;
  }

  lessCantProdH() {
    if (this.cantProdHombres > 1)
      this.cantProdHombres--;
  }

  cantProdMujeres = 1;
  cantProdHombres = 1;

  lstSelectedProdM: any[];
  lstSelectedProdH: any[];

  selected_ProductoM: any[];
  selected_ProductoH: any[];

  selected_selProductoM: any;
  selected_selProductoH: any;

  bcLstProdExisM = '';
  bcLstProdExisH = '';
  bcLstProdM = '';
  bcLstProdH = '';


  addItemM() {
    this.bcLstProdM = '';
    if (this.selected_ProductoM !== undefined) {
      let a: any = this.selected_ProductoM;
      let aux = {
        cantidad: this.cantProdMujeres,
        label: a.nombre,
        value: a
      }
      const index = this.lstSelectedProdM.findIndex(x => x.value === this.selected_ProductoM);
      if (index == -1) {
        this.lstSelectedProdM = [...this.lstSelectedProdM, aux];
      } else {
        this.lstSelectedProdM[index].cantidad += this.cantProdMujeres;
      }
      this.cantProdMujeres = 1;
      this.objCover.productoMujeres = this.lstSelectedProdM;
    } else {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto existente!');
      this.bcLstProdExisM = '#FE2E2E';
    }
    this.selected_ProductoM = undefined;
  }

  deleteItemM() {
    this.bcLstProdM = '';
    if (this.selected_selProductoM !== undefined) {
      let nombre = this.selected_selProductoM.nombre;
      this.lstSelectedProdM = this.lstSelectedProdM.filter(function (obj) {
        return obj.value.nombre.localeCompare(nombre);
      });
    } else {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto de la lista de productos seleccionados Mujeres!');
      this.bcLstProdM = '#FE2E2E';
    }
    this.selected_selProductoM = undefined;
  }

  selecProdM(event) {
    this.selected_ProductoM = event.data;
  }

  addItemH() {
    this.bcLstProdH = '';
    if (this.selected_ProductoH !== undefined) {
      let a: any = this.selected_ProductoH;
      let aux = {
        cantidad: this.cantProdHombres,
        label: a.nombre,
        value: a
      }
      const index = this.lstSelectedProdH.findIndex(x => x.value === this.selected_ProductoH);
      if (index == -1) {
        this.lstSelectedProdH = [...this.lstSelectedProdH, aux];
      } else {
        this.lstSelectedProdH[index].cantidad += this.cantProdHombres;
      }
      this.cantProdHombres = 1;
      this.objCover.productoHombres = this.lstSelectedProdH;
    } else {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto existente!');
      this.bcLstProdExisH = '#FE2E2E';
    }
    this.selected_ProductoH = undefined;
  }

  deleteItemH() {
    this.bcLstProdH = '';
    if (this.selected_selProductoH !== undefined) {
      let nombre = this.selected_selProductoH.nombre;
      this.lstSelectedProdH = this.lstSelectedProdH.filter(function (obj) {
        return obj.value.nombre.localeCompare(nombre);
      });
    } else {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto de la lista de productos seleccionados Hombres!');
      this.bcLstProdH = '#FE2E2E';
    }
    this.selected_selProductoH = undefined;
  }

  selecProdH(event) {
    this.selected_ProductoH = event.data;
  }

  setOriginalColorsCover() {
    document.getElementById("nombre").style.borderColor = '';
    document.getElementById('numMujeres').style.borderColor = '';
    this.bcLstProdExisM = '';
    this.bcLstProdExisH = '';
    this.bcLstProdM = '';
    this.bcLstProdH = '';
  }

  setOriginalColorsCoverU() {
    document.getElementById("nombreU").style.borderColor = "#DADAD2";
  }
  /*Promos*/
  lstPromos: any[];
  selectedPromos: any;
  productos: any[];
  lstProdsPromo: any[];

  searchDescProd(id, myArray) {
    for (const entry of myArray) {
      if (entry._id === id) {
        return entry.nombre;
      }
    }
  }

  onRowSelect(event) {
    this.promocionService.getById(event.data._id).subscribe(data => {
      data[0].estado = 1;
      if (data[0].tipoPromo.localeCompare('DP') === 0) {
        this.fillLstProdsPromo(data[0])
      }
      this.promocionService.update(data[0]).subscribe(data => {
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

  onRowSelectInit(_id) {
    this.promocionService.getById(_id).subscribe(data => {
      data[0].estado = 1;
      if (data[0].tipoPromo.localeCompare('DP') === 0) {
        this.fillLstProdsPromoInit(data[0])
      }
      this.promocionService.update(data[0]).subscribe(data => {
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', "Algo salió mal!");
      })
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', "Algo salió mal!");
    })
  }

  onRowUnselect(event) {
    this.promocionService.getById(event.data._id).subscribe(data => {
      data[0].estado = 0;
      if (data[0].tipoPromo.localeCompare('DP') === 0) {
        this.removeLstProdsPromo(data[0]);
      }
      this.promocionService.update(data[0]).subscribe(data1 => {
        this.messageGrowlService.notify('info', 'Información', "Se ha deshabilitado una promoción!");
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', "Algo salió mal!");
      })
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', "Algo salió mal!");
    })
  }

  fillLstProdsPromo(data) {
    for (let entry of data.productosV) {
      let ind = this.lstProdsPromo.findIndex(x => x._id === entry.id);
      if (ind === -1) {
        let index = this.lstProductos.findIndex(x => x._id === entry.id);
        let aux = {
          _id: entry.id,
          nombre: this.lstProductos[index].nombre,
          precio_venta: this.lstProductos[index].precio_venta,
          promocion: [],
          selected: undefined
        }
        let promo = { nombre: data.nombre, precio_venta: entry.precio_venta }
        aux.promocion.push(promo);
        aux.selected = promo;
        this.lstProdsPromo = [...this.lstProdsPromo, aux];
        this.updateActivePrice(aux._id, aux.selected);
      } else {
        let promo = { nombre: data.nombre, precio_venta: entry.precio_venta }
        this.lstProdsPromo[ind].promocion.push(promo);
        this.updateActivePrice(entry.id, this.lstProdsPromo[ind].promocion[0]);
      }
    }
  }

  removeLstProdsPromo(data) {
    for (let entry of data.productosV) {
      let ind = this.lstProdsPromo.findIndex(x => x._id === entry.id);
      if (ind !== -1) {
        let nombre = data.nombre;
        this.lstProdsPromo[ind].promocion = this.lstProdsPromo[ind].promocion.filter(function (obj) {
          return obj.nombre.localeCompare(nombre);
        });

        if (this.lstProdsPromo[ind].promocion.length > 0) {
          this.lstProdsPromo[ind].selected = this.lstProdsPromo[ind].promocion[0];
          this.updateActivePrice(entry.id, this.lstProdsPromo[ind].promocion);
        } else {
          this.lstProdsPromo = this.lstProdsPromo.filter(function (obj) {
            return obj._id.localeCompare(entry.id);
          });
          this.updateActivePrice(entry.id, []);
        }
      }
    }
  }

  fillLstProdsPromoInit(data) {
    for (let entry of data.productosV) {
      let ind = this.lstProdsPromo.findIndex(x => x._id === entry.id);
      if (ind === -1) {
        let index = this.lstProductos.findIndex(x => x._id === entry.id);
        let aux = {
          _id: entry.id,
          nombre: this.lstProductos[index].nombre,
          precio_venta: this.lstProductos[index].precio_venta,
          promocion: [],
          selected: undefined
        }
        let promo = { nombre: data.nombre, precio_venta: entry.precio_venta };
        aux.promocion.push(promo);
        aux.selected = promo;
        this.lstProdsPromo = [...this.lstProdsPromo, aux];

      } else {
        let promo = { nombre: data.nombre, precio_venta: entry.precio_venta }
        this.lstProdsPromo[ind].promocion.push(promo);

        let index = this.lstProductos.findIndex(x => x._id === entry.id);
        let promo1 = {
          nombre: this.lstProductos[index].promocion[0].nombre,
          precio_venta: this.lstProductos[index].promocion[0].precio_venta
        }
        let i = this.lstProdsPromo[ind].promocion.findIndex(x => x.nombre === promo1.nombre);
        if (i !== -1) {
          this.lstProdsPromo[ind].selected = this.lstProdsPromo[ind].promocion[i];
        }
      }
    }
    //console.log(this.lstProdsPromo);
  }

  saveActivePrice() {
    if (this.selectedPromos.length > 0) {
      let i = 0;
      for (let entry of this.lstProdsPromo) {
        this.productoService.getById(entry._id).subscribe(data => {
          data[0].promocion = [];
          data[0].promocion.push(entry.selected);
          this.productoService.updateProducto(data[0]).subscribe(data => {
            i++;
            if (i == this.lstProdsPromo.length) {
              this.messageGrowlService.notify('info', 'Información', "Cambios Guardados!");
            }
          }, err => {
            console.log(err);
          });
        }, err => {
          console.log(err);
        });
      }
    } else {
      this.messageGrowlService.notify('warn', 'Advertencia', "No existen promociones activas!");
    }
  }

  updateActivePrice(id, vec) {
    let i = 0;
    this.productoService.getById(id).subscribe(data => {
      data[0].promocion = [];
      data[0].promocion.push(vec);
      this.productoService.updateProducto(data[0]).subscribe(data => {
        this.messageGrowlService.notify('info', 'Información', "Cambios Guardados!");
      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err);
    });
  }


  ngOnInitPromo() {
    this.lstPromos = [];
    this.productos = [];
    this.selectedPromos = [];
    this.lstProdsPromo = [];
    this.promocionService.getAll().subscribe(data => {
      this.productoService.getAll().subscribe(p => {
        this.productos = p;
        for (let entry of data) {
          let aux = { _id: entry._id, nombre: entry.nombre, tipoPromo: entry.tipoPromo, productosV: entry.productosV, estado: entry.estado };
          if (!entry.productosV[0].hasOwnProperty('id')) {
            aux.tipoPromo = 'Asociar Producto';
            let filaP = '';
            for (let p of entry.productosV[0].p) {
              filaP += '-' + p.cantidad + ' ' + this.searchDescProd(p.id, this.productos) + ' ';
            }
            let filaR = '';
            for (let r of entry.productosV[1].r) {
              filaR += '-' + r.cantidad + ' ' + this.searchDescProd(r.id, this.productos) + ' ';
            }
            aux.productosV = 'POR: ' + filaP + ' RECIBE: ' + filaR + 'PRECIO: $' + entry.productosV[2].v;
          } else {
            aux.tipoPromo = 'Descontar Precio';
            let fila = '';
            for (let prod of entry.productosV) {
              fila += '-' + this.searchDescProd(prod.id, this.productos) + ' $' + this.decimalPipe.transform(prod.precio_venta, '1.2-2') + ' ';
            }
            aux.productosV = fila;
          }
          if (aux.estado === 1 && aux.tipoPromo.localeCompare('Descontar Precio') === 0) {
            this.selectedPromos = [...this.selectedPromos, aux];
            this.onRowSelectInit(aux._id)
          }
          this.lstPromos = [...this.lstPromos, aux];
        }
      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err);
    });
  }

  /*Tarjetas*/
  settingsT = {
    mode: 'external',
    noDataMessage: 'No existen registros',
    columns: {
      cardNumber: {
        title: 'Numero Tarjeta',
        width: '12%',
      },
      ci: {
        title: 'CI. Cliente',
        width: '12%'
      },
      nombre: {
        title: 'Nombre Cliente',
        width: '15%'
      },
      cantMujeres: {
        title: 'Cant. Mujeres',
        width: '10%'
      },
      cantHombres: {
        title: 'Cant. Hombres',
        width: '10%'
      },
      abono: {
        title: 'Abono',
        width: '10%'
      },
      fechaHora: {
        title: 'Fecha',
        width: '15%'
      },
      limite: {
        title: 'Limite',
        width: '10%'
      }
    },
    actions: {
      // columnTitle: '',
      add: false,
      edit: true,
      delete: false
    },
    attr: {
      class: 'table-bordered table-hover table-responsive'
    }
  };
  sourceT: LocalDataSource = new LocalDataSource();
  showDialogTC = false;
  showDialogTU = false;
  objTarjeta = {
    cardNumber: '',
    ci: '',
    nombre: '',
    cantMujeres: 0,
    cantHombres: 0,
    abono: 0,
    fechaHora: '',
    limite: 0,
    idFactura: ''
  };
  objTarjetaUpdate = {
    cardNumber: '',
    ci: '',
    nombre: '',
    cantMujeres: 0,
    cantHombres: 0,
    abono: 0,
    fechaHora: '',
    limite: 0
  };
  consumoActual = 0;
  nuevoConsumo = 0;

  ngOnInitTarjetas() {
    this.sourceT = new LocalDataSource();
    this.activeCardsService.getAllActives().subscribe(data => {
      for (let entry of data) {
        let aux = {
          abono: entry.abono,
          cantHombres: (entry.cantHombres + entry.ingresoHombres) - entry.egresoHombres,
          cantMujeres: (entry.cantMujeres + entry.ingresoMujeres) - entry.egresoMujeres,
          cardNumber: entry.cardNumber,
          ci: entry.ci,
          fechaHora: entry.fechaHora,
          limite: 0,
          nombre: entry.nombre,
          idFactura: entry.idFactura
        }
        this.tarjetaService.getByNumero(aux.cardNumber).subscribe(data => {
          aux.limite = data[0].limite;
          this.sourceT.add(aux);
          this.sourceT.refresh();
        }, err => {
          console.log(err);
        });
      };
    }, err => {
      console.log(err);
    });

  }

  onUpdateT(event: any) {
    this.consumoActual = 0;
    this.objTarjeta = event.data;
    this.facturaService.getById(this.objTarjeta.idFactura).subscribe(data => {
      for (let entry of data[0].detalleFacturaV) {
        this.consumoActual += entry.total;
      }
      this.nuevoConsumo = this.consumoActual;
      setTimeout(function () {
        document.getElementById('limiteNuevo').focus();
      }, 0);
    }, err => {
      console.log(err);
    });
  }

  plusLimite() {
    //if (this.nuevoConsumo < this.objTarjeta.limite)
    this.nuevoConsumo++;
  }

  lessLimite() {
    if (this.nuevoConsumo > this.consumoActual)
      this.nuevoConsumo--;
  }

  onAddTSubmit() {
    this.tarjetaService.getByNumero(this.objTarjeta.cardNumber).subscribe(data => {
      data[0].limite = this.nuevoConsumo;
      this.tarjetaService.update(data[0]).subscribe(data => {
        this.messageGrowlService.notify('info', 'Información', 'Modificación Existosa!');
        this.ngOnInitTarjetas();
        this.showDialogTU = false;
      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err);
    });
  }

  /*Corte Caja*/
  calcVentas() {
    this.ventasTotales = this.ventasEfectivo + this.ventasTarjeta + this.ventasCheque + this.ventasCredito;
  }

  calcMoney() {
    this.dineroCaja = this.fondoCaja + this.abonosEfectivo + this.entradas - this.salidas + this.ventasEfectivo;
  }

  calcPersonas() {
    this.cantPersonas = this.inMujeres + this.inHombres - this.outMujeres - this.outHombres;
  }

  onChangeCaja($event) {
    console.log(this.selected_caja)
  }

  //Width detection
  textAlignTitle = 'left';

  onResize(event) {
    let x = event.target.innerWidth;
    //console.log(x)
    if (x < 768) {
      this.textAlignTitle = 'center';
    } else {
      this.textAlignTitle = 'left';
    }
  }

  onRzOnInit(x) {
    if (x < 768) {
      this.textAlignTitle = 'center';
    } else {
      this.textAlignTitle = 'left';
    }
  }

}
