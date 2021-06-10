import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  TemplateRef,
  Type,
} from '@angular/core';
import { ModalComponent } from '../components/modal/modal.component';
import { ModalFullscreenAnimation, ModalVisibility } from '../enums';
import { Content } from '../types';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalComponentRef: ComponentRef<ModalComponent>;
  private containerComponentRef: ComponentRef<any>;
  private innerComponentRef;

  constructor(
    private appRef: ApplicationRef,
    @Inject(DOCUMENT) private document: Document,
    private injector: Injector,
    private resolver: ComponentFactoryResolver,
  ) {}

  animateModalSize(fullscreen: ModalFullscreenAnimation): void {
    this.modalComponentRef.instance.fullscreen = fullscreen;
  }

  closeModal(): void {
    if (!this.modalComponentRef) {
      return;
    }
    this.modalComponentRef.instance.visibility = ModalVisibility.Closed;
  }

  create<T>(
    container: { content: Type<T>; data?: any },
    inner?: { content: Content<T>; data?: any },
  ): ComponentRef<any> {
    if (!!this.containerComponentRef) {
      this.destroy();
    }
    const factory = this.resolver.resolveComponentFactory(container.content);
    const ngContent = this.resolveNgContent(inner.content, inner.data);
    this.containerComponentRef = factory.create(this.injector, ngContent);
    this.appRef.attachView(this.containerComponentRef.hostView);
    this.assignDataToComponent(container.data, this.containerComponentRef);
    this.containerComponentRef.hostView.detectChanges();
    const { nativeElement } = this.containerComponentRef.location;
    this.document.body.appendChild(nativeElement);
    return this.containerComponentRef;
  }

  destroy(): void {
    if (this.innerComponentRef) {
      this.appRef.detachView(this.innerComponentRef.hostView || this.innerComponentRef);
      this.innerComponentRef.destroy();
      this.innerComponentRef = null;
    }
    if (this.containerComponentRef) {
      this.appRef.detachView(this.containerComponentRef.hostView);
      this.containerComponentRef.destroy();
      this.containerComponentRef = null;
    }
  }

  open(inner: { content: Content<any>; data?: any }, data?: any): void {
    this.modalComponentRef = this.create({ content: ModalComponent, data }, inner);
    this.modalComponentRef.instance.closed
      .pipe(takeUntil(this.modalComponentRef.instance.destroyed$))
      .subscribe(() => this.destroy());
  }

  private assignDataToComponent<T>(data: any, componentRef: ComponentRef<T>): void {
    if (!data) {
      return;
    }
    for (const dataKey in data) {
      if (data.hasOwnProperty(dataKey)) {
        componentRef.instance[dataKey] = data[dataKey];
      }
    }
  }

  private resolveNgContent<T>(content: Content<T>, data?: any): any[][] {
    /** Content is a string */
    if (typeof content === 'string') {
      const element = this.document.createTextNode(content);
      return [[element]];
    }

    /** Content is an HTML template */
    if (content instanceof TemplateRef) {
      this.innerComponentRef = content.createEmbeddedView(null);
      this.appRef.attachView(this.innerComponentRef);
      return [this.innerComponentRef.rootNodes];
    }

    /** Otherwise it's a component */
    const factory = this.resolver.resolveComponentFactory(content);
    this.innerComponentRef = factory.create(this.injector);
    this.assignDataToComponent(data, this.innerComponentRef);
    this.appRef.attachView(this.innerComponentRef.hostView);
    this.innerComponentRef.hostView.detectChanges();
    return [[this.innerComponentRef.location.nativeElement]];
  }
}
