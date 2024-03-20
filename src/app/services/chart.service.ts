import { Injectable } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js/dist/types/index';
import { currencyFormat } from '../config/currencyFormat';
import { currentDate } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  readonly chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    elements: {
      line: {
        tension: 0.6
      },
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: { display: true, },
      tooltip: {
        bodyFont: {
          size: 16
        },
        titleFont: {
          size: 18
        },
        callbacks: {
          label: (tooltipItem) => {
            console.log(tooltipItem);
            return '';
          }
        }
      },
    },
  };

  readonly doughnutChart: { type: ChartType, options: ChartOptions; } = {
    type: 'doughnut',
    options: {
      maintainAspectRatio: true,
      elements: {
        line: {
          tension: 0.6
        },
      },
      // interaction: {
      //   intersect: false,
      //   mode: 'index'
      // },
      plugins: {
        legend: { display: true, position: 'left' },
        tooltip: {
          bodyFont: {
            size: 16
          },
          titleFont: {
            size: 18
          },
          callbacks: {
            label: (tooltipItem) => {
              return currencyFormat(tooltipItem.parsed);
            }
          }
        },
      },
    }
  };

  readonly barChart: { type: ChartType, options: ChartOptions; } = {
    type: 'bar',
    options: {
      elements: {
        line: {
          tension: 0.6
        },
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: { display: true, },
        tooltip: {
          bodyFont: {
            size: 16
          },
          titleFont: {
            size: 18
          }
        },
      },
    }
  };

  readonly lineChart: { type: ChartType, options: ChartOptions; } = {
    type: 'line',
    options: {
      maintainAspectRatio: false,
      transitions: {
        show: {
          animations: {
            x: {
              from: 0
            },
          }
        },
        hide: {
          animations: {
            x: {
              to: 0
            },
          }
        }
      },
      // animations: {
      //   tension: {
      //     duration: 500,
      //     easing: 'easeOutQuad',
      //     from: 0.4,
      //     to: 0.5,
      //     loop: true
      //   }
      // },
      elements: {
        line: {
          tension: 0.6
        },
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        tooltip: {
          bodyFont: {
            size: 16
          },
          titleFont: {
            size: 18
          },
          callbacks: {
            title: (tooltipItems) => {
              const label = tooltipItems[0].label.split(' '); // split <number> <am/pm>

              const title = `${label[0]}:00 - ${label[0]}:59 ${label[1]}`;
              return title;
            }
          }
        },
        legend: {
          display: true
        }
      },
    }
  };

  constructor () { }

  createChart(type: string) {

  }

  updateChart(type: string) {

  }
}
