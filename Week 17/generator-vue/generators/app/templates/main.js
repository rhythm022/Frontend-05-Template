import Vue from "vue";
import Hello from "./Hello.vue";

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  render:h=>h(Hello)
});
