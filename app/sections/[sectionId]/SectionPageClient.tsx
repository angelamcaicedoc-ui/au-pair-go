"use client";

import { useState, useEffect, startTransition } from "react";
import Link from "next/link";
import { Section } from "@/lib/sections/sections";
import { UserProfile, defaultProfile } from "@/lib/profile";
import Chat from "@/components/Chat";
import Profile from "@/components/Profile";
import SectionContent from "@/components/SectionContent";
import FreemiumCounter from "@/components/FreemiumCounter";
import LocationRecommendations from "@/components/LocationRecommendations";

interface Props {
  section: Section;
}

export default function SectionPageClient({ section }: Props) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [activeTab, setActiveTab] = useState<"chat" | "content">("chat");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("aupairgo_profile");
      if (stored) startTransition(() => setProfile(JSON.parse(stored)));
    } catch {
      // ignore
    }
  }, []);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-800 transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">
          {section.icon} {section.title}
        </span>
      </div>

      {/* Section Header */}
      <div
        className={`rounded-2xl border-2 p-5 mb-6 ${section.color}`}
      >
        <div className="flex items-start gap-3">
          <span className="text-4xl">{section.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{section.title}</h1>
            <p className="text-gray-600 mt-1">{section.description}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "chat"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          🤖 Chat IA
        </button>
        <button
          onClick={() => setActiveTab("content")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "content"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          📖 Guía & Contenido
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === "chat" ? (
            <div className="h-[600px] flex flex-col">
              <Chat sectionId={section.id} sectionTitle={section.title} />
            </div>
          ) : (
            <SectionContent sectionId={section.id} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <FreemiumCounter />
          <Profile />
          <LocationRecommendations sectionId={section.id} profile={profile} />
        </div>
      </div>
    </div>
  );
}
