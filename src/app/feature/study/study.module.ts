import { NgModule } from '@angular/core';
import { StudySearchComponent } from './pages/study-search/study-search.component';
import { StudyRoutingModule } from './study-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [StudySearchComponent],
    imports: [
        SharedModule,
        StudyRoutingModule,
        MatPaginatorModule,
        MatSortModule,
        MatAutocompleteModule,
        MatSelectModule
    ]
})
export class StudyModule { }
