import { getRandomInterviewCover } from "@/lib/utils";
import dayjs from "dayjs";
import { da } from "zod/v4/locales";
import { Button } from "./ui/button";
import Link from "next/link";
import { check } from "zod";
import DisplayTechicons from "./DisplayTechicons";

const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback = null as Feedback | null;
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const formatedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[350px] max-sm:w-full min-h-96 mt-5">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-0 py-2 rounded-bl-lg bg-light-600">
            <p className="badge-text">{normalizedType}</p>
          </div>
          <img
            src={getRandomInterviewCover()}
            alt="coverimage"
            width={70}
            height={70}
            className="rounded-full object-fit size-[70px]"
          />
          <h3 className="mt-5 capitalize">{role} Interview</h3>
          <div className="flex flex-row mt-3 gap-5">
            <div className="flex flex-row gap-2">
              <img src="/calendar.svg" alt="calendar" width={22} height={22} />
              <p>{formatedDate}</p>
              <div className="flex flex-row gap-2 items-center">
                <img src="/star.svg" alt="star" width={22} height={22} />
                <p>{feedback?.totalScore || "---"}/100</p>
              </div>
            </div>
          </div>
          <hr className="border-solid"/>
          <p className="line-clamp-2 m-0">
            {feedback?.finalAssessment ||
              "You haven't taken the interview.Take it now to improve your skills."}
          </p>
        </div>
        <div className="flex flex-row justify-between">
            <DisplayTechicons techStack={techstack}/>

            <Button className="btn-primary">
              <Link href={feedback ?`/interview/${interviewId}/feedback`:`/interview/${interviewId}`}>
              {feedback?'Check Feedback':'View Interview'}
              </Link>
            </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
