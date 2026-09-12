export type OptimizeApplicationInput = {
  resumeText: string;
  jobDescription: string;
  company: string;
};

export type OptimizeApplicationResult = {
  application_id?: string;
  match_score: number;
  strengths: string[];
  gaps: string[];
  outreach_email: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function optimizeApplication(
  input: OptimizeApplicationInput,
): Promise<OptimizeApplicationResult> {
  if (!apiUrl) {
    throw new Error("The API URL is not configured. Set NEXT_PUBLIC_API_URL and try again.");
  }

  let response: Response;

  try {
    response = await fetch(`${apiUrl}/api/v1/optimize-pipeline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume_text: input.resumeText,
        job_description: input.jobDescription,
        company: input.company,
      }),
    });
  } catch {
    throw new Error("We could not reach the optimization service. Please check your connection and try again.");
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("The optimization service is busy right now. Please wait a moment and try again.");
    }

    let detail = "The optimization request failed. Please try again.";
    try {
      const errorBody = (await response.json()) as { detail?: string };
      if (errorBody.detail) {
        detail = errorBody.detail;
      }
    } catch {
      // Keep the friendly fallback when the backend does not return JSON.
    }

    throw new Error(detail);
  }

  return (await response.json()) as OptimizeApplicationResult;
}
