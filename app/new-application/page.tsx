"use client";

import { FormEvent, useState } from "react";
import { optimizeApplication, type OptimizeApplicationResult } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewApplicationPage() {
  const [company, setCompany] = useState("");
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<OptimizeApplicationResult | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setCopied(false);
    setIsLoading(true);

    try {
      const optimization = await optimizeApplication({
        company,
        resumeText: resume,
        jobDescription,
      });
      setResult(optimization);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyDraft() {
    if (!result) return;
    await navigator.clipboard.writeText(result.outreach_email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <a href="/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Back to dashboard
        </a>
        <div className="mt-6 max-w-2xl">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-indigo-600">New application</p>
          <h1 className="text-3xl font-semibold tracking-tight">Optimize your outreach</h1>
          <p className="mt-2 text-slate-500">Share the role and your experience to generate a tailored draft.</p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
          <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">Company name</label>
                <Input id="company" value={company} onChange={(event) => setCompany(event.target.value)} placeholder="e.g. Northstar Labs" required maxLength={500} />
              </div>
              <div className="space-y-2">
                <label htmlFor="resume" className="text-sm font-medium">Resume</label>
                <Textarea id="resume" value={resume} onChange={(event) => setResume(event.target.value)} placeholder="Paste your resume text here..." className="min-h-52 resize-y" required maxLength={100000} />
              </div>
              <div className="space-y-2">
                <label htmlFor="job-description" className="text-sm font-medium">Job description</label>
                <Textarea id="job-description" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the job description here..." className="min-h-52 resize-y" required maxLength={100000} />
              </div>
              {error && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <><span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />Generating draft...</>
                ) : "Generate optimized outreach"}
              </Button>
            </div>
          </form>

          <section aria-live="polite" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="font-semibold">AI recommendation</h2>
                <p className="mt-1 text-sm text-slate-500">Your generated outreach will appear here.</p>
              </div>
              {result && <span className="text-2xl font-semibold text-indigo-600">{Math.round(result.match_score)}%</span>}
            </div>
            {isLoading ? (
              <div className="space-y-3 pt-6" aria-label="Generating recommendation">
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
                <div className="h-24 w-full animate-pulse rounded bg-slate-100" />
              </div>
            ) : result ? (
              <div className="pt-6">
                <div className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">{result.outreach_email}</div>
                <Button type="button" variant="outline" onClick={copyDraft} className="mt-4 w-full">
                  {copied ? "Copied" : "Copy to clipboard"}
                </Button>
              </div>
            ) : (
              <p className="pt-6 text-sm leading-6 text-slate-500">Complete the form to receive a fit score and a personalized outreach draft.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
