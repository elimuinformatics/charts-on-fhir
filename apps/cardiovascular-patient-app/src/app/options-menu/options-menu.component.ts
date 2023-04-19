import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'options-menu',
  templateUrl: './options-menu.component.html',
})
export class OptionsMenuComponent {
  @Input() legend?: boolean;
  @Output() legendChange = new EventEmitter<boolean>();
}
