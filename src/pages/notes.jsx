import React, { useState, useEffect, useRef, } from 'react';
import { Music, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const MusicStaffDragDrop = () => {

  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [timeSignature, setTimeSignature] = useState('2/4');
  const [measures, setMeasures] = useState([
    { id: 1, notes: [] },
    { id: 2, notes: [] },
    { id: 3, notes: [] }
  ]);
  const [draggedNote, setDraggedNote] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const intervalRef = useRef(null);
const dragPreviewRef = useRef(null);
const [touchDragging, setTouchDragging] = useState(false);
  const levels = [
    { id: 1, name: 'Stage 1 - Level 1', timeSignature: '2/4' },
    { id: 2, name: 'Stage 1 - Level 1', timeSignature: '3/4' },
    { id: 3, name: 'Stage 1 - Level 1', timeSignature: '4/4' },
    { id: 4, name: 'Stage 1 - Level 2', timeSignature: '6/8' }
  ];

  const availableNotes = [
    { id: 'quarter', symbol: '♩', name: '', beats: 1, type: 'note' },
    { id: 'half', symbol: '𝅗𝅥', name: '', beats: 2, type: 'note' },
    { id: 'whole', symbol: '𝅝', name: '', beats: 4, type: 'note' },
    { id: 'eighth', symbol: '♪', name: '', beats: 0.5, type: 'note' },
    { id: 'sixteenth', symbol: '𝅘𝅥𝅯', name: '', beats: 0.25, type: 'note' },
    { id: 'quarter-rest', symbol: '𝄽', name: '', beats: 1, type: 'rest' },
    { id: 'half-rest', symbol: '𝄼', name: '', beats: 2, type: 'rest' },
    { id: 'whole-rest', symbol: '𝄻', name: '', beats: 4, type: 'rest' },
    { id: 'eighth-rest', symbol: '𝄾', name: '', beats: 0.5, type: 'rest' },
    { id: 'sixteenth-rest', symbol: '𝄿', name: '', beats: 0.25, type: 'rest' },

  ];

  const getBeatsPerMeasure = () => {
    return parseInt(timeSignature.split('/')[0]);
  };
// 📱 Mobile Drag Support
const handleTouchStart = (e, note) => {
  e.preventDefault();
  setDraggedNote(note);
  setTouchDragging(true);

  // Disable scroll while dragging
  document.body.style.overflow = 'hidden';

  const touch = e.touches[0];
  const preview = document.createElement('div');
  preview.textContent = note.symbol;
  preview.style.position = 'fixed';
  preview.style.left = `${touch.clientX - 25}px`;
  preview.style.top = `${touch.clientY - 25}px`;
  preview.style.fontSize = '50px';
  preview.style.pointerEvents = 'none';
  preview.style.zIndex = 9999;
  preview.style.userSelect = 'none';
  document.body.appendChild(preview);
  dragPreviewRef.current = preview;
};

const handleTouchMove = (e) => {
  if (!touchDragging || !dragPreviewRef.current) return;
  e.preventDefault();

  const touch = e.touches[0];
  dragPreviewRef.current.style.left = `${touch.clientX - 25}px`;
  dragPreviewRef.current.style.top = `${touch.clientY - 25}px`;
};

const handleTouchEnd = (e) => {
  if (!touchDragging || !draggedNote) return;
  e.preventDefault();

  const touch = e.changedTouches[0];
  let target = document.elementFromPoint(touch.clientX, touch.clientY);
  
  // Search up the DOM tree to find element with data-measure-id
  while (target && !target.dataset.measureId) {
    target = target.parentElement;
  }

  if (target && target.dataset.measureId) {
    const measureId = parseInt(target.dataset.measureId);
    const measureRect = target.getBoundingClientRect();
    const dropX = touch.clientX - measureRect.left;

    const measure = measures.find(m => m.id === measureId);
    const beatsPerMeasure = getBeatsPerMeasure();
    const currentBeats = measure.notes.reduce((sum, n) => sum + n.beats, 0);

    if (currentBeats + draggedNote.beats <= beatsPerMeasure) {
      setMeasures(prev => prev.map(m => {
        // Remove note from any measure if it has a uniqueId
        if (draggedNote.uniqueId) {
          const filtered = m.notes.filter(n => n.uniqueId !== draggedNote.uniqueId);
          
          // Add to target measure
          if (m.id === measureId) {
            return {
              ...m,
              notes: [...filtered, {
                ...draggedNote,
                uniqueId: Date.now() + Math.random(),
                positionX: dropX
              }]
            };
          }
          
          // Just remove from other measures
          return { ...m, notes: filtered };
        }
        
        // New note from palette - just add to target measure
        if (m.id === measureId) {
          return {
            ...m,
            notes: [...m.notes, {
              ...draggedNote,
              uniqueId: Date.now() + Math.random(),
              positionX: dropX
            }]
          };
        }
        
        return m;
      }));
    }
  }

  // Cleanup
  if (dragPreviewRef.current) {
    document.body.removeChild(dragPreviewRef.current);
    dragPreviewRef.current = null;
  }
  document.body.style.overflow = ''; // Re-enable scroll
  setDraggedNote(null);
  setTouchDragging(false);
};
  // Update time signature when level changes
  useEffect(() => {
    const level = levels.find(l => l.id === currentLevel);
    if (level) {
      setTimeSignature(level.timeSignature);
    }
  }, [currentLevel]);

  // Audio setup and cleanup
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Stop music when time signature changes
  useEffect(() => {
    if (isMusicPlaying) {
      setIsMusicPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [timeSignature]);

  // ✅ AUTO PROCEED TO NEXT LEVEL WHEN ALL MEASURES ARE FULL
  useEffect(() => {
    const beatsPerMeasure = getBeatsPerMeasure();
    const allFull = measures.every(
      (m) => m.notes.reduce((sum, n) => sum + n.beats, 0) === beatsPerMeasure
    );

    if (allFull) {
      setTimeout(() => {
        if (currentLevel < levels.length) {
          alert(`🎵 All measures complete! Proceeding to ${levels[currentLevel].name}...`);
          setCurrentLevel(currentLevel + 1);
          setMeasures([
            { id: 1, notes: [] },
            { id: 2, notes: [] },
            { id: 3, notes: [] }
          ]);
        } else {
          alert('🎉 Congratulations! You completed all levels! proceed to stage 2');
          navigate('/level2')

        }
      }, 800);
    }
  }, [measures]);

  // --- YOUR EXISTING CODE BELOW (UNCHANGED) ---
  const playPianoNote = (time, frequency, duration = 0.5) => {
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(frequency, time);
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
    osc.start(time);
    osc.stop(time + duration);
  };

  const playViolinNote = (time, frequency, duration = 0.8) => {
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(frequency, time);
    osc2.frequency.setValueAtTime(frequency * 2.01, time);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.15, time + 0.05);
    gain.gain.linearRampToValueAtTime(0.12, time + duration - 0.1);
    gain.gain.linearRampToValueAtTime(0, time + duration);
    osc.start(time);
    osc2.start(time);
    osc.stop(time + duration);
    osc2.stop(time + duration);
  };

  const playDrumBeat = (time, isAccent) => {
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (isAccent) {
      osc.frequency.setValueAtTime(100, time);
      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    } else {
      osc.frequency.setValueAtTime(200, time);
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
    }
    osc.start(time);
    osc.stop(time + 0.1);
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setIsMusicPlaying(false);
    } else {
      const beatsPerMeasure = getBeatsPerMeasure();
      const bpm = timeSignature === '6/8' ? 90 : 120;
      const beatDuration = 60 / bpm;
      let beatCount = 0;
      
      // Chord progressions for different time signatures
      const chordProgressions = {
        '2/4': [
          [262, 330, 392], // C major
          [294, 370, 440]  // D minor
        ],
        '3/4': [
          [262, 330, 392], // C major
          [220, 277, 330], // A minor
          [294, 370, 440]  // D minor
        ],
        '4/4': [
          [262, 330, 392], // C major
          [220, 277, 330], // A minor
          [349, 440, 523], // F major
          [294, 370, 440]  // G major
        ],
        '6/8': [
          [262, 330, 392], // C major
          [220, 277, 330], // A minor
          [294, 370, 440], // D minor
          [262, 330, 392]  // C major
        ]
      };
      
      // Melody notes for violin
      const melodies = {
        '2/4': [523, 587],
        '3/4': [523, 587, 659],
        '4/4': [523, 587, 659, 698],
        '6/8': [523, 587, 659, 698, 784, 880]
      };
      
      const chords = chordProgressions[timeSignature];
      const melody = melodies[timeSignature];
      
      setIsMusicPlaying(true);
      
      const playBeat = () => {
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const currentTime = ctx.currentTime;
        const isAccent = beatCount % beatsPerMeasure === 0;
        
        // Play drum beat
        playDrumBeat(currentTime, isAccent);
        
        // Play piano chord on accent beats
        if (isAccent) {
          const chordIndex = Math.floor(beatCount / beatsPerMeasure) % chords.length;
          const chord = chords[chordIndex];
          chord.forEach(freq => {
            playPianoNote(currentTime, freq, beatDuration * beatsPerMeasure * 0.9);
          });
        }
        
        // Play violin melody
        const melodyIndex = beatCount % melody.length;
        playViolinNote(currentTime, melody[melodyIndex], beatDuration * 0.8);
        
        beatCount++;
      };
      
      playBeat();
      intervalRef.current = setInterval(playBeat, beatDuration * 1000);
    }
  };

  const handleDragStart = (e, note) => {
    setDraggedNote(note);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e, measureId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedNote) return;

    const measure = measures.find(m => m.id === measureId);
    const beatsPerMeasure = getBeatsPerMeasure();
    const currentBeats = measure.notes.reduce((sum, note) => sum + note.beats, 0);

    if (currentBeats + draggedNote.beats <= beatsPerMeasure) {
      const measureRect = e.currentTarget.getBoundingClientRect();
      const dropX = e.clientX - measureRect.left;
      
      setMeasures(prev => prev.map(m => {
        if (m.id === measureId) {
          return { 
            ...m, 
            notes: [...m.notes, { 
              ...draggedNote, 
              uniqueId: Date.now() + Math.random(),
              positionX: dropX
            }] 
          };
        }
        return m;
      }));
    }
    setDraggedNote(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const removeNote = (measureId, noteIndex) => {
    setMeasures(prev => prev.map(m => {
      if (m.id === measureId) {
        return { ...m, notes: m.notes.filter((_, i) => i !== noteIndex) };
      }
      return m;
    }));
  };

  const reset = () => {
    setMeasures([
      { id: 1, notes: [] },
      { id: 2, notes: [] },
      { id: 3, notes: [] }
    ]);
  };

  const nextLevel = () => {
    if (currentLevel < levels.length) {
      setCurrentLevel(currentLevel + 1);
      reset();
    }
  };

  const prevLevel = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
      reset();
    }
  };

  const renderNotesWithBeams = (notes) => {
    const groups = [];
    let currentGroup = [];

    notes.forEach((note, index) => {
      if ((note.id === 'quarter') && note.type === 'note') {
        if (currentGroup.length > 0) {
          const lastNote = currentGroup[currentGroup.length - 1].note;
          if (lastNote.id === note.id) {
            currentGroup.push({ note, index });
          } else {
            if (currentGroup.length >= 2) {
              groups.push([...currentGroup]);
            } else {
              groups.push(currentGroup);
            }
            currentGroup = [{ note, index }];
          }
        } else {
          currentGroup.push({ note, index });
        }
      } else {
        if (currentGroup.length >= 2) {
          groups.push([...currentGroup]);
        } else if (currentGroup.length === 1) {
          groups.push(currentGroup);
        }
        currentGroup = [];
        groups.push([{ note, index }]);
      }
    });

    if (currentGroup.length >= 2) {
      groups.push(currentGroup);
    } else if (currentGroup.length === 1) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const currentLevelData = levels.find(level => level.id === currentLevel);

  return (
    <div className="min-h-screen bg-violet-500 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-white">Rhythmix - Master</h1>
          </div>
          <p className="text-white text-lg">Drag notes and rests onto the staff</p>
        </div>

        {/* Level and Time Signature Selector */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Level:</label>
                <div className="flex items-center gap-2">
                 
                  <span className="px-4 py-2 bg-purple-100 rounded-lg font-bold text-purple-700 min-w-[100px]">
                    {currentLevelData?.name} - {currentLevelData?.timeSignature}
                  </span>

                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Time Signature:</label>
<span className="px-4 py-2 border-2 border-purple-300 rounded-lg text-lg font-bold bg-white text-gray-800 inline-block">
  {timeSignature}
</span>

              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={toggleMusic}
                className={`flex items-center gap-2 ${isMusicPlaying ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-3 rounded-lg font-semibold transition-colors`}
              >
                {isMusicPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                {isMusicPlaying ? 'Stop Music' : 'Play Music'}
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Music Staff */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border-4 border-purple-200">
          <div className="relative">
            {/* Treble Clef */}
            <div className="absolute left-10 top-[-50px] text-[100px] select-none">𝄞</div>
            
            {/* Staff Lines */}
            <div className="ml-10 relative">
              {[0, 1, 2, 3, 4].map((line) => (
                <div
                  key={line}
                  className="h-0 border-t-2 border-gray-800"
                  style={{ marginBottom: line === 4 ? '0' : '16px' }}
                />
              ))}

              {/* Measures */}
              <div className="absolute top-0 left-0 right-0 flex" style={{ height: '80px' }}>
                {measures.map((measure, measureIndex) => {
                  const noteGroups = renderNotesWithBeams(measure.notes);
                  
                  return (
                    <div
  key={measure.id}
  data-measure-id={measure.id} // ✅ Added so touch drop works
  className={`flex-1 border-r-2 border-gray-800 relative`}
  style={{ borderLeft: measureIndex === 0 ? '2px solid #1f2937' : 'none' }}
  onDragOver={handleDragOver}
  onDrop={(e) => handleDrop(e, measure.id)}
                    >
                      {/* Render notes */}
                      <div className="absolute inset-0">
                        {measure.notes.length === 0 ? (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm select-none"></div>
                        ) : (
                          noteGroups.map((group, groupIndex) => {
                            if (group.length >= 2 && (group[0].note.id === 'eighth' || group[0].note.id === 'quarter' || group[0].note.id === 'half')) {
                              const positions = group.map(g => g.note.positionX);
                              const minPos = Math.min(...positions);
                              const maxPos = Math.max(...positions);
                              
                              return (
                                <div key={groupIndex}>
                                  <div 
                                    className="absolute bg-gray-900"
                                    style={{
                                      height: '10px',
                                      width: `${maxPos - minPos + 4}px`,
                                      top: '0px',
                                      left: `${minPos - 4}px`
                                    }}
                                  />
                                  {group.map(({ note, index }) => (
                                    <div
                                      key={note.uniqueId}
                                      onClick={() => removeNote(measure.id, index)}
                                      className="cursor-pointer hover:opacity-70 transition-opacity absolute"
                                      style={{ 
                                        left: `${note.positionX - 25}px`,
                                        top: '32px'
                                      }}
                                    >
                                      <div className="text-[90px] select-none" style={{ lineHeight: '1', position: 'absolute', top: '-50px' }}>
                                        {note.symbol}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              );
                            } else {
                              return group.map(({ note, index }) => {
                                const isWholeOrHalfRest = note.id === 'whole-rest' || note.id === 'half-rest' || note.id === 'eighth-rest';
                                return (
                                  <div
                                    key={note.uniqueId}
                                    onClick={() => removeNote(measure.id, index)}
                                    className="cursor-pointer hover:opacity-70 transition-opacity absolute"
                                    style={{ 
                                      left: `${note.positionX - 25}px`,
                                      top: '20px'
                                    }}
                                  >
                                    <div className="text-[90px] select-none" style={{ lineHeight: '1', position: 'absolute', top: isWholeOrHalfRest ? '-25px' : '-40px' }}>
                                      {note.symbol}
                                    </div>
                                  </div>
                                );
                              });
                            }
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Available Notes */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Drag notes and rests</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {availableNotes.map((note) => (
              <div
                key={note.id}
                draggable

                onTouchStart={(e) => handleTouchStart(e, note)}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}

                onDragStart={(e) => handleDragStart(e, note)}
                className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 cursor-move hover:shadow-lg hover:scale-105 transition-all w-24 text-center select-none"
              >
                <div className="text-5xl mb-2">{note.symbol}</div>
                <div className="text-xs font-semibold text-gray-700">{note.name}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MusicStaffDragDrop;