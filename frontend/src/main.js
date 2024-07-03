import "./assets/main.css";
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueApexCharts from "vue3-apexcharts";

// Vuetify
import "vuetify/styles";
import "vuetify/dist/vuetify.min.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
//import Vue3EasyDataTable from "vue3-easy-data-table";
//import "vue3-easy-data-table/dist/style.css";

const vuetify = createVuetify({
  components,
  directives,
});

//Apollo
// import {
//   ApolloClient,
//   createHttpLink,
//   InMemoryCache,
// } from "@apollo/client/core";
// import { createApolloProvider } from "@vue/apollo-option";
// import VueApolloComponents from "@vue/apollo-components";
import { AVPlugin } from "vue-audio-visual";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

/*const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: "http://localhost:8091/graphql",
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
});*/

const app = createApp(App);

app.config.globalProperties.axios = axios;

app.use(VueApexCharts);
//app.component("apexchart", VueApexCharts);
app.use(router);
app.use(vuetify);
//app.use(apolloProvider);
app.use(AVPlugin);
//app.use(VueApolloComponents);
app.component("VueDatePicker", VueDatePicker);

app.mount("#app");
