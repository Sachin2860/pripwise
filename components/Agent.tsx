import React from "react";
import { cn } from "@/lib/utils"; // 1. Added import for cn (assuming standard /lib/utils)

// 2. Defined AgentProps based on usage in /interview/page.tsx
interface AgentProps {
  userName: string;
  userId: string;
  type: string;
}

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

const Agent = ({ userName }: AgentProps) => { // 3. Used defined AgentProps
  const callStatus = CallStatus.FINISHED;
  const isSpeaking = true;
  const message = [
    'Whats your name?',
    'My name is Agent Sia, Nice to meet you!'
  ];

  const Lastmessage = message[message.length - 1];

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <img
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <img
              src="/user-avatar.png"
              alt="user"
              height={540}
              width={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>
      {message.length > 0 && (
        <div className="transcript-border mt-5">
          <div className="transcript">
            {/* 4. Added 'key' to the p tag, assuming Lastmessage is unique for transitions */}
            <p key={Lastmessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100 ')}>
              {Lastmessage}
            </p>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center mt-8">
        {/* 5. Compared callStatus to enum members, not strings */}
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="relative btn-call">
            {/* 6. Fixed button span syntax:
                 - Corrected cn logic to use '&&' (logical AND)
                 - Corrected enum comparison
                 - Made the span self-closing '/>'
                 - Removed extra '</span>'
            */}
            <span 
              className={cn(
                'absolute animate-ping rounded-full opacity-75', 
                callStatus !== CallStatus.CONNECTING && 'hidden'
              )} 
            />
            <span>
              {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED 
                ? 'Call' 
                : '...'}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">End</button>
        )}
      </div>
    </>
  );
};

export default Agent;