import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/bounties/[id] - Fetch single bounty
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const bounty = await prisma.bounty.findUnique({
            where: { id: params.id },
            include: {
                company: true,
                rewardBreakdown: true,
                rules: true,
                participants: {
                    include: {
                        user: true
                    }
                },
                submissions: {
                    include: {
                        user: true
                    }
                }
            }
        })

        if (!bounty) {
            return NextResponse.json(
                { error: 'Bounty not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(bounty)
    } catch (error) {
        console.error('Error fetching bounty:', error)
        return NextResponse.json(
            { error: 'Failed to fetch bounty' },
            { status: 500 }
        )
    }
}

// PUT /api/bounties/[id] - Update bounty
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()

        const bounty = await prisma.bounty.update({
            where: { id: params.id },
            data: {
                title: body.title,
                description: body.description,
                totalReward: body.totalReward,
                severity: body.severity,
                status: body.status,
                deadline: body.deadline ? new Date(body.deadline) : undefined,
                scope: body.scope,
                inScope: body.inScope,
                outOfScope: body.outOfScope,
                techStack: body.techStack,
                securityFocus: body.securityFocus
            }
        })

        return NextResponse.json(bounty)
    } catch (error) {
        console.error('Error updating bounty:', error)
        return NextResponse.json(
            { error: 'Failed to update bounty' },
            { status: 500 }
        )
    }
}

// DELETE /api/bounties/[id] - Delete bounty
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.bounty.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting bounty:', error)
        return NextResponse.json(
            { error: 'Failed to delete bounty' },
            { status: 500 }
        )
    }
}
