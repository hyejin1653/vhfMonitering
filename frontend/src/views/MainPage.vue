<template>
  <div class="main">
    <div class="title">
      교신내역 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <v-btn @click="topicList">교신현황</v-btn>
    </div>
    <div class="whereDiv">
      <div class="mr-10">일자</div>
      <div class="mr-5">
        <VueDatePicker
          class="datePicker"
          v-model="date"
          :format="format"
          :enable-time-picker="false"
          dark
        ></VueDatePicker>
      </div>
      <div>
        <v-btn @click="seachBtn" color="light-green-darken-4" width="100"
          >조회</v-btn
        >
      </div>
    </div>
    <div class="flex-container">
      <div class="flex-item1">
        <MyTable
          :headers="headers"
          :items="list"
          @clickRow="clickRow"
          :tableHeight="224"
          :rowCount="3"
          :footerFlag="true"
        />
      </div>
      <div class="flex-item2 ml-3">
        <!-- <div>
          <audio controls id="audioCtl">
            <source type="audio/wav" />
          </audio>
        </div> -->
        <div>
          <vuetify-audio
            :file="fileBlob"
            color="light-green-darken-4"
            :ended="audioFinish"
            :downloadable="false"
            :autoPlay="autoPlay"
            :title="fileTitle"
          ></vuetify-audio>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MyTable from "../Control/MyTable.vue";
import { mulaw } from "alawmulaw";
import VuetifyAudio from "../Control/VuetifyAudio.vue";
import toWav from "audiobuffer-to-wav";

let buffer;
//let audio, player;
let audioCtx = new AudioContext();
let source;

export default {
  name: "MainPage",
  components: { MyTable, VuetifyAudio },
  data() {
    return {
      list: [],
      headers: [
        { text: "센터", value: "center_nm", width: 120 },
        { text: "장비", value: "remote_nm", width: 100 },
        { text: "채널", value: "channel", width: 100 },
        { text: "교신일", value: "vhf_dt", width: 150 },
        //{ text: "파일명", value: "file_path", width: 500 },
        { text: "시작일시", value: "start_time", width: 200 },
        { text: "종료일시", value: "end_time", width: 200 },
        //{ text: "등록일시", value: "insert_dt", width: 230 },
        //{ text: "", value: "play", width: 100 },
        //{ text: "", value: "stop" },
      ],

      playFlag: false,
      fileNm: "",
      fileBlob: "",
      fileTitle: "",
      autoPlay: false,
      format: "yyyy-MM-dd",
      date: "2024-01-30",
      playIndex: 0,
    };
  },
  /*watch: {
    list(val) {
      //console.log("watch", val.length);
      if (val.length > 0) {
        let fristRow = val[0];
        this.clickRow(fristRow, { isTrusted: false });
      }
    },
  },*/
  mounted() {
    let date = this.convertDt(this.date);
    this.searchData(date);
  },
  methods: {
    searchData(date) {
      this.axios
        .get("/api/gis/getVhfList", { params: { vhf_dt: date } })
        .then((res) => {
          this.list = res.data;
          if (res.data.length > 0) {
            let fristRow = res.data[0];
            this.clickRow(fristRow, { isTrusted: false, index: 0 });
          }
        });
    },
    audioFinish() {
      //console.log("end");
      let data = this.list[this.playIndex + 1];

      if (data == undefined) return;

      this.vhfPlay(data.start_time, data.end_time, data.file_path);
      this.playIndex++;
      //this.vhfPlay
    },
    async clickPlay(file) {
      if (this.fileNm != "" && this.fileNm != file) {
        this.playFlag = false;
      }

      if (!this.playFlag) {
        this.fileNm = file;

        let voice = await this.axios
          .post(`/api/gis/play`, { fileNm: file })
          .then((res) => {
            var binaryString = "[" + atob(res.data.vhfBuffer) + "]";
            let vhfBuffer = JSON.parse(binaryString);
            return vhfBuffer;
          });

        buffer = mulaw.decode(voice);
        this.playSound(buffer);
        //this.draw(buffer);
      } else {
        audioCtx.resume();
      }

      this.playFlag = true;

      source.onended = () => {
        this.playFlag = false;
      };
    },
    playSound(playBuffer) {
      if (audioCtx.state == "suspended") audioCtx = new AudioContext();

      //재생을 위한
      var outputBuffer = audioCtx.createBuffer(1, playBuffer.length, 8000);
      var outputData = outputBuffer.getChannelData(0);

      for (var sample = 0; sample < playBuffer.length; sample++) {
        outputData[sample] = playBuffer[sample] / 32768;
      }

      console.log(outputBuffer);
      source = audioCtx.createBufferSource();
      console.log(source);
      source.buffer = outputBuffer;
      source.connect(audioCtx.destination);
      source.start();
      //console.log(filteredData);
    },
    clickStop() {
      if (audioCtx.state == "running") audioCtx.suspend();
      //console.log(player.audioCtx.state);
    },
    async vhfPlay(start_time, end_time, file_path) {
      let title = start_time + "~" + end_time;
      this.fileTitle = title;

      let voice = await this.axios
        .post(`/api/gis/play`, { fileNm: file_path })
        .then((res) => {
          var binaryString = "[" + atob(res.data.vhfBuffer) + "]";
          let vhfBuffer = JSON.parse(binaryString);
          return vhfBuffer;
        });

      let pcmbuffer = mulaw.decode(voice);

      var outputBuffer = audioCtx.createBuffer(1, pcmbuffer.length, 8000);
      var outputData = outputBuffer.getChannelData(0);

      for (var sample = 0; sample < pcmbuffer.length; sample++) {
        outputData[sample] = pcmbuffer[sample] / 32768;
      }

      let wav = toWav(outputBuffer); //arraybuffer to wav

      let wavBuf = new Uint8Array(wav);
      const blob = new Blob([wavBuf], {
        type: "audio/wav",
      });

      const audioURL = URL.createObjectURL(blob);

      //let audio = document.getElementById("audioCtl");
      //audio.src = audioURL;
      this.fileBlob = audioURL;
    },
    clickRow(item, flag) {
      this.autoPlay = flag.isTrusted;
      this.playIndex = flag.index;

      this.vhfPlay(item.start_time, item.end_time, item.file_path);
      /*let title = item.start_time + "~" + item.end_time;
      this.fileTitle = title;
      let voice = await this.axios
        .post(`/api/gis/play`, { fileNm: item.file_path })
        .then((res) => {
          var binaryString = "[" + atob(res.data.vhfBuffer) + "]";
          let vhfBuffer = JSON.parse(binaryString);
          return vhfBuffer;
        });

      let pcmbuffer = mulaw.decode(voice);

      var outputBuffer = audioCtx.createBuffer(1, pcmbuffer.length, 8000);
      var outputData = outputBuffer.getChannelData(0);

      for (var sample = 0; sample < pcmbuffer.length; sample++) {
        outputData[sample] = pcmbuffer[sample] / 32768;
      }

      let wav = toWav(outputBuffer); //arraybuffer to wav

      let wavBuf = new Uint8Array(wav);
      const blob = new Blob([wavBuf], {
        type: "audio/wav",
      });

      const audioURL = URL.createObjectURL(blob);

      //let audio = document.getElementById("audioCtl");
      //audio.src = audioURL;
      this.fileBlob = audioURL; */
    },
    convertDt(dt) {
      let tDate = new Date(dt);
      let date = ("0" + tDate.getDate()).slice(-2);
      let month = ("0" + (tDate.getMonth() + 1)).slice(-2);
      let year = tDate.getFullYear();

      let nowDt = year + "-" + month + "-" + date;
      return nowDt;
    },
    seachBtn() {
      console.log(this.date);
      if (this.date == null) return alert("일자를 입력하세요.");
      let date = this.convertDt(this.date);
      this.searchData(date);
    },
    topicList() {
      this.$router.push("/list");
    },
  },
};
</script>
<style scoped>
.main {
  width: 97.9%;
  height: 450px;
  background-color: #2b2b2b;
  margin: 20px;
  color: white;
  border-radius: 10px;
  padding: 20px;
  font-size: 1.8em;
}

.title {
  font-size: 1.4em;
}

.whereDiv {
  display: flex;
  height: 60px;
}

.flex-container {
  display: flex;
}

.flex-item1 {
  width: 60%;
  height: 280px;
  background-color: darksalmon;
}

.flex-item2 {
  font-size: 20px;
  text-align: center;
  width: 40%;
  height: 280px;
  background-color: #898989;
}

.datePicker {
  width: 80%;
}
</style>
