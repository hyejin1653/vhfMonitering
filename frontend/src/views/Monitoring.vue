<template>
  <div class="main">
    <div class="vhf-title">VHF 수신 현황 모니터링</div>
    <div class="mt-3">
      <Mytable
        :headers="headers"
        :items="list"
        :rowCount="2"
        :footerFlag="true"
        @clickRow="rowClick"
      />
    </div>
  </div>
</template>
<script>
import Mytable from "../Control/MyTable.vue";

export default {
  name: "Monitoring",
  components: { Mytable },
  data() {
    return {
      headers: [
        { text: "센터", value: "center" },
        { text: "Topic", value: "topic" },
        // { text: "수신일시", value: "recv_time" },
        // { text: "vhfTopic", value: "vhfTopic", width: 400 },
        // { text: "vhfWebsocket", value: "vhfWebsocket", width: 400 },
      ],
      list: [],
      selectTopic: "",
    };
  },
  mounted() {
    this.searchData();
  },
  methods: {
    searchData() {
      this.axios.get("/vhf/topicList").then((res) => {
        console.log(res.data);
        this.list = res.data;
      });
    },
    rowClick(item) {
      this.selectTopic = item.topic;
      this.axios.get(`/vhf/topicStart/${item.topic}`).then((res) => {
        console.log(res.data);
      });
      this.$router.push({
        name: `topicDetail`,
        params: { mainTopic: item.topic },
      });
      //this.$router.push("topicDetail");
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
</style>
