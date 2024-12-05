import axios, { AxiosError } from "axios";
import { ChangeEvent, FC, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";

interface Record {
    findings: string;
    year: number;
    month: number;
    count: number;
}

const FindingsForm: FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() - 1);
  const [findings, setFindings] = useState<string>("");
  const [monthlyCounts, setMonthlyCounts] = useState<number[]>(Array(12).fill(0));

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const onchangeFindings = async (e: ChangeEvent<HTMLSelectElement>) => {
    const f = e.target.value
    setFindings(f)
    await axios.get(`/api/records?findings=${f}&year=${selectedYear}`)
    .then(response => {
        const record = response.data?.record
        console.log(record)
        const newMonths = [...monthlyCounts]
        record.filter((item: Record)  => 
            newMonths[item.month] = item.count
        )
        setMonthlyCounts(newMonths)
    })
    .catch(error => {
        console.log(error)
    })
  }

  const handleMonthlyCountChange = (index: number, value: number) => {
    const updatedCounts = [...monthlyCounts];
    updatedCounts[index] = value;
    setMonthlyCounts(updatedCounts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      findings,
      year: selectedYear,
      monthlyCounts,
    };

    toast.promise(
        axios.post('/api/records', data),
        {
            pending: 'Saving record...',
            success: {
                render() {
                    setFindings('')
                    setMonthlyCounts(Array(12).fill(0))
                    return 'Record saved'
                }
            },
            error: {
                render({ data }: { data: AxiosError<{message: ''}> }) {
                    Swal.fire({
                        title: 'Error',
                        text: data.response?.data?.message
                    })
                    console.log(data)
                    return 'Error'
                }
            }
        }
    )
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-zinc-400">
        <ToastContainer position="bottom-right" />
      {/* Select Year */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Year</label>
        <input
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
          className="w-full border border-gray-300 rounded px-3 py-2"
          min="2000"
          required
        />
      </div>

      {/* Findings */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Findings</label>
        <select 
            className="w-full border border-gray-300 rounded px-3 py-2" 
            value={findings}
            onChange={onchangeFindings}
            required
        >
            <option value="">-- Select --</option>
            <option value="headache">Headache</option>
            <option value="cough">Cough</option>
            <option value="cold">Cold</option>
            <option value="flu">Flu</option>
            <option value="allergies">Allergies</option>
            <option value="stomach ache">Stomach Ache</option>
            <option value="uti">UTI</option>
            <option value="toothache">Toothache</option>
            <option value="injury">Injury</option>
            <option value="infected wounds">Infected Wounds</option>
            <option value="tuberculosis">Tuberculosis</option>
            <option value="menstrual cramps">Menstrual Cramps</option>
        </select>
      </div>

      {/* Monthly Counts */}
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Monthly Counts</h2>
        {months.map((month, index) => (
          <div key={index} className="flex items-center mb-2">
            <label className="w-1/4">{month}</label>
            <input
              type="number"
              value={monthlyCounts[index]}
              onChange={(e) => handleMonthlyCountChange(index, parseInt(e.target.value, 10) || 0)}
              className="w-3/4 border border-gray-300 rounded px-3 py-2"
              min="0"
              required
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600"
      >
        Save Record
      </button>
    </form>
  );
};

export default FindingsForm;
