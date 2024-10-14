export default function HealthRecord() {
    return (
        <div className="w-full flex justify-center items-center">
            <section className="w-full md:w-2/3 rounded-lg shadow-xl p-5 bg-zinc-400">
                <header className="mb-5 font-semibold flex justify-between items-center">
                    <h1 className="text-2xl">Health Records</h1>
                </header>
                <div className="relative w-full h-96">
                    <table className="w-full table-auto md:table-fixed text-center">
                        <thead className="text-white bg-zinc-600">
                            <tr>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </section>
        </div>
    )
}