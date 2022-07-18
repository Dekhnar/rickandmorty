import { createRouter, createWebHistory, type Router } from "vue-router";
import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";

const routes = setupLayouts(generatedRoutes);
const scrollBackToTop = (router: Router) => {
  router.afterEach(async (_) => {
    window.scrollTo(0, 0);
    return true;
  });
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
scrollBackToTop(router);

export default router;
