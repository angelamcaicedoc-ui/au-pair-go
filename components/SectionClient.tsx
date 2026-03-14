"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { UserProfile, loadProfile } from "@/lib/chatUtils";
import { Chat } from "@/components/Chat";
import Profile from "@/components/Profile";
import { MessageCounter } from "@/components/MessageCounter";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["700"] });

interface SectionClientProps {
  sectionId: string;
  sectionLabel: string;
  sectionIcon: string;
  sectionDescription: string;
  sectionContent: string;
}

export function SectionClient({
  sectionId,
  sectionLabel,
  sectionIcon,
  sectionDescription,
  sectionContent,
}: SectionClientProps) {
  const [profile, setProfile] = useState<UserProfile>(loadProfile());
  const [iaCount, setIaCount] = useState<number | undefined>(undefined);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9FD7E8]/20 via-white to-[#B19CD9]/20 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B19CD9]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#9FD7E8]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

      <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="inline-flex items-center text-sm font-bold text-[#B19CD9] hover:text-[#9c82c9] transition-colors mb-6 bg-white/50 px-4 py-2 rounded-full border border-white backdrop-blur-sm">
            ← Volver al inicio
          </a>

          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md rounded-3xl border border-white/60 p-6 shadow-xl shadow-[#9FD7E8]/5">
            <div className="w-16 h-16 min-w-[64px] bg-gradient-to-br from-[#9FD7E8]/30 to-[#B19CD9]/20 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-white">
              {sectionIcon}
            </div>
            <div>
              <h1 className={`${quicksand.className} text-2xl md:text-3xl font-bold text-gray-800 tracking-tight`}>
                {sectionLabel}
              </h1>
              <p className="text-gray-600 text-sm font-medium mt-1 leading-relaxed">
                {sectionDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="mb-6">
          <Profile onProfileChange={setProfile} />
        </div>

        {/* Message counter */}
        <div className="mb-6">
          <MessageCounter count={iaCount} />
        </div>

        {/* Reference content toggle */}
        {sectionContent && (
          <div className="mb-6">
            <button
              onClick={() => setShowContent(!showContent)}
              className="w-full flex items-center justify-between bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 hover:bg-white/80 transition-all shadow-sm"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">📚</span>
                {showContent ? "Ocultar guía de referencia" : "Ver guía de referencia"}
              </span>
              <span className="text-xs text-[#B19CD9]">{showContent ? "▲" : "▼"}</span>
            </button>

            {showContent && (
              <div className="mt-3 bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl p-6 shadow-xl shadow-[#9FD7E8]/5 prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-[#B19CD9] prose-strong:text-gray-800 prose-li:text-gray-600">
                <ReactMarkdown>{sectionContent}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* Chat */}
        <div className="bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl p-5 md:p-6 shadow-xl shadow-[#B19CD9]/5">
          <h2 className={`${quicksand.className} text-lg font-bold text-gray-800 mb-4 flex items-center gap-2`}>
            <span>✨</span> Chat Asistente
          </h2>
          <Chat
            sectionId={sectionId}
            sectionContent={sectionContent}
            profile={profile}
            onCountUpdate={(count) => setIaCount(count)}
          />
        </div>
      </div>
    </div>
  );
}
