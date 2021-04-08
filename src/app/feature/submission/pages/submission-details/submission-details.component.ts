import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-submission-details',
  templateUrl: './submission-details.component.html',
  styleUrls: ['./submission-details.component.css']
})
export class SubmissionDetailsComponent implements OnInit, AfterViewInit {

  constructor(private elRef: ElementRef) { }

  private ink: any;

  ngOnInit(): void {
  }

  tabChange(e: MatTabChangeEvent) {
    const btn = this.elRef.nativeElement
      .querySelectorAll('.mat-tab-label')[e.index];
    const top = btn.offsetTop;
    this.ink.style.top = `${top}px`;
    this.ink.style.height = `${btn.offsetHeight}px`;
  }

  ngAfterViewInit() {
    this.ink = this.elRef.nativeElement.querySelector('.mat-ink-bar');
    this.ink.classList.add('vertical');
    this.tabChange({index: 0, tab: null});
  }

}
