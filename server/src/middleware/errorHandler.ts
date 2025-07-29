import { Request, Response, NextFunction } from 'express'

export const errorHandler = (err: any, req: Request, res: Response, _: NextFunction) => {
  console.error('Error', err)
  res.status(500).json({ message: 'Something went wrong', error: err.message })
}