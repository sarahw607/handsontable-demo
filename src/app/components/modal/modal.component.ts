import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { ModalFullscreenAnimation, ModalVisibility } from '../../enums';
import { isArray } from 'lodash-es';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  animations: [
    trigger('modalTransition', [
      state(
        'open',
        style({
          opacity: 1,
          zIndex: 5,
        }),
      ),
      state(
        'void, closed',
        style({
          opacity: 0,
          zIndex: -1,
        }),
      ),
      transition('* => open', [
        animate('0.3s step-start', style({ zIndex: 5 })),
        animate('0.3s ease', style({ opacity: 1 })),
      ]),
      transition('* => closed', [
        animate('0.3s ease', style({ opacity: 0 })),
        animate('0.3s step-end', style({ zIndex: -1 })),
      ]),
    ]),
    trigger('fullscreenTransition', [
      state(
        'off',
        style({
          height: '800px',
          maxHeight: '100%',
          width: '1280px',
        }),
      ),
      state(
        'on',
        style({
          height: '100%',
          maxHeight: '100%',
          width: '100%',
        }),
      ),
      transition('on <=> off', animate('0.4s ease-in-out')),
    ]),
  ],
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  @Input() confirmationText: string;
  @Input() fullscreen: ModalFullscreenAnimation;
  @Input() modifierClass: string | string[];

  @Output() closed = new EventEmitter();

  destroyed$ = new Subject();
  hasConfirmed = false;
  showConfirmation = false;
  visibility: ModalVisibility;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  get cancelClose(): () => void {
    return () => this.confirmCloseModal(false);
  }

  get confirmClose(): () => void {
    return () => this.confirmCloseModal(true);
  }

  get modifiedClass(): string {
    let modifier = 'modal';
    if (!this.modifierClass) {
      return modifier;
    }
    if (isArray(this.modifierClass)) {
      this.modifierClass.forEach(mClass => (modifier += ` modal--${mClass}`));
      return modifier;
    }
    return `modal modal--${this.modifierClass}`;
  }

  ngAfterViewInit(): void {
    this.visibility = ModalVisibility.Open;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  animationDone(event): void {
    if (event.toState === ModalVisibility.Closed) {
      this.closed.emit();
    }
  }

  close($event?: Event): void {
    this.visibility = ModalVisibility.Closed;
  }

  confirmCloseModal(confirm: boolean): void {
    this.showConfirmation = false;
    this.hasConfirmed = confirm;

    if (confirm) {
      this.close();
    }
  }

  private isEmpty(value: any): boolean {
    return value == null || value.length === 0;
  }
}
