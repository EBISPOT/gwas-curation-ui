import { Component, Inject, OnInit } from '@angular/core';

declare var diff_match_patch: any;
import 'src/assets/js/diff_match_patch.js';
import { DomSanitizer } from '@angular/platform-browser';
import { TreeNode } from '../../../../core/models/treeNode';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { VersioningDetails } from '../../../../core/models/versioningDetails';

@Component({
  selector: 'app-versioning',
  templateUrl: './versioning.component.html',
  styleUrls: ['./versioning.component.css']
})
export class VersioningComponent implements OnInit {

  diffHtml = '';
  // fixes a bug where when opening the dialog the panels start expanded and quickly collapse
  disableAnimation = true;
  studyTreeControl = new NestedTreeControl<TreeNode>(node => node.children);
  studyDataSource = new MatTreeNestedDataSource<TreeNode>();
  associationTreeControl = new NestedTreeControl<TreeNode>(node => node.children);
  associationDataSource = new MatTreeNestedDataSource<TreeNode>();
  sampleTreeControl = new NestedTreeControl<TreeNode>(node => node.children);
  sampleDataSource = new MatTreeNestedDataSource<TreeNode>();

  constructor(public sanitizer: DomSanitizer, @Inject(MAT_DIALOG_DATA) public data: VersioningDetails) {
    this.studyDataSource.data = data.studyTree;
    this.associationDataSource.data = data.associationTree;
    this.sampleDataSource.data = data.sampleTree;
  }

  ngOnInit(): void {
    setTimeout(() => this.disableAnimation = false);
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

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

}
