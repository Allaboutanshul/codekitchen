import { Badge } from "@/components/ui/badge";

const applications = [
  {
    company: "Northstar Labs",
    jobTitle: "Senior Product Designer",
    status: "Outreach ready",
    matchScore: 92,
    nextNudge: "Sep 14, 2026",
  },
  {
    company: "Lattice Health",
    jobTitle: "Product Designer",
    status: "Applied",
    matchScore: 76,
    nextNudge: "Sep 16, 2026",
  },
  {
    company: "Mosaic Systems",
    jobTitle: "UX Researcher",
    status: "Needs review",
    matchScore: 43,
    nextNudge: "Sep 18, 2026",
  },
];

function scoreBadgeClass(score: number) {
  if (score > 80) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (score >= 50) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  return "border-red-200 bg-red-50 text-red-700";
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-indigo-600">
              FitMatch AI
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Application dashboard</h1>
            <p className="mt-2 text-slate-500">Keep every opportunity moving forward.</p>
          </div>
          <a
            href="/new-application"
            className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Optimize application
          </a>
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="font-semibold">Tracked applications</h2>
            <p className="mt-1 text-sm text-slate-500">{applications.length} active opportunities</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Company</th>
                  <th className="px-6 py-3 font-medium">Job title</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Match score</th>
                  <th className="px-6 py-3 font-medium">Next nudge date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((application) => (
                  <tr key={`${application.company}-${application.jobTitle}`} className="hover:bg-slate-50/80">
                    <td className="px-6 py-4 font-medium text-slate-900">{application.company}</td>
                    <td className="px-6 py-4 text-slate-600">{application.jobTitle}</td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="font-medium text-slate-600">
                        {application.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={scoreBadgeClass(application.matchScore)}>
                        {application.matchScore}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{application.nextNudge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
