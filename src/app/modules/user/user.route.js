import express from "express";
import { UserControllers } from "./user.controller.js";

const router = express.Router();

router
  .route(`/`)
  .post(
    UserControllers.createOne
  )
  .get(UserControllers.getAll);

router.route(`/create-all`)
  .post(UserControllers.createAll);

router.route(`/index-all`)
  .patch(UserControllers.indexUnindexedUsers);

router.route(`/searching/:id`)
  .get(UserControllers.searching);

router
  .route(`/:id`)
  .get(UserControllers.getOne)
  .patch(
    
    UserControllers.updateOne
  )
  .delete(
    
    UserControllers.deleteOne
  );

export const UserRoutes = router;
