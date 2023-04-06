import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'full-page-demo',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './full-page-demo.component.html',
  styleUrls: ['./full-page-demo.component.css'],
})
export class FullPageDemoComponent {
  constructor(private route: ActivatedRoute) {}
  readonly demoRoute = 'demo';
  isDemo$ = this.route.url.pipe(map((url) => url.at(-1)?.path === this.demoRoute));
}
