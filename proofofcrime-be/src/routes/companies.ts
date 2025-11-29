import { Router, Request, Response } from 'express'
import { prisma } from '../prisma'
import { requireFields } from '../middleware/validation'

const router = Router()

// GET /api/companies - Get all companies
router.get('/', async (req: Request, res: Response) => {
    try {
        const companies = await prisma.company.findMany({
            include: {
                _count: {
                    select: { bounties: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        })

        res.json(companies)
    } catch (error) {
        console.error('Get companies error:', error)
        res.status(500).json({ error: 'Failed to fetch companies' })
    }
})

// GET /api/companies/:id - Get single company
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const company = await prisma.company.findUnique({
            where: { id },
            include: {
                bounties: {
                    include: {
                        rewardBreakdown: true,
                        _count: {
                            select: {
                                participants: true,
                                submissions: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        })

        if (!company) {
            return res.status(404).json({ error: 'Company not found' })
        }

        res.json(company)
    } catch (error) {
        console.error('Get company error:', error)
        res.status(500).json({ error: 'Failed to fetch company' })
    }
})

// POST /api/companies - Create new company
router.post('/', requireFields(['name']), async (req: Request, res: Response) => {
    try {
        const { name, logo, website, dappUrl, github, documentation, discord, telegram, description } =
            req.body

        const company = await prisma.company.create({
            data: {
                name,
                logo,
                website,
                dappUrl,
                github,
                documentation,
                discord,
                telegram,
                description,
            },
        })

        res.status(201).json(company)
    } catch (error) {
        console.error('Create company error:', error)
        res.status(500).json({ error: 'Failed to create company' })
    }
})

// PUT /api/companies/:id - Update company
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { name, logo, website, dappUrl, github, documentation, discord, telegram, description } =
            req.body

        const company = await prisma.company.update({
            where: { id },
            data: {
                name,
                logo,
                website,
                dappUrl,
                github,
                documentation,
                discord,
                telegram,
                description,
            },
        })

        res.json(company)
    } catch (error) {
        console.error('Update company error:', error)
        res.status(500).json({ error: 'Failed to update company' })
    }
})

// DELETE /api/companies/:id - Delete company
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        await prisma.company.delete({
            where: { id },
        })

        res.json({ message: 'Company deleted successfully' })
    } catch (error) {
        console.error('Delete company error:', error)
        res.status(500).json({ error: 'Failed to delete company' })
    }
})

export default router
