declare const require: any;
import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { AssetTableComponent } from './components/asset-table/asset-table.component';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  constructor(private modalService: ModalService) {}

  openModal() {
    const content = AssetTableComponent;
    const confirmationText = 'Continue without saving?';
    const modalModifierClass = 'fullscreen';
    let fullscreen;
    let data;

    this.modalService.open(
      { content, data },
      {
        fullscreen,
        modifierClass: modalModifierClass,
        confirmationText,
      },
    );
  }

  ngOnInit(): void {}

  onActivate(e, main): void {
    main.scrollTop = 0;
  }
}
