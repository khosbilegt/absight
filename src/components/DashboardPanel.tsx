import React, { useState } from "react";
import { X, Edit3, Sparkles, Settings, BarChart3 } from "lucide-react";
import type { PanelData } from "./Dashboard";
import ChartComponent from "./ChartComponent";
import GenerateMode from "./GenerateMode";

interface DashboardPanelProps {
  panel: PanelData;
  onUpdate: (id: string, updates: Partial<PanelData>) => void;
  onRemove: (id: string) => void;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({
  panel,
  onUpdate,
  onRemove,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(panel.title);

  const handleModeSelect = (mode: "generate" | "manual") => {
    onUpdate(panel.id, { mode });
  };

  const handleGenerateComplete = (
    question: string,
    chartData: { name: string; value: number }[],
    chartType: "bar" | "line" | "area" | "pie"
  ) => {
    onUpdate(panel.id, {
      title:
        question.length > 40 ? question.substring(0, 37) + "..." : question,
      chartData,
      chartType,
      hasChart: true,
    });
  };

  const handleManualComplete = () => {
    // For now, just show a sample chart for manual mode
    const sampleData = [
      { name: "Category A", value: 400 },
      { name: "Category B", value: 300 },
      { name: "Category C", value: 600 },
      { name: "Category D", value: 800 },
    ];

    onUpdate(panel.id, {
      title: "Manual Chart",
      chartData: sampleData,
      chartType: "bar",
      hasChart: true,
    });
  };

  const handleTitleSave = () => {
    onUpdate(panel.id, { title: tempTitle });
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(panel.title);
    setIsEditingTitle(false);
  };

  const renderModeSelection = () => (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Choose Your Mode
        </h3>
        <p className="text-slate-500">
          How would you like to create your visualization?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
        <button
          onClick={() => handleModeSelect("generate")}
          className="group relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="text-blue-600 mb-4">
            <Sparkles className="w-8 h-8 mx-auto" />
          </div>
          <h4 className="font-semibold text-slate-800 mb-2">
            Generate with AI
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Describe what you want to visualize and let AI create the perfect
            chart
          </p>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300"></div>
        </button>

        <button
          onClick={() => handleModeSelect("manual")}
          className="group relative p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl hover:from-emerald-100 hover:to-teal-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="text-emerald-600 mb-4">
            <Settings className="w-8 h-8 mx-auto" />
          </div>
          <h4 className="font-semibold text-slate-800 mb-2">Manual Setup</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Configure your chart manually with full control over data and
            styling
          </p>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (panel.mode === "none") {
      return renderModeSelection();
    }

    if (panel.mode === "generate" && !panel.hasChart) {
      return (
        <div className="flex-1 p-6">
          <GenerateMode onComplete={handleGenerateComplete} />
        </div>
      );
    }

    if (panel.mode === "manual" && !panel.hasChart) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="text-center mb-8">
            <BarChart3 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Manual Mode
            </h3>
            <p className="text-slate-500 mb-6">Configure your chart manually</p>
            <button
              onClick={handleManualComplete}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create Sample Chart
            </button>
          </div>
        </div>
      );
    }

    if (panel.hasChart) {
      return (
        <div className="flex-1 p-6">
          <ChartComponent data={panel.chartData} type={panel.chartType} />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Panel Header */}
      <div className="flex items-center p-4 border-b border-slate-200/60 bg-slate-50/50">
        {/* Left Section - Title */}
        <div className="flex items-center flex-1 min-w-0">
          {isEditingTitle ? (
            <div className="flex items-center flex-1 gap-2">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSave();
                  if (e.key === "Escape") handleTitleCancel();
                }}
                autoFocus
              />
              <button
                onClick={handleTitleSave}
                className="px-3 py-2 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleTitleCancel}
                className="px-3 py-2 text-xs bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 truncate">
                {panel.title}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingTitle(true);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Center Section - Drag Handle */}
        <div className="drag-handle flex items-center justify-center px-4 py-2 cursor-move group">
          <div className="grid grid-cols-3 gap-1">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-slate-500 transition-colors duration-200"
              ></div>
            ))}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {panel.hasChart && (
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-200/60 rounded-full">
              <div
                className={`w-2 h-2 rounded-full ${
                  panel.mode === "generate" ? "bg-blue-500" : "bg-emerald-500"
                }`}
              ></div>
              <span className="text-xs font-medium text-slate-600 capitalize">
                {panel.mode}
              </span>
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(panel.id);
            }}
            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Panel Content */}
      <div onMouseDown={(e) => e.stopPropagation()}>{renderContent()}</div>
    </div>
  );
};

export default DashboardPanel;
