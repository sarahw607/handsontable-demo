import { TemplateRef, Type } from '@angular/core';

export type Content<T> = string | TemplateRef<T> | Type<T>;
