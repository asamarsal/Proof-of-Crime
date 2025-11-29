import { Router, Request, Response } from 'express'
import { prisma } from '../prisma'
import { requireFields } from '../middleware/validation'

const router = Router()

// GET /api/submissions - Get all submissions with filters
router.get('/', async (req: Request, res: Response) => {
    try {
        const { bountyId, userId, status, page = '1', limit = '10' } = req.query

        const where: any = {}
        if (bountyId) where.bountyId = bountyId
        if (userId) where.userId = userId
        if (status) where.status = status

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
        const take = parseInt(limit as string)

        const [submissions, total] = await Promise.all([
            prisma.bountySubmission.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            walletAddress: true,
                            name: true,
                            reputation: true,
                        },
                    },
                    bounty: {
                        select: {
                            id: true,
                            bountyId: true,
                            title: true,
                            category: true,
                            totalReward: true,
                        },
                    },
                    attachments: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            prisma.bountySubmission.count({ where }),
        ])

        res.json({
            submissions,
            pagination: {
                total,
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                totalPages: Math.ceil(total / parseInt(limit as string)),
            },
        })
    } catch (error) {
        console.error('Get submissions error:', error)
        res.status(500).json({ error: 'Failed to fetch submissions' })
    }
})

// GET /api/submissions/:id - Get single submission
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const submission = await prisma.bountySubmission.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        walletAddress: true,
                        name: true,
                        email: true,
                        reputation: true,
                    },
                },
                bounty: {
                    include: {
                        company: true,
                        rewardBreakdown: true,
                    },
                },
                attachments: true,
            },
        })

        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' })
        }

        res.json(submission)
    } catch (error) {
        console.error('Get submission error:', error)
        res.status(500).json({ error: 'Failed to fetch submission' })
    }
})

// POST /api/submissions - Create new submission
router.post(
    '/',
    requireFields([
        'bountyId',
        'userId',
        'title',
        'description',
        'severity',
        'vulnerabilityType',
        'pocDescription',
    ]),
    async (req: Request, res: Response) => {
        try {
            const {
                bountyId,
                userId,
                title,
                description,
                severity,
                vulnerabilityType,
                pocDescription,
                pocSteps,
                pocVideoUrl,
                attachments,
            } = req.body

            const submission = await prisma.bountySubmission.create({
                data: {
                    bountyId,
                    userId,
                    title,
                    description,
                    severity,
                    vulnerabilityType,
                    pocDescription,
                    pocSteps: pocSteps || [],
                    pocVideoUrl,
                    attachments: attachments
                        ? {
                            create: attachments.map((att: any) => ({
                                fileName: att.fileName,
                                fileUrl: att.fileUrl,
                                fileType: att.fileType,
                                fileSize: att.fileSize,
                            })),
                        }
                        : undefined,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            walletAddress: true,
                            name: true,
                        },
                    },
                    bounty: {
                        select: {
                            id: true,
                            title: true,
                            category: true,
                        },
                    },
                    attachments: true,
                },
            })

            res.status(201).json(submission)
        } catch (error) {
            console.error('Create submission error:', error)
            res.status(500).json({ error: 'Failed to create submission' })
        }
    }
)

// PUT /api/submissions/:id - Update submission (for review/reward)
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { status, reviewedBy, reviewNotes, rewardAmount, rewardPaid } = req.body

        const data: any = {}
        if (status) {
            data.status = status
            if (status === 'UNDER_REVIEW' || status === 'ACCEPTED' || status === 'REJECTED') {
                data.reviewedAt = new Date()
                data.reviewedBy = reviewedBy
                data.reviewNotes = reviewNotes
            }
        }
        if (rewardAmount !== undefined) data.rewardAmount = parseFloat(rewardAmount)
        if (rewardPaid !== undefined) {
            data.rewardPaid = rewardPaid
            if (rewardPaid) data.paidAt = new Date()
        }

        const submission = await prisma.bountySubmission.update({
            where: { id },
            data,
            include: {
                user: true,
                bounty: true,
                attachments: true,
            },
        })

        res.json(submission)
    } catch (error) {
        console.error('Update submission error:', error)
        res.status(500).json({ error: 'Failed to update submission' })
    }
})

// DELETE /api/submissions/:id - Delete submission
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        await prisma.bountySubmission.delete({
            where: { id },
        })

        res.json({ message: 'Submission deleted successfully' })
    } catch (error) {
        console.error('Delete submission error:', error)
        res.status(500).json({ error: 'Failed to delete submission' })
    }
})

export default router
