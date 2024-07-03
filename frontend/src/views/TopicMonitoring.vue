<template>
  <div class="main">
    <div class="vhf-title">Topic 모니터링</div>
    <div class="mt-3">
      <!-- <Mytable :headers="headers" :items="list" :rowCount="15" /> -->
      <div class="card-div">
        <div v-for="(item, index) of list" :key="index" class="sub-card mr-2">
          <v-card>
            <v-card-item>
              <v-card-title>{{ item.key }}</v-card-title>
              <v-card-text style="text-align: right"
                >{{ item.value }} byte</v-card-text
              >
            </v-card-item>
          </v-card>
        </div>
      </div>
      <div class="chart-div">
        <div v-for="(item, index) of list" :key="index" class="sub-chart mr-2">
          {{ item.key }}
          <div :id="item.key"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Mytable from "../Control/MyTable.vue";
import VueApexCharts from "vue-apexcharts";

export default {
  name: "TopicMonitoring",
  components: { Mytable, apexCharts: VueApexCharts },
  data() {
    return {
      headers: [
        { text: "센터", value: "center_nm" },
        { text: "Topic", value: "topic" },
        { text: "수신일시", value: "recv_time" },
        { text: "vhfTopic", value: "vhfTopic", width: 400 },
        { text: "vhfWebsocket", value: "vhfWebsocket", width: 400 },
      ],
      list: [],
      chartList: [],
      chartOption: {},
    };
  },
  mounted() {
    this.searchData();
  },
  methods: {
    searchData() {
      const sseEvents = new EventSource("http://155.155.4.86:9999/");

      sseEvents.onopen = function () {
        //console.log("연결");
      };

      let _this = this;
      sseEvents.onmessage = function (stream) {
        const parsedData = JSON.parse(stream.data);
        //_this.list = [];

        for (let data in parsedData) {
          let title = _this.list
            .filter((res) => {
              return res.key == data;
            })
            .map((item) => {
              return item;
            });

          let obj = {};
          if (title.length > 0) {
            //console.log("1", title[0]);
            title[0].value = parsedData[data];
            let dataArr = title[0].data;
            dataArr.push(parsedData[data]);
            console.log(_this.chartOption);
            //_this.chartOption.series[0].data = dataArr;
            _this.drawChart(data, dataArr);
            //title[0].data = title[0].data.push(parsedData[data]);
          } else {
            obj["key"] = data;
            obj["value"] = parsedData[data];
            obj["data"] = [parsedData[data]];
            _this.list.push(obj);
            _this.drawChart(data, [parsedData[data]]);
          }
        }
      };

      //   this.axios.get(`/api/gis/topicList`).then((res) => {
      //     //console.log(res.data);
      //     this.list = res.data;
      //   });
    },
    drawChart(target, item) {
      //console.log(item);
      this.chartOption = {
        chart: {
          height: 240,
          type: "line",
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
          },
          toolbar: {
            show: false,
          },
        },
        colors: ["#CB16F1", "#F68737", "#36BC68", "#F9D645"],
        series: [{ data: item }],
        stroke: {
          width: [3, 3, 3, 3],
          curve: "straight",
          dashArray: [0, 0, 0, 0],
        },
        xaxis: {
          categories: [0],
          labels: {
            show: true,
            style: {
              colors: "#EBEBEB",
              fontSize: "12px",
            },
          },
        },

        legend: {
          show: true,
          labels: {
            colors: "#EBEBEB",
          },
        },
        tooltip: {
          enabled: true,
          inverseOrder: true,
          theme: true,
          fillSeriesColor: true,
          style: {
            fontSize: "12px",
            colors: "black",
          },
        },
      };

      let targetDiv = document.querySelector("#" + target);
      if (targetDiv != undefined) {
        var chart = new ApexCharts(targetDiv, this.chartOption);
        chart.render();
        chart.updateOptions(() => {
          return this.chartOption;
        });
      }
    },
  },
};
</script>
<style scoped>
.vhf-title {
  font-size: 40px;
  text-align: center;
}

.main {
  padding: 30px;
}

.card-div {
  height: 35vh;
}

.sub-card {
  display: inline-block;
  width: 250px;
}

.chart-div {
  height: 35vh;
  display: inline-block;
}

.sub-chart {
  display: inline-block;
  width: 300px;
  height: 150px;
}
</style>
