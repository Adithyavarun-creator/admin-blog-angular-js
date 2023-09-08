import { Component, OnInit } from '@angular/core';
import { SubscribersService } from '../services/subscribers.service';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css'],
})
export class SubscribersComponent implements OnInit {
  userArrays: any;

  constructor(private subscribeService: SubscribersService) {}

  ngOnInit(): void {
    this.subscribeService.loadSubscribers().subscribe((val) => {
      this.userArrays = val;
    });
  }

  onDelete(id: string) {
    return this.subscribeService.deleteSubscribers(id);
  }
}
