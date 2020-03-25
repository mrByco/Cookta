import { Component, OnInit } from '@angular/core';
import {ServerService} from '../../shared/services/server.service';

@Component({
  selector: 'app-debug-options',
  templateUrl: './debug-options.component.html',
  styleUrls: ['./debug-options.component.css']
})
export class DebugOptionsComponent implements OnInit {
  State: boolean;

  constructor(public serverService: ServerService) { }

  ngOnInit() {
  }
}
