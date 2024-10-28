import httpStatus from "http-status";
import { ProductServices } from "./product.service.js";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";

const createOne = catchAsync(async (req, res) => {
  const result = await ProductServices.createOne(req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

const createAll = catchAsync(async (req, res) => {
  const result = await ProductServices.createAll(req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Products created successfully",
    data: result,
  });
});

const searching = catchAsync(async (req, res) => {
  const result = await ProductServices.searching(req?.params?.id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "searching successfully",
    data: result,
  });
});

const getAll = catchAsync(async (req, res) => {
  const result = await ProductServices.getAll(req.query);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "All Products fetched successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

const getOne = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.getOne(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Product fetched successfully",
    data: result,
  });
});

const updateOne = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.updateOne(id, req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteOne = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.deleteOne(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Product deleted successfully",
    data: result,
  });
});

export const ProductControllers = {
  createOne,
  createAll,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  searching,
};
