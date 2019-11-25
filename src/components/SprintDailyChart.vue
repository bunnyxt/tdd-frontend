<template>
  <apexchart type="area" height="350" :options="chartOptions" :series="series"/>
</template>

<script>
export default {
  name: "SprintDailyChart",
  props: {
    sprintDailyList: Array
  },
  data: function() {
    return {
      series: [
        {
          name: "播放增长",
          data: [
            [0, 0]
          ]
        }
      ],
      chartOptions: {
        annotations: {
          points: [{
            x: new Date('2019-03-20').valueOf(),
            y: 15389,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'red',
              radius: 2,
            },
            label: {
              borderColor: '#FF4560',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#FF4560',
              },
              text: '+大氿歌',
            }
          },{
            x: new Date('2019-03-25').valueOf(),
            y: 35735,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'red',
              radius: 2,
            },
            label: {
              borderColor: '#FF4560',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#FF4560',
              },
              text: '+大时代',
            }
          },{
            x: new Date('2019-03-26').valueOf(),
            y: 22812,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'red',
              radius: 2,
            },
            label: {
              borderColor: '#FF4560',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#FF4560',
              },
              text: '+夜间出租车',
            }
          },{
            x: new Date('2019-03-31').valueOf(),
            y: 12152,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'lightgreen',
              radius: 2,
            },
            label: {
              borderColor: '#00E396',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#00E396',
              },
              text: '-大氿歌',
            }
          },{
            x: new Date('2019-04-01').valueOf(),
            y: 22901,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'red',
              radius: 2,
            },
            label: {
              borderColor: '#FF4560',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#FF4560',
              },
              text: '+得过且过的勇者',
            }
          },{
            x: new Date('2019-04-24').valueOf(),
            y: 7086,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'lightgreen',
              radius: 2,
            },
            label: {
              borderColor: '#00E396',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#00E396',
              },
              text: '-得过且过的勇者',
            }
          },{
            x: new Date('2019-04-26').valueOf(),
            y: 6858,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'red',
              radius: 2,
            },
            label: {
              borderColor: '#FF4560',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#FF4560',
              },
              text: '+最美的夏天',
            }
          },{
            x: new Date('2019-04-28').valueOf(),
            y: 18155,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'lightgreen',
              radius: 2,
            },
            label: {
              borderColor: '#00E396',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#00E396',
              },
              text: '-达拉崩吧（王浩然）',
            }
          },{
            x: new Date('2019-04-29').valueOf(),
            y: 9998,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'red',
              radius: 2,
            },
            label: {
              borderColor: '#FF4560',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#FF4560',
              },
              text: '+多情岸',
            }
          },{
            x: new Date('2019-05-01').valueOf(),
            y: 93147,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'red',
              radius: 2,
            },
            label: {
              borderColor: '#FF4560',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#FF4560',
              },
              text: '+售楼小姐',
            }
          },{
            x: new Date('2019-04-26').valueOf(),
            y: 6858,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'red',
              radius: 2,
            },
            label: {
              borderColor: '#FF4560',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#FF4560',
              },
              text: '+最美的夏天',
            }
          },{
            x: new Date('2019-05-04').valueOf(),
            y: 15060,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'lightgreen',
              radius: 2,
            },
            label: {
              borderColor: '#00E396',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#00E396',
              },
              text: '-售楼小姐',
            }
          },{
            x: new Date('2019-05-26').valueOf(),
            y: 9654,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'lightgreen',
              radius: 2,
            },
            label: {
              borderColor: '#00E396',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#00E396',
              },
              text: '-星愿',
            }
          },{
            x: new Date('2019-06-05').valueOf(),
            y: 6858,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'red',
              radius: 2,
            },
            label: {
              borderColor: '#FF4560',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#FF4560',
              },
              text: '+非人哉',
            }
          },{
            x: new Date('2019-06-14').valueOf(),
            y: 6379,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'lightgreen',
              radius: 2,
            },
            label: {
              borderColor: '#00E396',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#00E396',
              },
              text: '-夜间出租车',
            }
          },{
            x: new Date('2019-06-16').valueOf(),
            y: 10245,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'red',
              radius: 2,
            },
            label: {
              borderColor: '#FF4560',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#FF4560',
              },
              text: '+大小姐的复仇生涯',
            }
          },{
            x: new Date('2019-07-08').valueOf(),
            y: 9067,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'lightgreen',
              radius: 2,
            },
            label: {
              borderColor: '#00E396',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#00E396',
              },
              text: '-七重痼病',
            }
          },{
            x: new Date('2019-07-16').valueOf(),
            y: 6388,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'lightgreen',
              radius: 2,
            },
            label: {
              borderColor: '#00E396',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#00E396',
              },
              text: '-前尘如梦',
            }
          },{
            x: new Date('2019-07-25').valueOf(),
            y: 11625,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'red',
              radius: 2,
            },
            label: {
              borderColor: '#FF4560',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#FF4560',
              },
              text: '+再一杯！',
            },
          },{
            x: new Date('2019-08-25').valueOf(),
            y: 63507,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'red',
              radius: 2,
            },
            label: {
              borderColor: '#FF4560',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#FF4560',
              },
              text: '+达拉崩吧·史诗版',
            },
          },{
            x: new Date('2019-08-26').valueOf(),
            y: 69304,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'lightgreen',
              radius: 2,
            },
            label: {
              borderColor: '#00E396',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#00E396',
              },
              text: '-再一杯！',
            }
          },{
            x: new Date('2019-09-06').valueOf(),
            y: 3035,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'lightgreen',
              radius: 2,
            },
            label: {
              borderColor: '#00E396',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#00E396',
              },
              text: '-达拉崩吧·史诗版',
            }
          },{
            x: new Date('2019-10-04').valueOf(),
            y: 7562,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'red',
              radius: 2,
            },
            label: {
              borderColor: '#FF4560',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#FF4560',
              },
              text: '+上学什么的，不干了啦！',
            },
          },{
            x: new Date('2019-11-22').valueOf(),
            y: 3773,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: 'red',
              radius: 2,
            },
            label: {
              borderColor: '#FF4560',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#FF4560',
              },
              text: '+地势坤',
            },
          }]
        },
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
          min: 0,
          labels: {
            show: true
          }
        },
        tooltip: {
          x: {
            format: "yyyy-MM-dd"
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
    sprintDailyList: function(newSprintDailyList) {
      let arr = new Array()
      for (let i = 0; i < newSprintDailyList.length; i++) {
        if (newSprintDailyList[i].correct == 1) {
          arr.push([this.dailyDateToTs(newSprintDailyList[i].date+''), newSprintDailyList[i].viewincr])
        }
      }
      this.series = [{
        name: "播放增长",
        data: arr
      }]
    }
  },
  methods: {
    dailyDateToTs: function(dailyDate) {
      let date = new Date(dailyDate.substring(0, 4)+'-'+dailyDate.substring(4, 6)+'-'+dailyDate.substring(6, 8))
      return date.valueOf()
    }
  }
}
</script>
