import connect from "@/lib/connect";
import MedicineDispensed from "@/app/models/MedicineDispensed";
import MedicineDispensedItem from "@/app/models/MedicineDispensedItem";
import Medicine from "@/app/models/Medicine";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async () => {
    try {
        await connect();
        // const dispensed = await MedicineDispensed.find({ deletedAt: null }).populate('items').populate('record').sort({ createdAt: -1 });
        const dispensed = await MedicineDispensed.aggregate([
            {
                $match: { deletedAt: null },
            },
            {
                $lookup: {
                    from: 'medicinedispenseditems',
                    localField: 'items',
                    foreignField: '_id',
                    as: 'items'
                }
            },
            {
                $unwind: {
                    path: '$items',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $lookup: {
                    from: 'medicines',
                    localField: 'items.medicine',
                    foreignField: '_id',
                    as: 'medicine'
                },
            },
            {
                $unwind: {
                    path: '$medicine',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $lookup: {
                    from: 'medicalrecords',
                    localField: 'record',
                    foreignField: '_id',
                    as: 'record'
                }
            },
            {
                $unwind: {
                    path: '$record',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    items: [{
                        _id: '$items._id',
                        medicine: {
                            _id: '$medicine._id',
                            medicine_name: '$medicine.medicine_name',
                            description: '$medicine.description'
                        },
                        quantity: '$items.quantity',
                        dosage: '$items.dosage',
                        dosage_unit: '$items.dosage_unit',
                        dosage_total: '$items.dosage_total',
                    }],
                    record: {
                        _id: '$record._id',
                        consultation_type: '$record.consultation_type'
                    },
                    createdAt: 1,
                }
            }
        ]).sort({ createdAt: -1 });
        return new NextResponse(JSON.stringify({message: 'OK', dispensed: dispensed}), {status: 200});
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
        const { medicine, record } = await request.json();
        const itemId = [];
        if (!Types.ObjectId.isValid(record)) {
            return new NextResponse(JSON.stringify({message: 'Invalid record id'}), {status: 400});
        }
        await connect();
        for (let i = 0; i < medicine.length; i++) {
            const tmp = await Medicine.findOne({ _id: medicine[i].id });
            if (!tmp) {
                return new NextResponse(JSON.stringify({message: 'Medicine not found'}), {status: 404});
            }
            if (tmp.stock < medicine[i].quantity) {
                return new NextResponse(JSON.stringify({message: 'Medicine quantity exceeded medicine stock'}), {status: 400});
            }
        }
        for (let index = 0; index < medicine.length; index++) {
            const temp = await MedicineDispensedItem.create({
                medicine: medicine[index].id,
                quantity: medicine[index].quantity,
                dosage: medicine[index].dosage,
                dosage_unit: medicine[index].dosage_unit,
                dosage_total: medicine[index].dosage_total
            });
            itemId.push(temp?._id);
            await Medicine.findOneAndUpdate(
                { _id: medicine[index].id },
                { $inc: { stock: -medicine[index].quantity } },
                { new: true }
            );
        }
        const result = await MedicineDispensed.create({
            record: record,
            items: itemId,
        });
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to dispense medicine'}), {status: 400});
        }
        return new NextResponse(JSON.stringify({message: 'OK', test: result}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}

// export const PATCH = async (request: Request) => {
//     try {

//     } catch (error: unknown) {
//         let message = '';
//         if (error instanceof Error) {
//             message = error.message;
//         }
//         return new NextResponse('Error: ' + message, {status: 500});
//     }
// }