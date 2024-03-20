import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-view-statistics',
  templateUrl: './view-statistics.component.html',
  styleUrls: ['./view-statistics.component.scss'],
})
export class ViewStatisticsComponent implements OnInit {
  @Input() dateStr?: string;

  isError: boolean = false;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}

  closeStatisticsSummaryModal() {
    this.modalService.close('statisticsSummary');
  }
}
