import { Router, Request, Response } from 'express'
import { prisma } from '../prisma'
import { requireFields, validateWalletAddress } from '../middleware/validation'

const router = Router()

// GET /api/users - Get all users
router.get('/', async (req: Request, res: Response) => {
    try {
        const { role, page = '1', limit = '20' } = req.query

        const where: any = {}
        if (role) where.role = role

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
        const take = parseInt(limit as string)

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    walletAddress: true,
                    name: true,
                    role: true,
                    reputation: true,
                    createdAt: true,
                    _count: {
                        select: {
                            submittedCases: true,
                            bountySubmissions: true,
                            bountyParticipants: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            prisma.user.count({ where }),
        ])

        res.json({
            users,
            pagination: {
                total,
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                totalPages: Math.ceil(total / parseInt(limit as string)),
            },
        })
    } catch (error) {
        console.error('Get users error:', error)
        res.status(500).json({ error: 'Failed to fetch users' })
    }
})

// GET /api/users/:id - Get single user
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                submittedCases: {
                    select: {
                        id: true,
                        caseTitle: true,
                        reportCategory: true,
                        status: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                bountySubmissions: {
                    select: {
                        id: true,
                        title: true,
                        severity: true,
                        status: true,
                        rewardAmount: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                bountyParticipants: {
                    include: {
                        bounty: {
                            select: {
                                id: true,
                                title: true,
                                category: true,
                                totalReward: true,
                                deadline: true,
                            },
                        },
                    },
                    orderBy: { joinedAt: 'desc' },
                },
            },
        })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json(user)
    } catch (error) {
        console.error('Get user error:', error)
        res.status(500).json({ error: 'Failed to fetch user' })
    }
})

// POST /api/users - Create or authenticate user
router.post('/', requireFields(['walletAddress']), async (req: Request, res: Response) => {
    try {
        const { walletAddress, email, name } = req.body

        if (!validateWalletAddress(walletAddress)) {
            return res.status(400).json({ error: 'Invalid wallet address format' })
        }

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { walletAddress: walletAddress.toLowerCase() },
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    walletAddress: walletAddress.toLowerCase(),
                    email,
                    name,
                },
            })
        } else if (email || name) {
            // Update user info if provided
            user = await prisma.user.update({
                where: { walletAddress: walletAddress.toLowerCase() },
                data: {
                    ...(email && { email }),
                    ...(name && { name }),
                },
            })
        }

        res.json(user)
    } catch (error) {
        console.error('Create/authenticate user error:', error)
        res.status(500).json({ error: 'Failed to create/authenticate user' })
    }
})

// PUT /api/users/:id - Update user
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { name, email, role, reputation } = req.body

        const user = await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                role,
                reputation: reputation ? parseInt(reputation) : undefined,
            },
        })

        res.json(user)
    } catch (error) {
        console.error('Update user error:', error)
        res.status(500).json({ error: 'Failed to update user' })
    }
})

// PATCH /api/users/:id - Partial update
router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const updates = req.body

        if (updates.reputation) updates.reputation = parseInt(updates.reputation)

        const user = await prisma.user.update({
            where: { id },
            data: updates,
        })

        res.json(user)
    } catch (error) {
        console.error('Patch user error:', error)
        res.status(500).json({ error: 'Failed to update user' })
    }
})

export default router
