import { Router, Request, Response } from 'express'
import { prisma } from '../prisma'

const router = Router()

// GET /api/statistics - Get latest statistics
router.get('/', async (req: Request, res: Response) => {
    try {
        const latestStats = await prisma.statistics.findFirst({
            orderBy: { date: 'desc' },
        })

        if (!latestStats) {
            return res.json({
                totalCases: 0,
                totalBounties: 0,
                totalRewardsDistributed: 0,
                totalUsers: 0,
                activeBounties: 0,
            })
        }

        res.json(latestStats)
    } catch (error) {
        console.error('Get statistics error:', error)
        res.status(500).json({ error: 'Failed to fetch statistics' })
    }
})

// GET /api/statistics/dashboard - Get real-time dashboard stats
router.get('/dashboard', async (req: Request, res: Response) => {
    try {
        const [
            totalCases,
            totalBounties,
            activeBounties,
            totalUsers,
            totalSubmissions,
            rewardedSubmissions,
        ] = await Promise.all([
            prisma.case.count(),
            prisma.bounty.count(),
            prisma.bounty.count({ where: { status: 'ACTIVE' } }),
            prisma.user.count(),
            prisma.bountySubmission.count(),
            prisma.bountySubmission.findMany({
                where: { rewardPaid: true },
                select: { rewardAmount: true },
            }),
        ])

        const totalRewardsDistributed = rewardedSubmissions.reduce(
            (sum, sub) => sum + (sub.rewardAmount ? Number(sub.rewardAmount) : 0),
            0
        )

        // Get case breakdown by category
        const casesByCategory = await prisma.case.groupBy({
            by: ['reportCategory'],
            _count: true,
        })

        // Get bounty breakdown by category
        const bountiesByCategory = await prisma.bounty.groupBy({
            by: ['category'],
            _count: true,
        })

        res.json({
            totalCases,
            totalBounties,
            activeBounties,
            totalUsers,
            totalSubmissions,
            totalRewardsDistributed,
            casesByCategory: casesByCategory.reduce(
                (acc, item) => {
                    acc[item.reportCategory] = item._count
                    return acc
                },
                {} as Record<string, number>
            ),
            bountiesByCategory: bountiesByCategory.reduce(
                (acc, item) => {
                    acc[item.category] = item._count
                    return acc
                },
                {} as Record<string, number>
            ),
        })
    } catch (error) {
        console.error('Get dashboard statistics error:', error)
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' })
    }
})

export default router
