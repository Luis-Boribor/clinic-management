import connect from "@/lib/connect";
import Records from "@/app/models/Records";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const findings = searchParams.get('findings');
        await connect();
        const result = await Records.find({ findings: findings, year: year });
        return new NextResponse(JSON.stringify({message: 'OK', record: result}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}

export const POST = async (request: Request) => {
    try {
        const { findings, year, monthlyCounts } = await request.json();
        await connect();
        const oldRecord = await Records.find({ findings: findings, year: year });
        if (oldRecord.length > 0) {
            for (let index = 0; index < monthlyCounts.length; index++) {
                const temp = await Records.findOneAndUpdate(
                    { findings: findings, year: year, month: index },
                    { count: monthlyCounts[index] },
                    { new: true }
                );
                if (!temp && monthlyCounts[index] !== 0) {
                    await Records.create({
                        findings: findings,
                        year: year,
                        month: index,
                        count: monthlyCounts[index]
                    })
                }
            }
            return new NextResponse(JSON.stringify({message: 'OK'}), {status: 200});
        }
        for (let index = 0; index < monthlyCounts.length; index++) {
            const element = monthlyCounts[index];
            if (element > 0)
                await Records.create({
                    findings: findings,
                    year: year,
                    month: index,
                    count: element,
                })
        }
        return new NextResponse(JSON.stringify({message: 'OK'}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}