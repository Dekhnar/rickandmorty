import "./assets/index.css";
import App from "./App.vue";
import FontAwesomeIcon from './plugins/fontawesome'
import router from "./router";
import { createApp } from "vue";
import { createPinia } from "pinia";

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon);

app.use(createPinia());
app.use(router);

app.mount("#app");
