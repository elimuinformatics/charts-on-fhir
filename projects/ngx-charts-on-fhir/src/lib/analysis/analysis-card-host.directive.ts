import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[cardHost]',
})
export class AnalysisCardHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
