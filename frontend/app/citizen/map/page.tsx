"use client";

import dynamic from "next/dynamic";

const FullRiskMap = dynamic(() => import("@/components/FullRiskMap"), { ssr: false });

export default function MapPage() {
    return <FullRiskMap />;
}
