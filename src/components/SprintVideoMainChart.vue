<template>
  <div id="chart">
    <div class="toolbar" style="margin-left:20px">
      <a-button
        @click="updateData('one_day')"
        id="one_day"
        :class="{active: selection==='one_day'}"
        style="margin-right:8px"
      >天</a-button>
      <a-button
        @click="updateData('one_week')"
        id="one_week"
        :class="{active: selection==='one_week'}"
        style="margin-right:8px"
      >周</a-button>
      <a-button
        @click="updateData('one_month')"
        id="one_month"
        :class="{active: selection==='one_month'}"
        style="margin-right:8px"
      >月</a-button>
      <a-button 
        @click="updateData('all')" 
        id="all" 
        :class="{active: selection==='all'}"
        style="margin-right:8px"
      >全部</a-button>
    </div>
    <apexchart type="area" height="350" :options="chartOptions" :series="series"/>
  </div>
</template>

<script>
export default {
  name: "SprintVideoMainChart",
  props: {
    records: Array
  },
  data: function() {
    return {
      selection: "all",
      latest_time: 0,
      series: [
      {
        data: null
      }
      ],
      chartOptions: {
        chart: {
          toolbar: {
            tools: {
              download: false,
            },
          },
          zoom: {
            type: "xy"
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: "hollow"
        },
        xaxis: {
          type: "datetime",
          //min: this.latest_time - 7 * 24 * 60 * 60 * 1000,
          tickAmount: 6,
          labels: {
            rotate: 0
          }
        },
        yaxis: {
          labels: {
            show: true
          }
        },
        tooltip: {
          x: {
            format: "yyyy-MM-dd HH:mm:ss"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        }
      }
    }
  },
  watch: {
    records: function (newRecords, oldRecords) {
      var arr = new Array()
      newRecords.forEach(v => arr.push([v.added * 1000, v.view]))
      this.series = [{
        name: "播放",
        data: arr
      }]
      this.latest_time = arr[arr.length - 1][0]
    }
  },
  methods: {
    updateData: function (timeline) {
      this.selection = timeline;
      switch (timeline) {
        case 'one_day':
          this.chartOptions = {
            xaxis: {
              min: this.latest_time - 1 * 24 * 60 * 60 * 1000,
              max: undefined,
            }
          }
          break;
        case 'one_week':
          this.chartOptions = {
            xaxis: {
              min: this.latest_time - 7 * 24 * 60 * 60 * 1000,
              max: undefined,
            }
          }
          break;
        case 'one_month':
          this.chartOptions = {
            xaxis: {
              min: this.latest_time - 30 * 24 * 60 * 60 * 1000,
              max: undefined,
            }
          }
          break;
        case 'all':
          this.chartOptions = {
            xaxis: {
              min: undefined,
              max: undefined,
            }
          }
          break;
        default:
          break;
      }
    }
  },
  mounted: function () {
    if (document.body.clientWidth <= 576){
      this.chartOptions = {...this.chartOptions, ...{
        yaxis: {
          labels: {
            show : false
          }
        }
      }}
    } else {
      this.chartOptions = {...this.chartOptions, ...{
        yaxis: {
          labels: {
            show : true
          }
        }
      }}
    }
    var that = this;
    window.addEventListener('resize',() => {
      if (document.body.clientWidth <= 576){
        that.chartOptions = {...this.chartOptions, ...{
          yaxis: {
            labels: {
              show : false
            }
          }
        }}
      } else {
        that.chartOptions = {...this.chartOptions, ...{
          yaxis: {
            labels: {
              show : true
            }
          }
        }}
      }
    },false);
  },
};

var resetCssClasses = function (activeEl) {
      var els = document.querySelectorAll("button");
      Array.prototype.forEach.call(els, function (el) {
        el.classList.remove('active');
      });

      activeEl.target.classList.add('active')
    }

</script>
