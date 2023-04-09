import {ErrorRequestHandler,Response, Request, NextFunction } from "express";

 export const errorHandler:ErrorRequestHandler =  async(error:any,req: Request, res: Response, next:NextFunction)=> {
  try {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
    catch(error) {
      throw error
    }
  }
