import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route.js";
import { ProductRoutes } from "../modules/product/product.route.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
