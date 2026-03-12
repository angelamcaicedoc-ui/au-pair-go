"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { UserProfile, loadProfile } from "@/lib/chatUtils";
import { Chat } from "@/components/Chat";
import { Profile } from "@/components/Profile";
import { MessageCounter } from "@/components/MessageCounter";

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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <a href="/" className="text-sm text-rose-500 hover:text-rose-600 flex items-center gap-1 mb-4">
            ← Inicio
          </a>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{sectionIcon}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{sectionLabel}</h1>
              <p className="text-gray-500 text-sm">{sectionDescription}</p>
            </div>
          </div>
        </div>

        {/* Profile */}
        <Profile onProfileChange={(p) => setProfile(p)} />

        {/* Message counter */}
        <div className="mb-4">
          <MessageCounter count={iaCount} />
        </div>

        {/* Reference content toggle */}
        {sectionContent && (
          <div className="mb-4">
            <button
              onClick={() => setShowContent(!showContent)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-rose-500 transition-colors"
            >
              <span>📚</span>
              <span className="font-medium">
                {showContent ? "Ocultar guía de referencia" : "Ver guía de referencia"}
              </span>
              <span className="text-xs">{showContent ? "▲" : "▼"}</span>
            </button>

            {showContent && (
              <div className="mt-3 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm prose prose-sm max-w-none prose-headings:text-gray-700 prose-a:text-rose-500">
                <ReactMarkdown>{sectionContent}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* Chat */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>✨</span> Chat con IA — {sectionLabel}
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
