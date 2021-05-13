import { Component, OnInit } from '@angular/core';

declare var diff_match_patch: any;
import 'src/assets/js/diff_match_patch.js';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-versioning',
  templateUrl: './versioning.component.html',
  styleUrls: ['./versioning.component.css']
})
export class VersioningComponent implements OnInit {

  diffHtml = '';

  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main('I am the very model of a modern Major-General,\n' +
      'I\'ve information vegetable, animal, and mineral,\n' +
      'I know the kings of England, and I quote the fights historical,\n' +
      'From Marathon to Waterloo, in order categorical.',
      'I am the very model of a cartoon individual,\n' +
      'My animation\'s comical, unusual, and whimsical,\n' +
      'I\'m quite adept at funny gags, comedic theory I have read,\n' +
      'From wicked puns and stupid jokes to anvils that drop on your head,\n' +
      'in order categorical.');
    dmp.diff_cleanupSemantic(diff);
    this.diffHtml = dmp.diff_prettyHtml(diff);
  }

}
