import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotTableModule } from '@handsontable/angular';
import { AppComponent } from './app.component';
import { AssetTableComponent } from './components/asset-table/asset-table.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [AppComponent, AssetTableComponent, ModalComponent],
  imports: [BrowserAnimationsModule, BrowserModule, HotTableModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
