// OperationalViz.jsx - Rich, Interactive Operational Dashboard

'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Activity, TrendingUp, TrendingDown, Clock, Settings, Zap, 
    Shield, MapPin, Loader2, Target, Users, Factory, Layers, AlertTriangle, X // Added AlertTriangle and X for HealthIndicator
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';

// --- Configuration ---
const API_BASE_URL = 'http://localhost:8000/api/viz';

// --- Utility Components (Polished ShadCN/UI Style) ---
const Card = ({ children, className = '' }) => (<div className={`bg-white rounded-xl shadow-lg border border-slate-100/70 transition-all ${className}`}>{children}</div>);
const CardHeader = ({ title, icon: Icon, className = '' }) => (
    <div className={`p-4 border-b border-slate-100 flex items-center gap-3 ${className}`}>
        <Icon className="h-5 w-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
    </div>
);
const CardContent = ({ children, className = '' }) => (<div className={`p-4 ${className}`}>{children}</div>);

// --- KPI Card Component ---
const KPICard = ({ name, value, unit, trend, target }) => {
    const isGood = (trend === 'up' && value >= target) || (trend === 'down' && value <= target);
    const trendIcon = trend === 'up' ? TrendingUp : TrendingDown;
    const trendClass = isGood ? 'text-green-600' : 'text-red-600';

    return (
        <Card className="p-5">
            <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-slate-500">{name}</p>
                <Target className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-4xl font-extrabold text-slate-800 mt-1 flex items-baseline">
                {value}
                <span className="text-lg font-medium text-slate-500 ml-1">{unit}</span>
            </p>
            <div className={`flex items-center text-sm font-semibold mt-3 ${trendClass}`}>
                <span className="flex items-center gap-1">
                    <span className="text-slate-500 mr-2">Target: {target}{unit === '%' ? '' : ' ' + unit}</span>
                    <span className='px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 flex items-center gap-1'>
                        <span className='text-xs font-normal text-slate-600 capitalize'>{trend}</span>
                        <span className={trendClass}>
                            <trendIcon className="h-4 w-4" />
                        </span>
                    </span>
                </span> {/* <-- THIS WAS THE MISSING CLOSING SPAN TAG */}
            </div>
        </Card>
    );
};

// --- Asset Health Indicator ---
const HealthIndicator = ({ asset, score, status, runtime }) => {
    let color = 'bg-green-500';
    let ring = 'ring-green-300';
    // let icon = Zap; // Zap is only used visually, not rendered

    if (status === 'Warning') {
        color = 'bg-yellow-500';
        ring = 'ring-yellow-300';
        // icon = AlertTriangle;
    } else if (status === 'Critical') {
        color = 'bg-red-500';
        ring = 'ring-red-300';
        // icon = X;
    }

    return (
        <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors px-2 rounded-lg">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${color} ring-2 ${ring} animate-pulse`}></div>
                <p className="text-sm font-medium text-slate-700">{asset}</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
                <p className={`font-semibold ${status === 'Optimal' ? 'text-green-600' : status === 'Warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {score}%
                </p>
                <p className="text-slate-500 text-xs flex items-center gap-1">
                    <Clock className='h-3 w-3'/> {runtime} hrs
                </p>
            </div>
        </div>
    );
};


// --- Main Component ---
export default function OperationalViz() {
    const [dashboardData, setDashboardData] = useState({ kpis: [], production_series: [], asset_health: [] });
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setApiError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/dashboard/summary`);
                if (!response.ok) {
                    throw new Error("Failed to fetch dashboard summary.");
                }
                const data = await response.json();
                setDashboardData(data);
            } catch (e) {
                console.error("API Error:", e);
                setApiError("Could not load operational data. Check the FastAPI server.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Set up refresh interval (e.g., every 30 seconds for real-time feel)
        const interval = setInterval(fetchData, 30000); 
        return () => clearInterval(interval);

    }, []);

    // --- Render Component ---
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                <p className="ml-3 text-lg text-indigo-600 font-medium">Loading real-time dashboards...</p>
            </div>
        );
    }

    if (apiError) {
         return (
             <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg m-10 max-w-7xl mx-auto">
                <h2 className="text-xl font-bold mb-2">API Connection Error</h2>
                <p>{apiError}</p>
            </div>
        );
    }
    
    // Process production data for chart labels
    const productionChartData = dashboardData.production_series.map(d => ({
        ...d,
        timestamp: d.timestamp.split(':')[0] // Use hour for simpler X-axis
    }));

    // Process asset health for the Bar Chart (Health Score)
    const assetChartData = dashboardData.asset_health.map(a => ({
        name: a.asset_id,
        score: a.health_score,
        runtime: a.runtime_hours
    }));


    return (
        <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
            
            {/* --- Header --- */}
            <header className="max-w-7xl mx-auto mb-10">
                <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-4">
                    <Activity className="h-9 w-9 text-indigo-600" /> Operational Visualization Dashboard
                </h1>
                <p className="text-lg text-slate-500 mt-1">Real-time data monitoring for production, safety, and asset health.</p>
            </header>
            
            {/* --- 1. KPI Tracking (Custom Dashboards) --- */}
            <div className="max-w-7xl mx-auto mb-12">
                <h2 className="text-xl font-bold text-slate-700 mb-5 flex items-center gap-2">
                    <Target className="h-5 w-5 text-indigo-500" /> Key Performance Indicators (Real-Time)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {dashboardData.kpis.map((kpi, index) => (
                        <KPICard key={index} {...kpi} />
                    ))}
                </div>
            </div>

            {/* --- 2. Production & Asset Health Charts --- */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                
                {/* Production Timeseries Chart (Col 1 & 2) */}
                <Card className='lg:col-span-2'>
                    <CardHeader title="24-Hour Production Throughput" icon={Factory} />
                    <CardContent className='h-[400px]'>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={productionChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="timestamp" label={{ value: 'Hour of Day (24h)', position: 'bottom', offset: 0 }} stroke="#94a3b8" />
                                <YAxis unit="t" stroke="#94a3b8" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                    labelFormatter={(label) => `Hour: ${label}:00`}
                                    formatter={(value, name, props) => [`${value}t`, 'Tonnage']}
                                />
                                <Line type="monotone" dataKey="tonnage" stroke="#4f46e5" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                
                {/* Asset Health Panel (Col 3) */}
                <Card>
                    <CardHeader title="Critical Asset Health Status" icon={Settings} />
                    <CardContent>
                        <div className="divide-y divide-slate-100">
                            {dashboardData.asset_health.map((asset, index) => (
                                <HealthIndicator 
                                    key={index} 
                                    asset={asset.asset_id} 
                                    score={asset.health_score} 
                                    status={asset.status}
                                    runtime={asset.runtime_hours}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* --- 3. Deeper Dive: Asset Health Scores --- */}
            <div className="max-w-7xl mx-auto">
                <Card>
                    <CardHeader title="Comparative Asset Health Score" icon={Layers} />
                    <CardContent className='h-[350px]'>
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={assetChartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis unit="%" domain={[0, 100]} stroke="#94a3b8" />
                                <Tooltip 
                                    formatter={(value, name, props) => [`${value}%`, 'Health Score']}
                                    labelFormatter={(label) => `Asset: ${label}`}
                                />
                                <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            
        </div>
    );
}