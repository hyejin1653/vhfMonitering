<template>
  <div style="padding: 40px">
    <div style="display: flex">
      <div style="width: 80%">
        <span class="color-pur">Topic</span>&nbsp;
        <span style="font-size: 25px; color: #c7c7c7">/</span>&nbsp;
        <span style="font-size: 25px">{{ mainTopic }}</span>
      </div>
      <div style="width: 20%; text-align: right">
        <v-btn :color="state == 0 ? '#607D8B' : ''" @click="socketStart"
          >연결</v-btn
        >&nbsp;
        <v-btn :color="state == 2 ? '#607D8B' : ''" @click="closeBtn"
          >연결종료</v-btn
        >&nbsp;
        <v-btn color="#607D8B" @click="moveList"> 목록</v-btn>
      </div>
    </div>
    <div style="height: 700px" class="mt-10">
      <v-table class="table-style">
        <tr>
          <td width="10%" class="table-title">Offset</td>
          <td width="8%" class="table-title">Partition</td>
          <td width="15%" class="table-title">Timestamp</td>
          <td width="82%" class="table-title" colspan="2">
            Value <span class="color-pur">Priview</span>
          </td>
        </tr>
        <tr v-for="(item, index) of data" :key="index" class="tr-style">
          <td width="10%" class="table-row">{{ item.offset }}</td>
          <td width="8%" class="table-row">{{ item.partition }}</td>
          <td width="15%" class="table-row">{{ item.timestamp }}</td>
          <td width="77%" class="table-row">
            {{ item.valueString }}
          </td>
          <td width="5%" class="table-row">
            <v-icon v-if="item.ctrlFlag == 'N'">mdi-plus-box</v-icon>
          </td>
        </tr>
      </v-table>
      <!-- <MyTable
        :headers="headers"
        :items="data"
        :rowCount="1000"
        :footerFlag="false"
        :tableHeight="700"
      ></MyTable> -->
    </div>
  </div>
</template>
<script>
import MyTable from "../Control/MyTable.vue";
import SnappyJS from "snappyjs";
let ws;

export default {
  name: "TopicDetail",
  props: ["mainTopic"],
  components: { MyTable },
  data() {
    return {
      headers: [
        { text: "Offset", value: "offset" },
        { text: "Partition", value: "partition" },
        { text: "Timestamp", value: "timestamp" },
        { text: "Value", value: "value" },
      ],
      data: [],
      data2: [
        {
          offset: 12345,
          partition: 0,
          timestamp: "2024-02-22 16:19:00",
          value: "ddddddddddd",
          ctrlFlag: "Y",
        },
        {
          offset: 12345,
          partition: 0,
          timestamp: "2024-02-22 16:19:00",
          value: "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
          ctrlFlag: "N",
        },
      ],
      url: "ws://155.155.4.228:7",
      state: 0,
    };
  },
  mounted() {
    let center = this.mainTopic.substr(
      this.mainTopic.length - 3,
      this.mainTopic.length
    );

    this.url = this.url + center;
    this.socketStart();
  },
  methods: {
    sleep(ms) {
      const wakeUpTime = Date.now() + ms;
      while (Date.now() < wakeUpTime) {}
    },
    socketStart() {
      ws = new WebSocket(this.url);
      this.state = ws.readyState;
      ws.binaryType = "arraybuffer";
      ws.onmessage = (msg) => {
        let data = msg.data;
        if (typeof data == "string") {
          return;
        }
        //let data = uncompress(msg.data);
        //let buf = new Uint8Array(msg.data).buffer;

        let buf = new Uint8Array(data).buffer;

        let parti = new TextDecoder().decode(buf.slice(0, 1));
        let offset = new TextDecoder().decode(buf.slice(1, 9));
        let date = new TextDecoder().decode(buf.slice(9, 28));

        //console.log(parti, offset, date);

        buf = buf.slice(28, buf.length);

        let uncompressed = SnappyJS.uncompress(buf);
        let uncompressedString = new TextDecoder().decode(uncompressed);

        //console.log(uncompressedString.length);

        //let main = JSON.parse(uncompressedString);
        //main = main.value.substr(0, 50);

        //main.value = main.value.substr(0, 50);

        // let main = JSON.parse(await data.text());
        //console.log(parti, offset, date, uncompressedString);
        let obj = {
          partition: parti,
          offset: offset,
          timestamp: date,
          value: uncompressedString, //.substring(0, 20),
          valueString: uncompressedString.substr(0, 90),
          ctrlFlag: uncompressedString.length == 22 ? "Y" : "N",
        };
        if (this.data.length > 100) {
          console.log(this.data.length);
          this.data.splice(100, this.data.length);
        }
        this.data.unshift(obj);

        //this.sleep(1000);
        //console.log(this.data);
      };
    },
    closeBtn() {
      ws.close();
      this.state = ws.readyState;
      //console.log(ws.readyState);
    },
    moveList() {
      console.log("stop");
      ws.close();
      //this.$router.go(-1);
      this.$router.push({ name: "list" });
      //this.$router.push({ path: "/" });
    },
  },
};
</script>
<style scoped>
.table-style {
  height: 76vh;
  font-family: "Pretendard";
}

.table-title {
  border-bottom: 2px solid #c7c7c7;
}

.color-pur {
  color: blueviolet;
}

.table-row {
  height: 45px;
  border-bottom: 1px solid #c7c7c7;
}

.tr-style:hover {
  background-color: #f1f2f3;
}
</style>
