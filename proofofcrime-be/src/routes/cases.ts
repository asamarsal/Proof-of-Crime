import { Router, Request, Response } from 'express'
import { prisma } from '../prisma'
import { requireFields } from '../middleware/validation'

const router = Router()

// GET /api/cases - Get all cases with optional filters
router.get('/', async (req: Request, res: Response) => {
    try {
        const { category, blockchain, status, page = '1', limit = '10' } = req.query

        const where: any = {}
        if (category) where.reportCategory = category
        if (blockchain) where.blockchain = blockchain
        if (status) where.status = status

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
        const take = parseInt(limit as string)

        const [cases, total] = await Promise.all([
            prisma.case.findMany({
                where,
                include: {
                    submitter: {
                        select: {
                            id: true,
                            walletAddress: true,
                            name: true,
                            reputation: true,
                        },
                    },
                    evidence: true,
                    _count: {
                        select: { comments: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            prisma.case.count({ where }),
        ])

        res.json({
            cases,
            pagination: {
                total,
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                totalPages: Math.ceil(total / parseInt(limit as string)),
            },
        })
    } catch (error) {
        console.error('Get cases error:', error)
        res.status(500).json({ error: 'Failed to fetch cases' })
    }
})

// GET /api/cases/:id - Get single case
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const caseData = await prisma.case.findUnique({
            where: { id },
            include: {
                submitter: {
                    select: {
                        id: true,
                        walletAddress: true,
                        name: true,
                        email: true,
                        reputation: true,
                        role: true,
                    },
                },
                evidence: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                walletAddress: true,
                                name: true,
                                reputation: true,
                            },
                        },
                        replies: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        walletAddress: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                    where: { parentId: null }, // Only top-level comments
                    orderBy: { createdAt: 'desc' },
                },
            },
        })

        if (!caseData) {
            return res.status(404).json({ error: 'Case not found' })
        }

        res.json(caseData)
    } catch (error) {
        console.error('Get case error:', error)
        res.status(500).json({ error: 'Failed to fetch case' })
    }
})

// POST /api/cases - Create new case
router.post(
    '/',
    requireFields(['caseTitle', 'reportCategory', 'description', 'submitterId']),
    async (req: Request, res: Response) => {
        try {
            const {
                caseTitle,
                reportCategory,
                crimeType,
                blockchain,
                suspectWallet,
                contractAddress,
                estimatedLoss,
                numVictims,
                description,
                transactionHashes,
                vulnerabilityType,
                severity,
                contractSource,
                websiteUrl,
                dappUrl,
                exploitType,
                affectedComponents,
                suspectName,
                submitterId,
                submitterName,
                submitterEmail,
                isAnonymous,
                evidence,
            } = req.body

            const caseData = await prisma.case.create({
                data: {
                    caseTitle,
                    reportCategory,
                    crimeType,
                    blockchain,
                    suspectWallet,
                    contractAddress,
                    estimatedLoss: estimatedLoss ? parseFloat(estimatedLoss) : null,
                    numVictims: numVictims ? parseInt(numVictims) : null,
                    description,
                    transactionHashes,
                    vulnerabilityType,
                    severity,
                    contractSource,
                    websiteUrl,
                    dappUrl,
                    exploitType,
                    affectedComponents,
                    suspectName,
                    submitterId,
                    submitterName,
                    submitterEmail,
                    isAnonymous: isAnonymous || false,
                    evidence: evidence
                        ? {
                            create: evidence.map((ev: any) => ({
                                fileName: ev.fileName,
                                fileUrl: ev.fileUrl,
                                fileType: ev.fileType,
                                fileSize: ev.fileSize,
                                description: ev.description,
                            })),
                        }
                        : undefined,
                },
                include: {
                    submitter: true,
                    evidence: true,
                },
            })

            res.status(201).json(caseData)
        } catch (error) {
            console.error('Create case error:', error)
            res.status(500).json({ error: 'Failed to create case' })
        }
    }
)

// PUT /api/cases/:id - Update case
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const {
            caseTitle,
            reportCategory,
            crimeType,
            blockchain,
            suspectWallet,
            contractAddress,
            estimatedLoss,
            numVictims,
            description,
            transactionHashes,
            status,
            vulnerabilityType,
            severity,
            contractSource,
            websiteUrl,
            dappUrl,
            exploitType,
            affectedComponents,
            suspectName,
        } = req.body

        const caseData = await prisma.case.update({
            where: { id },
            data: {
                caseTitle,
                reportCategory,
                crimeType,
                blockchain,
                suspectWallet,
                contractAddress,
                estimatedLoss: estimatedLoss ? parseFloat(estimatedLoss) : null,
                numVictims: numVictims ? parseInt(numVictims) : null,
                description,
                transactionHashes,
                status,
                vulnerabilityType,
                severity,
                contractSource,
                websiteUrl,
                dappUrl,
                exploitType,
                affectedComponents,
                suspectName,
            },
            include: {
                submitter: true,
                evidence: true,
            },
        })

        res.json(caseData)
    } catch (error) {
        console.error('Update case error:', error)
        res.status(500).json({ error: 'Failed to update case' })
    }
})

// PATCH /api/cases/:id - Partial update
router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const updates = req.body

        // Convert numeric fields
        if (updates.estimatedLoss) updates.estimatedLoss = parseFloat(updates.estimatedLoss)
        if (updates.numVictims) updates.numVictims = parseInt(updates.numVictims)

        const caseData = await prisma.case.update({
            where: { id },
            data: updates,
            include: {
                submitter: true,
                evidence: true,
            },
        })

        res.json(caseData)
    } catch (error) {
        console.error('Patch case error:', error)
        res.status(500).json({ error: 'Failed to update case' })
    }
})

// DELETE /api/cases/:id - Delete case
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        await prisma.case.delete({
            where: { id },
        })

        res.json({ message: 'Case deleted successfully' })
    } catch (error) {
        console.error('Delete case error:', error)
        res.status(500).json({ error: 'Failed to delete case' })
    }
})

export default router
