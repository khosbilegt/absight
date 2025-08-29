import React, { useState } from "react";
import { Responsive, WidthProvider, type Layouts } from "react-grid-layout";
import { Plus } from "lucide-react";
import DashboardPanel from "./DashboardPanel.tsx";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface ChartData {
  name: string;
  value: number;
}

export interface PanelData {
  id: string;
  title: string;
  chartData: ChartData[];
  chartType: "bar" | "line" | "area" | "pie";
  mode: "none" | "generate" | "manual";
  hasChart: boolean;
}

const Dashboard: React.FC = () => {
  const [panels, setPanels] = useState<PanelData[]>([]);

  const [layouts, setLayouts] = useState<Layouts>({
    lg: [],
  });

  const addNewPanel = () => {
    const newId = `panel-${Date.now()}`;
    const newPanel: PanelData = {
      id: newId,
      title: "New Panel",
      chartData: [],
      chartType: "bar",
      mode: "none",
      hasChart: false,
    };

    setPanels((prev) => [...prev, newPanel]);

    setLayouts((prev) => ({
      ...prev,
      lg: [
        ...(prev.lg || []),
        {
          i: newId,
          x: ((prev.lg?.length || 0) * 6) % 12,
          y: Math.floor(((prev.lg?.length || 0) * 6) / 12) * 6,
          w: 6,
          h: 6,
        },
      ],
    }));
  };

  const updatePanel = (id: string, updates: Partial<PanelData>) => {
    setPanels((prev) =>
      prev.map((panel) => (panel.id === id ? { ...panel, ...updates } : panel))
    );
  };

  const removePanel = (id: string) => {
    setPanels((prev) => prev.filter((panel) => panel.id !== id));
    setLayouts((prev) => ({
      ...prev,
      lg: (prev.lg || []).filter((layout) => layout.i !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60">
        <div className="max-w-full px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Absight Dashboard
              </h1>
              <p className="text-slate-500 mt-1 font-medium">
                AI-powered data visualization platform
              </p>
            </div>
            <button
              onClick={addNewPanel}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Panel
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <main className="p-8">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          onLayoutChange={(_, layouts) => setLayouts(layouts)}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          margin={[20, 20]}
          isDraggable={true}
          isResizable={true}
          draggableHandle=".drag-handle"
        >
          {panels.map((panel) => (
            <div
              key={panel.id}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/60 overflow-hidden"
            >
              <DashboardPanel
                panel={panel}
                onUpdate={updatePanel}
                onRemove={removePanel}
              />
            </div>
          ))}
        </ResponsiveGridLayout>

        {panels.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl border border-slate-200/60">
              <div className="text-slate-300 mb-6">
                <Plus className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                Welcome to Absight
              </h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Create your first dashboard panel to start visualizing your data
                with AI-powered insights
              </p>
              <button
                onClick={addNewPanel}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
              >
                <Plus className="w-5 h-5 mr-3" />
                Create Your First Panel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
