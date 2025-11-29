import { Router, Request, Response } from 'express'
import { prisma } from '../prisma'
import { requireFields } from '../middleware/validation'

const router = Router()

// GET /api/bounties - Get all bounties with filters
router.get('/', async (req: Request, res: Response) => {
    try {
        const { category, status, companyId, page = '1', limit = '10' } = req.query

        const where: any = {}
        if (category) where.category = category
        if (status) where.status = status
        if (companyId) where.companyId = companyId

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
        const take = parseInt(limit as string)

        const [bounties, total] = await Promise.all([
            prisma.bounty.findMany({
                where,
                include: {
                    company: true,
                    rewardBreakdown: true,
                    rules: true,
                    _count: {
                        select: {
                            participants: true,
                            submissions: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            prisma.bounty.count({ where }),
        ])

        res.json({
            bounties,
            pagination: {
                total,
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                totalPages: Math.ceil(total / parseInt(limit as string)),
            },
        })
    } catch (error) {
        console.error('Get bounties error:', error)
        res.status(500).json({ error: 'Failed to fetch bounties' })
    }
})

// GET /api/bounties/:id - Get single bounty
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const bounty = await prisma.bounty.findUnique({
            where: { id },
            include: {
                company: true,
                rewardBreakdown: {
                    orderBy: { severity: 'desc' },
                },
                rules: {
                    orderBy: { ruleNumber: 'asc' },
                },
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                walletAddress: true,
                                name: true,
                                reputation: true,
                            },
                        },
                    },
                },
                submissions: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                walletAddress: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        })

        if (!bounty) {
            return res.status(404).json({ error: 'Bounty not found' })
        }

        res.json(bounty)
    } catch (error) {
        console.error('Get bounty error:', error)
        res.status(500).json({ error: 'Failed to fetch bounty' })
    }
})

// POST /api/bounties - Create new bounty
router.post(
    '/',
    requireFields([
        'bountyId',
        'title',
        'description',
        'category',
        'companyId',
        'totalReward',
        'severity',
        'deadline',
    ]),
    async (req: Request, res: Response) => {
        try {
            const {
                bountyId,
                title,
                description,
                category,
                companyId,
                totalReward,
                rewardToken,
                severity,
                deadline,
                scope,
                inScope,
                outOfScope,
                techStack,
                securityFocus,
                rewardBreakdown,
                rules,
            } = req.body

            const bounty = await prisma.bounty.create({
                data: {
                    bountyId,
                    title,
                    description,
                    category,
                    companyId,
                    totalReward: parseFloat(totalReward),
                    rewardToken: rewardToken || 'USDC',
                    severity,
                    deadline: new Date(deadline),
                    scope,
                    inScope: inScope || [],
                    outOfScope: outOfScope || [],
                    techStack: techStack || [],
                    securityFocus,
                    rewardBreakdown: rewardBreakdown
                        ? {
                            create: rewardBreakdown.map((rb: any) => ({
                                severity: rb.severity,
                                amount: parseFloat(rb.amount),
                                description: rb.description,
                            })),
                        }
                        : undefined,
                    rules: rules
                        ? {
                            create: rules.map((rule: any, index: number) => ({
                                ruleNumber: rule.ruleNumber || index + 1,
                                ruleText: rule.ruleText,
                            })),
                        }
                        : undefined,
                },
                include: {
                    company: true,
                    rewardBreakdown: true,
                    rules: true,
                },
            })

            res.status(201).json(bounty)
        } catch (error) {
            console.error('Create bounty error:', error)
            res.status(500).json({ error: 'Failed to create bounty' })
        }
    }
)

// PUT /api/bounties/:id - Update bounty
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const {
            title,
            description,
            category,
            totalReward,
            severity,
            status,
            deadline,
            scope,
            inScope,
            outOfScope,
            techStack,
            securityFocus,
        } = req.body

        const bounty = await prisma.bounty.update({
            where: { id },
            data: {
                title,
                description,
                category,
                totalReward: totalReward ? parseFloat(totalReward) : undefined,
                severity,
                status,
                deadline: deadline ? new Date(deadline) : undefined,
                scope,
                inScope,
                outOfScope,
                techStack,
                securityFocus,
            },
            include: {
                company: true,
                rewardBreakdown: true,
                rules: true,
            },
        })

        res.json(bounty)
    } catch (error) {
        console.error('Update bounty error:', error)
        res.status(500).json({ error: 'Failed to update bounty' })
    }
})

// PATCH /api/bounties/:id - Partial update
router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const updates = req.body

        if (updates.totalReward) updates.totalReward = parseFloat(updates.totalReward)
        if (updates.deadline) updates.deadline = new Date(updates.deadline)

        const bounty = await prisma.bounty.update({
            where: { id },
            data: updates,
            include: {
                company: true,
                rewardBreakdown: true,
                rules: true,
            },
        })

        res.json(bounty)
    } catch (error) {
        console.error('Patch bounty error:', error)
        res.status(500).json({ error: 'Failed to update bounty' })
    }
})

// DELETE /api/bounties/:id - Delete bounty
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        await prisma.bounty.delete({
            where: { id },
        })

        res.json({ message: 'Bounty deleted successfully' })
    } catch (error) {
        console.error('Delete bounty error:', error)
        res.status(500).json({ error: 'Failed to delete bounty' })
    }
})

// POST /api/bounties/:id/join - Join bounty
router.post('/:id/join', requireFields(['userId']), async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { userId } = req.body

        const participant = await prisma.bountyParticipant.create({
            data: {
                bountyId: id,
                userId,
            },
            include: {
                bounty: true,
                user: {
                    select: {
                        id: true,
                        walletAddress: true,
                        name: true,
                    },
                },
            },
        })

        res.status(201).json(participant)
    } catch (error) {
        console.error('Join bounty error:', error)
        res.status(500).json({ error: 'Failed to join bounty' })
    }
})

export default router
