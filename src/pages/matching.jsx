import React, { useState, useRef, useEffect } from "react";
import { CheckCircle, XCircle, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function MatchingLevel1() {

  const navigate = useNavigate()
  const [selectedA, setSelectedA] = useState(null);
  const [selectedB, setSelectedB] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);

  const columnARefs = useRef({});
  const columnBRefs = useRef({});
  const svgRef = useRef(null);

  // 🎵 Column A: Notes or Rests
  const columnA = [
    { id: 1, symbol: "𝅝", value: "4" }, // Whole note
    { id: 2, symbol: "𝅗𝅥", value: "2" }, // Half note
    { id: 3, symbol: "♩", value: "1" }, // Quarter note
    { id: 4, symbol: "♪", value: "1/2" }, // Eighth note
    { id: 5, symbol: "𝄽", value: "1/4" }, // Sixteenth rest
  ];

  // 🎵 Column B: Values
  const columnB = [
    { id: "A", value: "1" },
    { id: "B", value: "1/2" },
    { id: "C", value: "1/4" },
    { id: "D", value: "2" },
    { id: "E", value: "4" },
  ];

  // 🎯 Selectors
  const handleSelectA = (item) => {
    if (matchedPairs.find((pair) => pair.a.id === item.id)) return;
    setSelectedA(item);
    setMessage("");
  };

  const handleSelectB = (item) => {
    if (matchedPairs.find((pair) => pair.b.id === item.id)) return;
    setSelectedB(item);
    setMessage("");
  };

  // ✅ Check for match
const congrats = () => {
navigate('/congratulations')
}
  useEffect(() => {
    if (selectedA && selectedB) {
      if (selectedA.value === selectedB.value) {
        setMatchedPairs((prev) => [...prev, { a: selectedA, b: selectedB }]);
        setScore((prev) => prev + 1);
        setMessage("✅ Correct Match!");
        if (score + 1 === 5) {
          setMessage("🏆 Level 1 Complete! Proceed to Level 2.");
          setLevelComplete(true);
        }
      } else {
        setMessage("❌ Wrong Match, Try Again!");
      }
      setSelectedA(null);
      setSelectedB(null);
    }
  }, [selectedA, selectedB]);

  const resetLevel = () => {
    setMatchedPairs([]);
    setSelectedA(null);
    setSelectedB(null);
    setMessage("");
    setScore(0);
    setLevelComplete(false);
  };

  // 🎨 Draw matching lines
  const [lines, setLines] = useState([]);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const newLines = matchedPairs.map(({ a, b }) => {
      const rectA = columnARefs.current[a.id]?.getBoundingClientRect();
      const rectB = columnBRefs.current[b.id]?.getBoundingClientRect();
      if (!rectA || !rectB) return null;

      const x1 = rectA.right + window.scrollX;
      const y1 = rectA.top + rectA.height / 2 + window.scrollY;
      const x2 = rectB.left + window.scrollX;
      const y2 = rectB.top + rectB.height / 2 + window.scrollY;
      return { x1, y1, x2, y2 };
    });
    setLines(newLines.filter(Boolean));
  }, [matchedPairs]);

  return (
    <div className="relative p-8 bg-violet-500 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-4">
        🎶 Stage 2 – Level 1: Match the Notes or Rests to Their Value
      </h1>
      <p className="text-white mb-8">Match 5 items by connecting pairs</p>

      {/* SVG Lines */}
      <svg
        ref={svgRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        {lines.map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#ec4899"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Columns */}
      <div className="grid grid-cols-2 gap-16 z-10">
        {/* Column A */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            Column A – Notes / Rests
          </h2>
          <div className="flex flex-col gap-4">
            {columnA.map((item) => {
              const matched = matchedPairs.find((pair) => pair.a.id === item.id);
              return (
                <button
                  key={item.id}
                  ref={(el) => (columnARefs.current[item.id] = el)}
                  onClick={() => handleSelectA(item)}
                  disabled={matched}
                  className={`text-6xl text-center rounded-lg py-2 transition-colors ${
                    matched
                      ? "bg-green-200 cursor-not-allowed"
                      : selectedA?.id === item.id
                      ? "bg-purple-300"
                      : "bg-white hover:bg-purple-100"
                  }`}
                >
                  {item.symbol}
                </button>
              );
            })}
          </div>
        </div>

        {/* Column B */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            Column B – Values
          </h2>
          <div className="flex flex-col gap-4">
            {columnB.map((item) => {
              const matched = matchedPairs.find((pair) => pair.b.id === item.id);
              return (
                <button
                  key={item.id}
                  ref={(el) => (columnBRefs.current[item.id] = el)}
                  onClick={() => handleSelectB(item)}
                  disabled={matched}
                  className={`text-3xl font-bold text-center rounded-lg py-3 transition-colors ${
                    matched
                      ? "bg-green-200 cursor-not-allowed"
                      : selectedB?.id === item.id
                      ? "bg-purple-300"
                      : "bg-white hover:bg-purple-100"
                  }`}
                >
                  {item.value}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="mt-8 flex items-center gap-3 text-lg font-semibold">
        {message.includes("✅") && <CheckCircle className="text-green-500" />}
        {message.includes("❌") && <XCircle className="text-red-500" />}
        {message.includes("🏆") && <Trophy className="text-yellow-500" />}
        <span>{message}</span>
      </div>

      {/* Score + Buttons */}
      <div className="mt-6 text-xl text-white">
        Score: <span className="font-bold text-white">{score}</span> / 5
      </div>

      {levelComplete && (
        <button
          onClick={() => alert("Proceeding to Level 2 (2/4 – 4/4 notes)!")}
          className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700"
        >
          Continue → Level 2
        </button>
      )}

      <button
        onClick={resetLevel}
        className="mt-4 text-white underline hover:text-purple-800"
      >
        Reset Level
      </button>
      
            <button
 onClick={congrats}
 className="mt-4 text-white border p-4 rounded-sm cursor-pointer bg-pink-500 hover:text-green-800"
      >
        Done!
      </button>
    </div>
  );
}
