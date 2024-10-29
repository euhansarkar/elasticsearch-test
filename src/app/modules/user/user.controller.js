import httpStatus from "http-status";
import { UserServices } from "./user.service.js";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";

const createOne = catchAsync(async (req, res) => {
  const result = await UserServices.createOne(req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const createAll = catchAsync(async (req, res) => {
  const result = await UserServices.createAll(req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Users created successfully",
    data: result,
  });
});

const searching = catchAsync(async (req, res) => {
  const result = await UserServices.searching(req?.params?.id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "searching successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const result = await UserServices.getAll(req.query);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "All Users fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

const getOne = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getOne(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User fetched successfully",
    data: result,
  });
});

const updateOne = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.updateOne(id, req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const deleteOne = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.deleteOne(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});


const indexUnindexedUsers = catchAsync(async (req, res) => {
  const result = await indexUnindexedUsers();
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User Indexed successfully",
    data: result,
  });
});

export const UserControllers = {
  createOne,
  createAll,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  searching,
  indexUnindexedUsers,
};
