<template>
  <div>
    <div v-if="footerFlag">
      <EasyDataTable
        :headers="headers"
        :items="items"
        :rows-per-page="rowCount"
        table-class-name="customize-table"
        :table-height="tableHeight"
        border-cell
        @click-row="clickRow"
      >
        <template #item-vhfTopic="items">
          <v-btn>start</v-btn>&nbsp; <v-btn>restart</v-btn>&nbsp;
          <v-btn>stop</v-btn>&nbsp;
          <v-btn @click="logClick(items.topic)">log</v-btn>
        </template>
        <template #item-vhfWebsocket="items">
          <v-btn>start</v-btn>&nbsp; <v-btn>restart</v-btn>&nbsp;
          <v-btn>stop</v-btn>&nbsp;
          <v-btn @click="logClick(items.topic)">log</v-btn></template
        >
        <!-- <template #item-play="items">
      <img
        src="@/assets/play.png"
        width="25"
        @click="clickPlay(items.file_path)"
      />
    </template>
    <template #item-stop="items">
      <img
        src="@/assets/stop2.png"
        width="25"
        style="color: #4695f1"
        @click="clickStop"
      />
    </template> -->
      </EasyDataTable>
    </div>
    <div v-else>
      <EasyDataTable
        :headers="headers"
        :items="items"
        :rows-per-page="rowCount"
        :table-height="tableHeight"
        @click-row="clickRow"
        border-cell
        hide-footer
      >
        <template #item-vhfTopic="items">
          <v-btn>start</v-btn>&nbsp; <v-btn>restart</v-btn>&nbsp;
          <v-btn>stop</v-btn>&nbsp;
          <v-btn @click="logClick(items.topic)">log</v-btn>
        </template>
        <template #item-vhfWebsocket="items">
          <v-btn>start</v-btn>&nbsp; <v-btn>restart</v-btn>&nbsp;
          <v-btn>stop</v-btn>&nbsp;
          <v-btn @click="logClick(items.topic)">log</v-btn></template
        >
        <!-- <template #item-play="items">
      <img
        src="@/assets/play.png"
        width="25"
        @click="clickPlay(items.file_path)"
      />
    </template>
    <template #item-stop="items">
      <img
        src="@/assets/stop2.png"
        width="25"
        style="color: #4695f1"
        @click="clickStop"
      />
    </template> -->
      </EasyDataTable>
    </div>
  </div>
</template>
<script>
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";

export default {
  name: "MyTable",
  props: ["headers", "items", "tableHeight", "rowCount", "footerFlag"],
  components: { EasyDataTable },
  data() {
    return {};
  },

  methods: {
    clickPlay(file) {
      this.$emit("clickPlay", file);
    },
    clickStop() {
      this.$emit("clickStop");
    },
    logClick(topic) {
      console.log(topic);
    },
    clickRow(item) {
      let index = this.items.findIndex(
        (num) => num.file_path == item.file_path
      );
      this.$emit("clickRow", item, { isTrusted: true, index: index });
    },
  },
};
</script>
<style scoped>
.customize-table {
  --easy-table-header-font-size: 18px;
  --easy-table-header-height: 45px;
  --easy-table-body-row-height: 60px;
  --easy-table-body-row-font-size: 20px;
  --easy-table-footer-height: 55px;
  --easy-table-footer-font-size: 20px;
}
</style>
