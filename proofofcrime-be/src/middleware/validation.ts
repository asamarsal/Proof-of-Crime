import { Request, Response, NextFunction } from 'express'

export const validateWalletAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export const validateUUID = (id: string): boolean => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

export const requireFields = (fields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const missing = fields.filter(field => !req.body[field])

        if (missing.length > 0) {
            return res.status(400).json({
                error: 'Validation Error',
                message: `Missing required fields: ${missing.join(', ')}`,
            })
        }

        next()
    }
}
