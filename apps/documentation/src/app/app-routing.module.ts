import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartLayoutDemoComponent } from './pages/components/chart-layout/demo/chart-layout-demo.component';

const routes: Routes = [{ path: 'demo', component: ChartLayoutDemoComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
