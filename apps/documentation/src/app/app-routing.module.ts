import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartDemoComponent } from './pages/components/chart/demos/chart/chart-demo.component';

const routes: Routes = [{ path: 'demo', component: ChartDemoComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
