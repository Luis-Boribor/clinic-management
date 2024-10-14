export default function MedicineDispensed() {
    return (
        <div className="w-full flex justify-center items-center">
            <section className="w-full md:w-2/3 rounded-lg shadow-xl p-5 bg-zinc-400">
                <header className="mb-5 font-semibold flex justify-between items-center">
                    <h1 className="text-2xl">Medicines</h1>
                </header>
                <div className="relative w-full h-96">
                    <table className="w-full table-auto md:table-fixed text-center">
                        <thead className="text-white bg-zinc-600">
                            <tr>
                                <th>Medicine Name</th>
                                <th>Dispensed to</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </section>
        </div>
    )
}