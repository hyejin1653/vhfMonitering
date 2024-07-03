<template>
  <div class="main">
    <div class="title">교신내역</div>
    <div class="whereDiv">일자</div>
    <div class="flex-container">
      <div class="flex-item1">
        <MyTable :headers="headers" :items="list" @click-row="clickRow" />
      </div>
      <div class="flex-item2 ml-3">
        <div>
          <audio controls id="audioCtl">
            <source type="audio/wav" />
          </audio>
        </div>
        <!--<div>
          <vuetify-audio
            :file="fileBlob"
            color="success"
            :ended="audioFinish"
            downloadable
          ></vuetify-audio>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
import MyTable from "../Control/MyTable.vue";
import query_sql from "../js/queries";
import { mulaw } from "alawmulaw";
import VuetifyAudio from "vuetify-audio";
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
        { text: "", value: "play", width: 100 },
        //{ text: "", value: "stop" },
      ],

      playFlag: false,
      fileNm: "",
      fileBlob: "",
    };
  },
  apollo: {
    list: {
      query() {
        return query_sql.GET_VHFLIST;
      },
      update: (data) => data.getList,
    },
  },
  mounted() {
    //this.playWavFile();
  },
  methods: {
    audioFinish() {
      console.log("end");
    },
    async clickPlay(file) {
      if (this.fileNm != "" && this.fileNm != file) {
        this.playFlag = false;
      }

      if (!this.playFlag) {
        this.fileNm = file;

        let voice = await this.axios
          .post(`/api/play`, { fileNm: file })
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
    async clickRow(item) {
      let voice = await this.axios
        .post(`/api/play`, { fileNm: item.file_path })
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

      let wav = toWav(outputBuffer);
      //console.log(outputBuffer.length, wav);
      let wavBuf = new Uint8Array(wav);
      //console.log(wavBuf);
      const blob = new Blob([wavBuf], {
        type: "audio/wav; codecs=opus",
      });

      console.log(blob);
      const audioURL = URL.createObjectURL(blob);
      //audio0.play();
      //console.log(audioURL);
      let audio = document.getElementById("audioCtl");
      audio.src = audioURL;
      //audio.play();
      //this.fileBlob = audioURL;
    },
    async playWavFile() {
      let filePath =
        "D:\\vhf\\2021_02_01\\[20210201_00h13m27s~13m30s] 안진산1_Remote1_CH12_RX.wav";

      let url = await this.axios
        .post(`/api/play`, { fileNm: filePath })
        .then((res) => {
          let buf = new Uint8Array(
            this.base64ToArrayBuffer(res.data.vhfBuffer)
          );

          const blob = new Blob([buf], { type: "audio/wav" });
          let url = URL.createObjectURL(blob);
          return url;
          // var binaryString = "[" + atob(res.data.vhfBuffer) + "]";
          // let vhfBuffer = JSON.parse(binaryString);
          // return vhfBuffer;
        });

      //console.log(voice);
      let audio = document.getElementById("audioCtl");
      audio.src = url;
      //audio.play();
    },
    base64ToArrayBuffer(base64) {
      var binaryString = atob(base64);
      var bytes = new Uint8Array(binaryString.length);
      for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    },
  },
};
</script>
<style scoped>
.main {
  width: 1860px;
  height: 450px;
  background-color: #2b2b2b;
  margin: 20px;
  color: white;
  border-radius: 10px;
  padding: 20px;
  font-size: 25px;
}

.title {
  font-size: 30px;
}

.whereDiv {
  height: 60px;
}

.flex-container {
  display: flex;
}

.flex-item1 {
  width: 1000px;
  height: 280px;
  background-color: darksalmon;
}

.flex-item2 {
  width: 800px;
  height: 280px;
  background-color: darksalmon;
}
</style>
