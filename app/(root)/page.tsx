import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { dummyInterviews } from "@/constants";
import InterviewCard from "@/components/InterviewCard";

export default function Page() {
  return (
    <div>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>
            Getting Interview-Ready with AI-Powered Practice & Feedback.
          </h2>
          <p className="text-lg">
            Practice on real interview questions and get instant feedback.
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
        <img
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>
      <section className="felx flex-col gap-6 mt-8">
        <h2>Your Interview</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard key={interview.id} {...interview} />
          ))}
        </div>
      </section>
      <section className="felx flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard key={interview.id} {...interview}  />
          ))}
        </div>
      </section>
    </div>
  );
}
