import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { DecimalPipe, DatePipe, SlicePipe } from '@angular/common';
/*My Components*/
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CardComponent } from './components/card/card.component';
import { DialogComponent } from './components/dialogLogin/dialog.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { PersonalComponent } from './components/personal/personal.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ImageRenderComponent } from './components/image-render/image-render.component';
import { IconRenderComponent } from './components/image-render/icon-render.component';
import { IconRenderKComponent } from './components/image-render/icon-renderK.component';
import { PrintRenderComponent } from './components/image-render/print-render.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { InventarioComponent } from './components/inventario/inventario.component';
/*Services*/
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { TipoProductoService } from './services/tipo-producto.service';
import { ProductoService } from './services/producto.service';
import { ClienteService } from './services/cliente.service';
import { TipoClienteService } from './services/tipo-cliente.service';
import { CargoPersonalService } from './services/cargo-personal.service';
import { PersonalService } from './services/personal.service';
import { MessageGrowlService } from './services/message-growl.service';
import { FormatterService } from './services/formatter.service';
import { TarjetaService } from './services/tarjeta.service';
import { FacturaService } from './services/factura.service';
import { DetalleFacturaService } from './services/detalle-factura.service';
import { PromocionService } from './services/promocion.service';
import { LocalStorageService } from './services/local-storage.service';
import { ActiveCardsService } from './services/active-cards.service';
import { ProveedorService } from './services/proveedor.service';
import { KardexService } from './services/kardex.service';
import { CoverService } from './services/cover.service';
import { CajaService } from './services/caja.service';
import { ConfigurationService } from './services/configuration.service';
import { MateriaPrimaService } from './services/materia-prima.service';
/*angular-2-ui-framework*/
import { TabsModule } from './com/tabs/tabs.module';
import { DatepickerModule } from './com/datepicker/datepicker.module';
import { TooltipModule } from './com/tooltip/tooltip.module'
/*Libraries*/
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Ng2CompleterModule } from 'ng2-completer';
import { Angular2FontawesomeModule } from 'angular2-fontawesome'
import { CurrencyMaskModule } from "ng2-currency-mask";
import { MdTooltipModule, MdDialogModule, MdCheckboxModule, MdRadioModule, MdSlideToggleModule } from '@angular/material';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {
  GrowlModule, PanelModule, DropdownModule, ButtonModule, DataTableModule, InputSwitchModule, AutoCompleteModule,
  ToggleButtonModule, SpinnerModule, SharedModule, CheckboxModule, TabViewModule, ListboxModule, PasswordModule,
  CalendarModule, DataGridModule, DialogModule, BlockUIModule, SelectButtonModule, InputMaskModule, ProgressBarModule,
} from 'primeng/primeng';

import { AppComponent } from './app.component';
import { NotificationComponent } from './components/notification/notification.component';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';
import { PipeRenderComponent } from './components/pipe-render/pipe-render.component';
import { SubprodRenderComponent } from './components/subprod-render/subprod-render.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { AdministrarComponent } from './components/administrar/administrar.component';
import { CoverprodRenderComponent } from './components/coverprod-render/coverprod-render.component';

/*Navigation*/
const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'card', component: CardComponent, canActivate: [AuthGuard] },
  { path: 'facturacion', component: FacturacionComponent, canActivate: [AuthGuard] },
  { path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard] },
  { path: 'personal', component: PersonalComponent, canActivate: [AuthGuard] },
  { path: 'productos', component: ProductosComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'administrar', component: AdministrarComponent, canActivate: [AuthGuard] },
  { path: 'configuration', component: ConfigurationComponent, canActivate: [AuthGuard] },

  { path: 'inventario', component: InventarioComponent, canActivate: [AuthGuard] }
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    CardComponent,
    DialogComponent,
    FacturacionComponent,
    ClientesComponent,
    PersonalComponent,
    ProductosComponent,
    ImageRenderComponent,
    IconRenderComponent,
    IconRenderKComponent,
    PrintRenderComponent,
    ConfirmDialogComponent,
    InventarioComponent,
    NotificationComponent,
    AppLoaderComponent,
    PipeRenderComponent,
    SubprodRenderComponent,
    ConfigurationComponent,
    AdministrarComponent,
    CoverprodRenderComponent
  ],
  entryComponents: [ImageRenderComponent, IconRenderComponent, IconRenderKComponent, PrintRenderComponent, ConfirmDialogComponent, PipeRenderComponent, SubprodRenderComponent, CoverprodRenderComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    TabsModule,
    DatepickerModule,
    TooltipModule,
    Angular2FontawesomeModule,
    Ng2SmartTableModule,
    Ng2CompleterModule,
    CurrencyMaskModule,
    MdTooltipModule, MdDialogModule, MdCheckboxModule, MdRadioModule, MdSlideToggleModule,
    SimpleNotificationsModule.forRoot(),
    GrowlModule, PanelModule, DropdownModule, ButtonModule, DataTableModule, SharedModule, CheckboxModule,
    TabViewModule, CalendarModule, DataGridModule, DialogModule, ToggleButtonModule, BlockUIModule, PasswordModule,
    SpinnerModule, SelectButtonModule, InputMaskModule, ListboxModule, ProgressBarModule, InputSwitchModule, AutoCompleteModule
  ],
  providers: [ValidateService, AuthService, AuthGuard, TipoProductoService, ProductoService, FormatterService, ConfigurationService,
    CargoPersonalService, PersonalService, ClienteService, TipoClienteService, MessageGrowlService, TarjetaService, CoverService, CajaService, MateriaPrimaService,
    FacturaService, DetalleFacturaService, PromocionService, DecimalPipe, DatePipe, SlicePipe, LocalStorageService, ActiveCardsService, ProveedorService, KardexService],
  bootstrap: [AppComponent]
})

export class AppModule { }
