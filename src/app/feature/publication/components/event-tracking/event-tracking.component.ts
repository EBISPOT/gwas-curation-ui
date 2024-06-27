import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { PublicationEvent } from 'src/app/core/models/publicationEvent';
import { EventTrackingService } from 'src/app/core/services/event-tracking.service';

@Component({
  selector: 'app-event-tracking',
  templateUrl: './event-tracking.component.html',
  styleUrls: ['./event-tracking.component.css']
})
export class EventTrackingComponent implements OnInit, AfterViewInit {

  isLoadingResults = true;
  publicationId: string
  dataSource: MatTableDataSource<PublicationEvent>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  resultsLength = 0;
  displayedColumns: string[] = ['event', 'eventDetails', 'timestamp', 'email'];

  constructor(private route: ActivatedRoute, private eventTrackingService :  EventTrackingService) { }

  ngOnInit(): void {

    this.publicationId = this.route.snapshot.paramMap.get('publicationId');
    
  }

  ngAfterViewInit() {
    // add this.sort.sortChange to merge() params and delete datasource.sort = sort in subscribe() to enable server-side sorting
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.eventTrackingService.getPublicationEvents(this.paginator.pageSize, this.paginator.pageIndex,
             this.sort.active, this.sort.direction, this.publicationId )
            }),
            map(data => {
              this.isLoadingResults = false;
              this.resultsLength = data.page.totalElements;
              return data?._embedded?.publicationAuditEntryDtos;
            }),
            catchError(() => {
              this.isLoadingResults = false;
              return of([]);
            })
          ).subscribe(value => {
            this.dataSource = new MatTableDataSource<PublicationEvent>(value);
          });
    }

    resetPaging(): void {

      this.paginator.pageIndex = 0;
    }
  }
