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
    aid: String // TODO should be Number, need to fix backend
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
          tickAmount: 6
        },
        tooltip: {
          x: {
            format: "yyyy-MM-dd hh:mm:ss"
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
    aid: function (newAid, oldAid) {
      fetch("http://api.bunnyxt.com/tdd/get_sprint_video_record.php?aid=" + this.aid)
        .then(response => response.json())
        .then(json => json.data)
        .then(data => {
          var arr = new Array()
          data.forEach(v => arr.push([parseInt(v.added) * 1000, parseInt(v.view)]))
          this.series = [{
            name: "播放",
            data: arr
          }]
          this.latest_time = arr[arr.length-1][0]
        })
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
  created: function () {
    fetch("http://api.bunnyxt.com/tdd/get_sprint_video_record.php?aid=" + this.aid)
      .then(response => response.json())
      .then(json => json.data)
      .then(data => {
        var arr = new Array()
        data.forEach(v => arr.push([parseInt(v.added) * 1000, parseInt(v.view)]))
        this.series = [{
          name: "播放",
          data: arr
        }]
        this.latest_time = arr[arr.length-1][0]
      })
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
