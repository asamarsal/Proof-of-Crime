import { Request, Response, NextFunction } from 'express'
import { Prisma } from '../../generated/prisma'

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', err)

    // Prisma errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                return res.status(409).json({
                    error: 'Conflict',
                    message: 'A record with this unique field already exists',
                    field: err.meta?.target,
                })
            case 'P2025':
                return res.status(404).json({
                    error: 'Not Found',
                    message: 'Record not found',
                })
            case 'P2003':
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Foreign key constraint failed',
                })
            default:
                return res.status(400).json({
                    error: 'Database Error',
                    message: err.message,
                })
        }
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message,
        })
    }

    // Default error
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    })
}
