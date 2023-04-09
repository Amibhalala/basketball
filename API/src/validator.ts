import { Response, Request, NextFunction } from "express";

export const validateParam = (req: Request, res: Response, next:NextFunction) => {
  if(!req.params?.id){
    return res.status(400).json({ error: 'Param is required' })
  }
  next(); 
};
