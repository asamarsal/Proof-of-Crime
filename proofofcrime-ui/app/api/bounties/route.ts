import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BountyCategory } from '@prisma/client'

// GET /api/bounties - Fetch all bounties with optional category filter
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const category = searchParams.get('category') as BountyCategory | null

        const bounties = await prisma.bounty.findMany({
            where: category ? { category } : {},
            include: {
                company: true,
                rewardBreakdown: true,
                participants: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(bounties)
    } catch (error) {
        console.error('Error fetching bounties:', error)
        return NextResponse.json(
            { error: 'Failed to fetch bounties' },
            { status: 500 }
        )
    }
}

// POST /api/bounties - Create a new bounty
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Create bounty with company
        const bounty = await prisma.bounty.create({
            data: {
                bountyId: body.bountyId || `${body.category}-${Date.now()}`,
                title: body.title,
                description: body.description,
                category: body.category,
                company: {
                    connectOrCreate: {
                        where: { name: body.companyName },
                        create: {
                            name: body.companyName,
                            logo: body.companyLogo,
                            website: body.companyWebsite,
                            dappUrl: body.companyDappUrl,
                            github: body.companyGithub,
                            documentation: body.companyDocumentation,
                            discord: body.companyDiscord,
                            telegram: body.companyTelegram,
                            description: body.companyDescription
                        }
                    }
                },
                totalReward: body.totalReward,
                rewardToken: body.rewardToken || 'USDC',
                severity: body.severity,
                deadline: new Date(body.deadline),
                scope: body.scope,
                inScope: body.inScope || [],
                outOfScope: body.outOfScope || [],
                techStack: body.techStack || [],
                securityFocus: body.securityFocus
            },
            include: {
                company: true
            }
        })

        // Create reward breakdown if provided
        if (body.rewardBreakdown && body.rewardBreakdown.length > 0) {
            await prisma.rewardBreakdown.createMany({
                data: body.rewardBreakdown.map((rb: any) => ({
                    bountyId: bounty.id,
                    severity: rb.severity,
                    amount: rb.amount,
                    description: rb.description
                }))
            })
        }

        // Create rules if provided
        if (body.rules && body.rules.length > 0) {
            await prisma.bountyRule.createMany({
                data: body.rules.map((rule: string, index: number) => ({
                    bountyId: bounty.id,
                    ruleNumber: index + 1,
                    ruleText: rule
                }))
            })
        }

        return NextResponse.json(bounty, { status: 201 })
    } catch (error) {
        console.error('Error creating bounty:', error)
        return NextResponse.json(
            { error: 'Failed to create bounty' },
            { status: 500 }
        )
    }
}
