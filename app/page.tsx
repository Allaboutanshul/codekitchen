import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-slate-950 px-6 py-20 text-white sm:px-10 lg:min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_25%,rgba(99,102,241,0.28),transparent_34%),radial-gradient(circle_at_18%_80%,rgba(14,165,233,0.14),transparent_30%)]" />
      <div className="relative mx-auto w-full max-w-5xl">
        <div className="max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-slate-300">
            <Sparkles className="size-4 text-indigo-300" aria-hidden="true" />
            Your intelligent job search workspace
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Automate Your Career Optimization Pipeline.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            Upload your resume, parse job descriptions, and generate tailored outreach drafts in seconds.
          </p>
          <Button asChild size="lg" className="mt-9 bg-white text-slate-950 hover:bg-slate-100">
            <Link href="/new-application">
              Optimize an application
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
