/**
 * Interactive SVG USA Map with 5 color-coded regions.
 * Muted on-brand colors: navy, sage, slate, warm, steel.
 */

export type RegionName = "Northeast" | "Southeast" | "Midwest" | "Southwest" | "West";

export const REGION_COLORS: Record<RegionName, { fill: string; hover: string; selected: string; label: string }> = {
  Northeast: { fill: "#B8CCE0", hover: "#8FAFC8", selected: "#0055A4", label: "text-[#0055A4]" },
  Southeast: { fill: "#C2D9C4", hover: "#9BC49E", selected: "#3D7A40", label: "text-[#3D7A40]" },
  Midwest:   { fill: "#D4D0E0", hover: "#B5AFCC", selected: "#5B4F8A", label: "text-[#5B4F8A]" },
  Southwest: { fill: "#E8DCC8", hover: "#D4C4A0", selected: "#8B6F3A", label: "text-[#8B6F3A]" },
  West:      { fill: "#C8D4DC", hover: "#A3B8C8", selected: "#3A6080", label: "text-[#3A6080]" },
};

export const STATE_REGIONS: Record<string, RegionName> = {
  CT: "Northeast", ME: "Northeast", MA: "Northeast", NH: "Northeast",
  NJ: "Northeast", NY: "Northeast", PA: "Northeast", RI: "Northeast", VT: "Northeast",
  DE: "Southeast", FL: "Southeast", GA: "Southeast", KY: "Southeast", MD: "Southeast",
  NC: "Southeast", SC: "Southeast", TN: "Southeast", VA: "Southeast", WV: "Southeast",
  AR: "Southeast", LA: "Southeast", MS: "Southeast", AL: "Southeast",
  IL: "Midwest", IN: "Midwest", IA: "Midwest", KS: "Midwest", MI: "Midwest",
  MN: "Midwest", MO: "Midwest", NE: "Midwest", ND: "Midwest", OH: "Midwest",
  SD: "Midwest", WI: "Midwest",
  AZ: "Southwest", NM: "Southwest", OK: "Southwest", TX: "Southwest",
  AK: "West", CA: "West", CO: "West", HI: "West", ID: "West", MT: "West",
  NV: "West", OR: "West", UT: "West", WA: "West", WY: "West",
};

const STATE_PATHS: Record<string, string> = {
  AL: "M 580 370 L 600 370 L 605 430 L 590 440 L 575 435 L 570 400 Z",
  AK: "M 90 490 L 150 490 L 180 520 L 160 550 L 110 545 L 85 520 Z",
  AZ: "M 195 320 L 255 320 L 260 400 L 210 415 L 185 390 L 190 340 Z",
  AR: "M 540 330 L 590 330 L 590 370 L 540 375 L 530 355 Z",
  CA: "M 115 230 L 165 200 L 185 260 L 180 340 L 140 370 L 100 340 L 95 280 Z",
  CO: "M 280 270 L 370 265 L 375 325 L 285 330 Z",
  CT: "M 790 175 L 810 172 L 815 190 L 793 192 Z",
  DE: "M 775 215 L 790 212 L 793 232 L 776 233 Z",
  FL: "M 600 440 L 650 435 L 680 460 L 670 510 L 640 530 L 610 510 L 595 480 Z",
  GA: "M 610 370 L 660 365 L 665 430 L 640 445 L 605 430 Z",
  HI: "M 220 560 L 260 555 L 270 575 L 240 580 L 215 572 Z",
  ID: "M 185 130 L 235 115 L 250 185 L 230 230 L 195 230 L 180 185 Z",
  IL: "M 560 240 L 595 238 L 600 310 L 565 315 L 548 285 Z",
  IN: "M 600 238 L 635 235 L 638 300 L 602 305 Z",
  IA: "M 500 215 L 560 210 L 562 255 L 500 258 Z",
  KS: "M 390 295 L 490 290 L 492 335 L 390 338 Z",
  KY: "M 600 305 L 670 298 L 675 330 L 600 335 Z",
  LA: "M 520 400 L 570 395 L 575 435 L 545 450 L 515 435 Z",
  ME: "M 840 110 L 870 100 L 880 140 L 855 148 L 835 135 Z",
  MD: "M 745 230 L 790 225 L 793 245 L 748 250 Z",
  MA: "M 800 160 L 845 155 L 848 175 L 800 178 Z",
  MI: "M 600 170 L 640 155 L 660 195 L 630 210 L 600 200 Z",
  MN: "M 480 130 L 545 125 L 548 200 L 480 205 Z",
  MS: "M 560 370 L 590 368 L 595 430 L 565 435 L 552 410 Z",
  MO: "M 500 280 L 565 275 L 568 330 L 500 335 Z",
  MT: "M 200 100 L 340 95 L 345 170 L 200 175 Z",
  NE: "M 390 245 L 490 240 L 492 290 L 390 295 Z",
  NV: "M 145 215 L 195 205 L 200 310 L 155 325 L 135 280 Z",
  NH: "M 820 135 L 840 130 L 843 170 L 822 172 Z",
  NJ: "M 775 195 L 795 190 L 798 225 L 776 228 Z",
  NM: "M 255 325 L 330 320 L 335 400 L 260 405 Z",
  NY: "M 740 155 L 800 148 L 805 195 L 745 200 Z",
  NC: "M 660 320 L 755 310 L 758 345 L 660 350 Z",
  ND: "M 390 130 L 480 125 L 482 175 L 390 178 Z",
  OH: "M 638 230 L 685 225 L 688 295 L 638 300 Z",
  OK: "M 385 330 L 490 325 L 493 370 L 385 373 Z",
  OR: "M 115 155 L 200 145 L 205 215 L 115 220 Z",
  PA: "M 700 195 L 775 188 L 778 230 L 700 235 Z",
  RI: "M 818 175 L 828 173 L 830 188 L 818 190 Z",
  SC: "M 660 350 L 710 345 L 715 385 L 665 390 Z",
  SD: "M 390 175 L 480 170 L 482 215 L 390 220 Z",
  TN: "M 580 330 L 665 322 L 668 355 L 580 360 Z",
  TX: "M 335 330 L 490 325 L 495 430 L 420 470 L 340 455 L 325 400 Z",
  UT: "M 200 240 L 260 235 L 265 315 L 200 320 Z",
  VT: "M 800 135 L 820 130 L 822 168 L 800 170 Z",
  VA: "M 700 275 L 775 265 L 778 305 L 700 312 Z",
  WA: "M 115 100 L 200 95 L 202 148 L 115 152 Z",
  WV: "M 685 255 L 740 248 L 743 290 L 685 295 Z",
  WI: "M 545 165 L 600 158 L 602 215 L 545 220 Z",
  WY: "M 265 195 L 370 188 L 373 260 L 265 265 Z",
};

const STATE_LABELS: Record<string, [number, number]> = {
  AL: [588, 405], AK: [130, 520], AZ: [222, 368], AR: [560, 352], CA: [140, 285],
  CO: [328, 298], CT: [800, 182], DE: [783, 222], FL: [637, 480], GA: [635, 405],
  HI: [243, 568], ID: [213, 175], IL: [572, 278], IN: [618, 270], IA: [530, 235],
  KS: [440, 315], KY: [638, 318], LA: [545, 422], ME: [855, 125], MD: [768, 238],
  MA: [822, 167], MI: [628, 183], MN: [513, 165], MS: [573, 402], MO: [533, 308],
  MT: [272, 135], NE: [440, 268], NV: [168, 268], NH: [831, 152], NJ: [785, 208],
  NM: [295, 363], NY: [772, 173], NC: [708, 330], ND: [435, 152], OH: [662, 263],
  OK: [438, 350], OR: [158, 182], PA: [738, 213], RI: [824, 181], SC: [688, 368],
  SD: [435, 195], TN: [623, 343], TX: [413, 393], UT: [232, 278], VT: [811, 152],
  VA: [738, 290], WA: [158, 125], WV: [713, 272], WI: [572, 190], WY: [318, 228],
};

interface USAMapProps {
  selectedState: string | null;
  selectedRegion: string | null;
  onStateClick: (code: string) => void;
  onRegionClick: (region: RegionName) => void;
  schoolCounts?: Record<string, number>;
}

export default function USAMap({ selectedState, selectedRegion, onStateClick, onRegionClick, schoolCounts = {} }: USAMapProps) {
  return (
    <div className="w-full">
      {/* Region legend pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {(Object.keys(REGION_COLORS) as RegionName[]).map((region) => {
          const colors = REGION_COLORS[region];
          const isActive = selectedRegion === region;
          return (
            <button
              key={region}
              onClick={() => onRegionClick(region)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={{
                backgroundColor: isActive ? colors.selected : "white",
                borderColor: isActive ? colors.selected : "#e2e8f0",
                color: isActive ? "#fff" : "#475569",
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isActive ? "#fff" : colors.selected }} />
              {region}
            </button>
          );
        })}
        {(selectedState || selectedRegion) && (
          <button
            onClick={() => { onStateClick(""); onRegionClick("" as any); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500"
          >
            Clear
          </button>
        )}
      </div>
      {/* SVG Map */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-gray-100 bg-[#F8FAFB]">
        <svg
          viewBox="0 0 960 600"
          className="w-full h-auto"
          style={{ maxHeight: "440px" }}
          aria-label="Interactive US map by region"
        >
          <rect width="960" height="600" fill="#F1F5F8" rx="16" />
          {Object.entries(STATE_PATHS).map(([code, path]) => {
            const region = STATE_REGIONS[code];
            const colors = REGION_COLORS[region] || { fill: "#CBD5E1", hover: "#94A3B8", selected: "#475569" };
            const isSelected = selectedState === code;
            const isRegionSelected = selectedRegion === region;
            const isHighlighted = isSelected || isRegionSelected;
            const isDimmed = (selectedRegion && !isRegionSelected) || (selectedState && !isSelected && !isRegionSelected);
            return (
              <g key={code} className="cursor-pointer" onClick={() => onStateClick(code === selectedState ? "" : code)}>
                <title>{code}{schoolCounts[code] ? ` — ${schoolCounts[code]} schools` : ""}</title>
                <path
                  d={path}
                  fill={isSelected ? colors.selected : isRegionSelected ? colors.hover : colors.fill}
                  stroke={isHighlighted ? "#002855" : "#E2E8F0"}
                  strokeWidth={isHighlighted ? 2 : 0.8}
                  opacity={isDimmed ? 0.35 : 1}
                  className="transition-all duration-200"
                  style={{ filter: isSelected ? "drop-shadow(0 2px 6px rgba(0,40,85,0.25))" : undefined }}
                />
                {STATE_LABELS[code] && (
                  <text
                    x={STATE_LABELS[code][0]}
                    y={STATE_LABELS[code][1]}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={isSelected ? "11" : "9"}
                    fontWeight={isHighlighted ? "700" : "500"}
                    fill={isSelected ? "#fff" : isDimmed ? "#94A3B8" : "#334155"}
                    className="pointer-events-none select-none"
                  >
                    {code}
                  </text>
                )}
              </g>
            );
          })}
          <text x="130" y="580" textAnchor="middle" fontSize="8" fill="#94A3B8" className="select-none">Alaska</text>
          <text x="243" y="590" textAnchor="middle" fontSize="8" fill="#94A3B8" className="select-none">Hawaii</text>
        </svg>
      </div>
      {/* Selected state info bar */}
      {selectedState && (
        <div className="mt-3 flex items-center justify-between bg-[#002855] text-white rounded-xl px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold">{selectedState}</span>
            <span className="text-blue-200 text-sm">{STATE_REGIONS[selectedState]} Region</span>
            {schoolCounts[selectedState] > 0 && (
              <span className="bg-[#6EBE44] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {schoolCounts[selectedState]} schools
              </span>
            )}
          </div>
          <a
            href={`/state/${selectedState}`}
            className="text-sm bg-white text-[#002855] font-semibold px-4 py-1.5 rounded-full hover:bg-blue-50 transition-colors"
          >
            View State Hub
          </a>
        </div>
      )}
    </div>
  );
}
