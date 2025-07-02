import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/Login.vue";
import Produk from "@/pages/Produk.vue";
import Order from "@/pages/Order.vue";
import {auth} from "../firebase";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "login",
            component: Login,
        },
        {
            path: "/order",
            name: "order",
            component: Order,
            meta: { requiresAuth: true },
        },
        {
            path: "/produk",
            name: "produk",
            component: Produk,
            meta: { requiresAuth: true },
        },
    ],
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (auth.currentUser) {
            next();
            return;
        }
        next("/");
    } else {
        next();
    }
});

export default router;