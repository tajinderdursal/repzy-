"use client";

import StrengthChart from "@/components/StrengthChart";
import VolumeChart from "@/components/VolumeChart";
import { useEffect, useState } from "react";
import ReactCompareImage from "react-compare-image";
import { Trash2 } from "lucide-react";
import { useRef } from "react";


export default function Progress() {




  const [records, setRecords] = useState([]);
  const [exercise, setExercise] = useState("");
  const [progress, setProgress] = useState([]);
  const [volume, setVolume] = useState([]);

  const [photos, setPhotos] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [caption, setCaption] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const [showGraphs, setShowGraphs] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [showExercisePopup, setShowExercisePopup] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  // 🔥 LOAD PHOTOS
  const loadPhotos = async () => {
    const res = await fetch("/api/progress-photo");
    const data = await res.json();
    setPhotos(data);
  };



function CompareSlider({ left, right }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const ref = useRef(null);

  const move = (clientX) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const pct = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 2), 98);
    setPos(pct);
  };

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e) =>
      move("touches" in e ? e.touches[0].clientX : e.clientX);

    const stop = () => setDragging(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", stop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", stop);
    };
  }, [dragging]);

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden cursor-col-resize"
      onMouseDown={(e) => { setDragging(true); move(e.clientX); }}
      onTouchStart={(e) => { setDragging(true); move(e.touches[0].clientX); }}
    >
      <img src={right} className="absolute w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={left} className="h-full object-cover" />
      </div>

      <div
        className="absolute top-0 bottom-0 w-[2px] bg-blue-400"
        style={{ left: `${pos}%` }}
      />
    </div>
  );
}








  useEffect(() => {
    loadPhotos();
  }, []);

  const deletePhoto = async (id) => {
    await fetch(`/api/progress-photo/${id}`, { method: "DELETE" });
    loadPhotos();
  };

  const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);
    formData.append("isPublic", isPublic.toString());

    await fetch("/api/progress-photo", {
      method: "POST",
      body: formData
    });

    setPhoto(null);
    setCaption("");
    setIsPublic(false);
    loadPhotos();
  };

  // 🔥 RECORDS
  useEffect(() => {
    fetch("/api/workout/records")
      .then(res => res.json())
      .then(setRecords);
  }, []);

  // 🔥 PROGRESS
  useEffect(() => {
    if (!exercise) return;

    fetch(`/api/workout/progress?exercise=${exercise}`)
      .then(res => res.json())
      .then((data) => {

        // 🔥 FIX GRAPH LOGIC
        if (data.length === 0) {
          setProgress([]);
        } else if (data.length === 1) {
          setProgress([
            { date: "Start", weight: 0 },
            ...data
          ]);
        } else {
          setProgress(data);
        }

      });

  }, [exercise]);

  // 🔥 VOLUME
  useEffect(() => {
    fetch("/api/workout/volume")
      .then(res => res.json())
      .then(data => {
        const chartData = Object.keys(data).map(week => ({
          week,
          volume: data[week]
        }));
        setVolume(chartData);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-10 py-10 relative space-y-12">

      {/* 🔥 GLOW */}
      <div className="absolute w-[300px] h-[300px] bg-blue-500/20 blur-[120px] rounded-full top-10 left-10"></div>
      <div className="absolute w-[300px] h-[300px] bg-purple-500/20 blur-[120px] rounded-full bottom-10 right-10"></div>

      {/* 🏆 RECORDS */}
      <div >
        <h2 className="text-3xl font-bold mb-16 mt-30 ext-center">
          🏆 Personal Records
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {records.map(r => (
            <div
              key={r._id}
              className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-2xl text-center hover:scale-105 transition"
            >
              <p className="font-bold">{r._id}</p>
              <p className="text-2xl text-purple-400">
                {r.maxWeight} kg
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 📊 BUTTON */}
      <div className="text-center">
        <button
          onClick={() => setShowExercisePopup(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-full"
        >
          Show Graphs
        </button>
      </div>

      {/* POPUP */}
      {showExercisePopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-2xl w-[90%] max-w-md">

            <h2 className="text-xl mb-4 text-center">
              Select Exercise
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {records.map(r => (
                <button
                  key={r._id}
                  onClick={() => {
                    setSelectedExercise(r._id);
                    setExercise(r._id);
                    setShowExercisePopup(false);
                    setShowGraphs(true);
                  }}
                  className="bg-white/10 p-3 rounded hover:bg-purple-500"
                >
                  {r._id}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowExercisePopup(false)}
              className="mt-4 w-full bg-red-600 py-2 rounded"
            >
              Cancel
            </button>

          </div>

        </div>
      )}

      {/* 📈 GRAPHS */}
      {showGraphs && (
        <div className="space-y-8">

          {progress.length === 0 && (
            <p className="text-gray-400 text-center">
              Need more workouts to see graphs 📊
            </p>
          )}

          {progress.length > 0 && (
            <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-2xl">
              <StrengthChart data={progress} />
            </div>
          )}

          {volume.length > 0 && (
            <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-2xl">
              <VolumeChart data={volume} />
            </div>
          )}

        </div>
      )}
<div className="flex justify-center my-12">
  <div className="w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-gray-500/40 to-transparent" />
</div>
      {/* 📷 PHOTOS */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">
        Progress Photos
        </h2>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">

          {/* UPLOAD */}
         <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl break-inside-avoid space-y-3">

  {/* FILE INPUT */}
  <input
    type="file"
    id="upload"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files[0];
      if (!file) return;
      setPhoto(file);
    }}
  />

  {/* UPLOAD BOX */}
  <label htmlFor="upload" className="cursor-pointer">
    <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg text-white/60 hover:border-purple-400 transition">
      {photo ? "✔ Image Selected" : "+ Upload Photo"}
    </div>
  </label>

  {/* CAPTION */}
  <input
    placeholder="Add caption..."
    value={caption}
    onChange={(e) => setCaption(e.target.value)}
    className="w-full mt-2 px-3 py-2 bg-black/50 rounded-lg outline-none text-sm"
  />

  {/* 🔥 PUBLIC TOGGLE */}
  <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-lg border border-white/10">

    <span className="text-sm text-white/70">
      {isPublic ? "🌍 Public" : "🔒 Private"}
    </span>

    <button
      onClick={() => setIsPublic(!isPublic)}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
        isPublic ? "bg-green-500" : "bg-gray-600"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full transition ${
          isPublic ? "translate-x-6" : ""
        }`}
      />
    </button>
  </div>

  {/* UPLOAD BUTTON */}
  <button
    onClick={() => photo && uploadPhoto(photo)}
    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 py-2 rounded-lg font-semibold hover:scale-[1.02] transition"
  >
    Upload
  </button>

</div>

          {/* PHOTOS */}
          {photos.map(p => (
            <div key={p._id} className="relative group">

              <img src={p.image} className="rounded-xl" />

              <button
                onClick={() => deletePhoto(p._id)}
                className="absolute top-2 right-2 bg-black/70 p-2 rounded-full opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>

            </div>
          ))}

        </div>
      </div>

      {/* 🔥 COMPARE */}
      <div className="text-center">

        <button
          onClick={() => setShowCompare(!showCompare)}
         className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold hover:scale-[1.02] transition"
        >
          Compare Transformation
        </button>
     {showCompare && (
  <div className="mt-8 flex justify-center px-4">

    {photos.length < 2 ? (
      <p className="text-white/40 text-sm">
        Upload more photos to compare progress
      </p>
    ) : (
      <div className="relative w-full max-w-md sm:max-w-lg">

        {/* GRADIENT BORDER */}
        <div className="p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-green-500">

          {/* INNER CARD */}
          <div className="bg-[#0b0f14] rounded-2xl p-2 sm:p-3 backdrop-blur-xl border border-white/10 shadow-xl">

            {/* 🔥 NEW PREMIUM SLIDER */}
            <CompareSlider
              left={photos[0].image}
              right={photos[photos.length - 1].image}
            />

          </div>
        </div>

      </div>
    )}

  </div>
)}
        

      </div>

    </div>
  );
}

