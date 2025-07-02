import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { waitForAuth } from './auth'
import 'bootstrap/dist/css/bootstrap.min.css' 
import 'bootstrap' 


waitForAuth().then(() => {
    createApp(App).use(router).mount('#app')
})