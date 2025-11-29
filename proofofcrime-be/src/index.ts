import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler'
import casesRouter from './routes/cases'
import bountiesRouter from './routes/bounties'
import usersRouter from './routes/users'
import companiesRouter from './routes/companies'
import submissionsRouter from './routes/submissions'
import statisticsRouter from './routes/statistics'
import { prisma } from './prisma'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
        next()
    })
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/cases', casesRouter)
app.use('/api/bounties', bountiesRouter)
app.use('/api/users', usersRouter)
app.use('/api/companies', companiesRouter)
app.use('/api/submissions', submissionsRouter)
app.use('/api/statistics', statisticsRouter)

// Cron job endpoint for keep-alive
app.get('/api/cron', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), message: 'Cron job executed successfully' })
})

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Proof of Crime API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            cron: '/api/cron',
            cases: '/api/cases',
            bounties: '/api/bounties',
            users: '/api/users',
            companies: '/api/companies',
            submissions: '/api/submissions',
            statistics: '/api/statistics',
        },
    })
})

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found', path: req.path })
})

// Error handler (must be last)
app.use(errorHandler)

// Export app for Vercel
export default app

// Start server if running directly
if (require.main === module) {
    const server = app.listen(PORT, async () => {
        console.log(`🚀 Server running on port ${PORT}`)
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
        console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)

        // Test database connection
        try {
            await prisma.$connect()
            console.log('✅ Database connected successfully')
        } catch (error) {
            console.error('❌ Database connection failed:', error)
            process.exit(1)
        }
    })

    // Graceful shutdown
    process.on('SIGTERM', async () => {
        console.log('SIGTERM signal received: closing HTTP server')
        server.close(async () => {
            await prisma.$disconnect()
            console.log('HTTP server closed')
            process.exit(0)
        })
    })

    process.on('SIGINT', async () => {
        console.log('SIGINT signal received: closing HTTP server')
        server.close(async () => {
            await prisma.$disconnect()
            console.log('HTTP server closed')
            process.exit(0)
        })
    })
}
