<template>
  <div style="width: 100%; height: 100vh">
    <h2>교신내역</h2>
    <div>조건절</div>
    <MyTable
      :headers="headers"
      :items="list"
      @clickPlay="clickPlay"
      @clickStop="clickStop"
    />
    <div>
      <av-bars
        caps-color="#FFF"
        :bar-color="['#f00', '#ff0', '#0f0']"
        canv-fill-color="#000"
        :caps-height="2"
        src="D:\\vhf\\2021_02_01\\[20210201_00h13m27s~13m30s] 안진산1_Remote1_CH12_RX.wav"
      ></av-bars>
    </div>
  </div>
</template>
<script>
import MyTable from "../Control/MyTable.vue";
import query_sql from "../js/queries";
import { mulaw } from "alawmulaw";

let buffer;
//let audio, player;
let audioCtx = new AudioContext();
let source;

export default {
  name: "MainPage",
  components: { MyTable },
  data() {
    return {
      list: [],
      headers: [
        { text: "센터", value: "center_nm", width: 120 },
        { text: "장비", value: "remote_nm", width: 100 },
        { text: "채널", value: "channel", width: 100 },
        { text: "교신일", value: "vhf_dt", width: 150 },
        //{ text: "파일명", value: "file_path", width: 500 },
        { text: "시작일시", value: "start_time", width: 230 },
        { text: "종료일시", value: "end_time", width: 230 },
        { text: "등록일시", value: "insert_dt", width: 230 },
        { text: "", value: "play", width: 100 },
        { text: "", value: "stop" },
      ],

      playFlag: false,
      fileNm: "",
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
  methods: {
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
  },
};
</script>
