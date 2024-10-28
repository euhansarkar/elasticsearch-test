import express from "express";
import { ProductControllers } from "./product.controller.js";

const router = express.Router();

router
  .route(`/`)
  .post(
    ProductControllers.createOne
  )
  .get(ProductControllers.getAll);

router.route(`/create-all`)
  .post(ProductControllers.createAll);


router.route(`/searching/:id`)
  .get(ProductControllers.searching);

router
  .route(`/:id`)
  .get(ProductControllers.getOne)
  .patch(
    
    ProductControllers.updateOne
  )
  .delete(
    
    ProductControllers.deleteOne
  );

export const ProductRoutes = router;
