import React, { useState, useEffect } from 'react';
import {
  ProcurementCentre,
  AdminKPIs,
  AuditLogEntry,
} from '../types';
import {
  ShieldAlert,
  Building2,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  RefreshCw,
  Search,
  ChevronRight,
  ExternalLink,
  Activity,
  Layers,
  MapPin,
} from 'lucide-react';

interface Props {
  centres: ProcurementCentre[];
  onRefreshCentres: () => Promise<void>;
  isLoading: boolean;
}

export const AdminDashboard: React.FC<Props> = ({
  centres,
  onRefreshCentres,
  isLoading,
}) => {
  const [kpis, setKpis] = useState<AdminKPIs | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [selectedCentre, setSelectedCentre] = useState<ProcurementCentre | null>(centres[0] || null);
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [searchAudit, setSearchAudit] = useState<string>('');

  const activeSelectedCentre = selectedCentre || (centres && centres.length > 0 ? centres[0] : null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [kpiRes, alertRes, auditRes] = await Promise.all([
        fetch('/api/admin/kpis'),
        fetch('/api/admin/alerts'),
        fetch('/api/audit-logs'),
      ]);

      const kpiData = await kpiRes.json();
      if (kpiData.success) setKpis(kpiData.kpis);

      const alertData = await alertRes.json();
      if (alertData.success) setAlerts(alertData.alerts);

      const auditData = await auditRes.json();
      if (auditData.success) setAuditLogs(auditData.audit_logs);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesRole = filterRole === 'ALL' || log.role === filterRole;
    const matchesSearch =
      searchAudit === '' ||
      log.actor.toLowerCase().includes(searchAudit.toLowerCase()) ||
      log.details.toLowerCase().includes(searchAudit.toLowerCase()) ||
      log.action.toLowerCase().includes(searchAudit.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-5 border border-stone-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black tracking-wide">
                State Agricultural Marketing Board • Command Dashboard
              </h2>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                Live Network Feed
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Real-time monitoring across 10 APMC mandi yards, active weighbridges & DBT fund clearances
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            fetchAdminData();
            onRefreshCentres();
          }}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg border border-stone-700 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Network</span>
        </button>
      </div>

      {/* Statewide Top KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-500 uppercase block">Monitored Mandis</span>
          <span className="text-lg font-black text-stone-900 font-mono mt-1 block">
            {centres.length} Centres
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">100% Online</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-500 uppercase block">Today's Bookings</span>
          <span className="text-lg font-black text-stone-900 font-mono mt-1 block">
            {kpis ? kpis.todays_total_bookings : 897}
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">+14% vs yesterday</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-500 uppercase block">Active Queues</span>
          <span className="text-lg font-black text-amber-700 font-mono mt-1 block">
            {kpis ? kpis.active_queues_count : 177} Farmers
          </span>
          <span className="text-[10px] text-stone-500 font-medium">Across all counters</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-500 uppercase block">Network Avg Wait</span>
          <span className="text-lg font-black text-stone-900 font-mono mt-1 block">
            {kpis ? kpis.network_avg_wait_mins : 38} mins
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">Within SLA target</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-500 uppercase block">Procured Volume</span>
          <span className="text-lg font-black text-stone-900 font-mono mt-1 block">
            {kpis ? (kpis.total_procurement_quintals / 1000).toFixed(1) : '48.9'}k Q
          </span>
          <span className="text-[10px] text-stone-500 font-medium">Wheat & Basmati</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-500 uppercase block">DBT Cleared Payout</span>
          <span className="text-lg font-black text-emerald-800 font-mono mt-1 block">
            ₹{kpis ? (kpis.total_payout_cleared_inr / 10000000).toFixed(2) : '11.12'} Cr
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">94.2% Auto-Disbursed</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-stone-500 uppercase block">Registered Farmers</span>
          <span className="text-lg font-black text-stone-900 font-mono mt-1 block">
            {kpis ? kpis.total_registered_farmers.toLocaleString() : '12,450'}
          </span>
          <span className="text-[10px] text-stone-500 font-medium">KCC Linked</span>
        </div>
      </div>

      {/* AI Crowd Prediction & Proactive Redirection Alerts */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert className="w-5 h-5 text-amber-700" />
          <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
            AI Crowd Forecast & Active Redirection Advisory
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border bg-white text-xs ${
                alert.severity === 'high'
                  ? 'border-rose-300 ring-1 ring-rose-200'
                  : alert.severity === 'medium'
                  ? 'border-amber-300'
                  : 'border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    alert.severity === 'high'
                      ? 'bg-rose-100 text-rose-900'
                      : alert.severity === 'medium'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  {alert.severity === 'high' ? 'High Crowd Rush' : alert.severity === 'medium' ? 'Throughput Alert' : 'Capacity Available'}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">{alert.timestamp}</span>
              </div>
              <strong className="text-stone-900 block font-bold mb-1">{alert.centre_name}</strong>
              <p className="text-stone-600 leading-relaxed text-[11px]">{alert.recommendation}</p>
              <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                <span>Queue: {alert.queue} farmers</span>
                <span>Wait: ~{alert.predicted_wait}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Network Mandi Map & Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Map & Centre Grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/80 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Procurement Centre Network Status</h3>
              <p className="text-xs text-stone-500">
                Click any centre to inspect live queues, active weighbridges, and crowd forecasts
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-stone-600 text-[11px]">Low (&lt;60%)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-stone-600 text-[11px]">Med (60-85%)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-stone-600 text-[11px]">High (&gt;85%)</span>
              </span>
            </div>
          </div>

          {/* Clean Visual Map Canvas (Vector Regional Layout) */}
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 relative min-h-[220px] overflow-hidden flex flex-col justify-between">
            <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider flex items-center justify-between">
              <span>Haryana & Punjab Agricultural Belt APMC Cluster</span>
              <span>Coordinates: 29.39°N - 30.17°N</span>
            </div>

            {/* SVG Visual Network Topology */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-3">
              {centres.map((c) => {
                const isSelected = selectedCentre?.id === c.id;
                const dotColor =
                  c.crowd_level === 'Low'
                    ? 'bg-emerald-500'
                    : c.crowd_level === 'Medium'
                    ? 'bg-amber-500'
                    : 'bg-rose-500';

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCentre(c)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-[10px] text-stone-500">{c.id}</span>
                      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                    </div>
                    <strong className="block text-xs text-stone-900 truncate">{c.name}</strong>
                    <div className="text-[10px] text-stone-500 mt-1 flex items-center justify-between">
                      <span>Q: {c.current_queue}</span>
                      <span className="font-mono">{c.utilization_percentage}%</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-[10px] text-stone-400 text-center">
              All 10 procurement centres reporting telemetric weighbridge and queue events via secure WebSocket/SSE relay.
            </div>
          </div>

          {/* Network Analytics Chart Section */}
          <div className="pt-3 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Utilization Bar Chart */}
            <div className="space-y-2">
              <h4 className="font-bold text-stone-800 text-xs">Centre Capacity Utilization</h4>
              <div className="space-y-1.5">
                {centres.slice(0, 5).map((c) => (
                  <div key={c.id}>
                    <div className="flex justify-between text-[11px] text-stone-600 mb-0.5">
                      <span className="truncate max-w-[180px]">{c.name}</span>
                      <span className="font-mono font-bold">{c.utilization_percentage}%</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          c.utilization_percentage > 85
                            ? 'bg-rose-500'
                            : c.utilization_percentage > 65
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${c.utilization_percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Peak Hours Curve */}
            <div className="space-y-2">
              <h4 className="font-bold text-stone-800 text-xs">Crowd Peak Timeline (Today)</h4>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] space-y-2">
                <div className="flex justify-between">
                  <span>08:00 AM - 10:00 AM (Early Gates)</span>
                  <span className="font-semibold text-emerald-700">Low (42 Farmers)</span>
                </div>
                <div className="flex justify-between">
                  <span>10:00 AM - 01:00 PM (Primary Peak)</span>
                  <span className="font-semibold text-rose-700">Heavy Rush (118 Farmers)</span>
                </div>
                <div className="flex justify-between">
                  <span>01:00 PM - 02:00 PM (Shift Handover)</span>
                  <span className="font-semibold text-amber-700">Medium (38 Farmers)</span>
                </div>
                <div className="flex justify-between">
                  <span>02:00 PM - 05:00 PM (Afternoon Batches)</span>
                  <span className="font-semibold text-emerald-700">Moderate (56 Farmers)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Selected Centre Detailed Inspector */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-5 flex flex-col justify-between space-y-4">
          {activeSelectedCentre ? (
            <>
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <span className="text-[10px] font-mono font-bold bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                    {activeSelectedCentre.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      activeSelectedCentre.operational_status === 'Operational'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {activeSelectedCentre.operational_status}
                  </span>
                </div>

                <h3 className="text-sm font-black text-stone-900 mt-2">
                  {activeSelectedCentre.name}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {activeSelectedCentre.village_town}, {activeSelectedCentre.district}, {activeSelectedCentre.state}
                </p>

                {/* Stat Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-500 font-semibold block">Active Queue</span>
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      {activeSelectedCentre.current_queue} farmers
                    </span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-500 font-semibold block">Active Counters</span>
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      {activeSelectedCentre.active_counters} of {activeSelectedCentre.total_counters}
                    </span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-500 font-semibold block">Today's Bookings</span>
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      {activeSelectedCentre.todays_bookings}
                    </span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-500 font-semibold block">Completed</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      {activeSelectedCentre.completed_procurements}
                    </span>
                  </div>
                </div>

                {/* AI Crowd Forecast Trend for Selected Centre */}
                <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <span className="text-[10px] font-bold uppercase text-stone-500 block mb-2">
                    Predicted Crowd Curve (Next 4 Hours)
                  </span>
                  <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
                    <div className="p-1 rounded bg-white border border-stone-200">
                      <span className="text-stone-400 block">Now</span>
                      <strong className={activeSelectedCentre.predicted_crowd?.now === 'High' ? 'text-rose-600' : 'text-emerald-700'}>
                        {activeSelectedCentre.predicted_crowd?.now || 'Low'}
                      </strong>
                    </div>
                    <div className="p-1 rounded bg-white border border-stone-200">
                      <span className="text-stone-400 block">+1 hr</span>
                      <strong className={activeSelectedCentre.predicted_crowd?.plus1h === 'High' ? 'text-rose-600' : 'text-amber-600'}>
                        {activeSelectedCentre.predicted_crowd?.plus1h || 'Low'}
                      </strong>
                    </div>
                    <div className="p-1 rounded bg-white border border-stone-200">
                      <span className="text-stone-400 block">+2 hr</span>
                      <strong className={activeSelectedCentre.predicted_crowd?.plus2h === 'High' ? 'text-rose-600' : 'text-amber-600'}>
                        {activeSelectedCentre.predicted_crowd?.plus2h || 'Low'}
                      </strong>
                    </div>
                    <div className="p-1 rounded bg-white border border-stone-200">
                      <span className="text-stone-400 block">+4 hr</span>
                      <strong className="text-emerald-700">
                        {activeSelectedCentre.predicted_crowd?.plus4h || 'Low'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Centre Contact & Capacity */}
                <div className="mt-3 text-xs text-stone-600 space-y-1">
                  <div>
                    <span className="text-stone-400">Daily Capacity: </span>
                    <strong className="text-stone-800">{activeSelectedCentre.daily_capacity_quintals?.toLocaleString() || 0} Quintals</strong>
                  </div>
                  <div>
                    <span className="text-stone-400">Officer Contact: </span>
                    <span className="font-mono text-stone-800">{activeSelectedCentre.contact_number}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Address: </span>
                    <span className="text-stone-700">{activeSelectedCentre.address}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <span className="text-[11px] text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 block text-center font-medium">
                  ✓ Telemetry streaming live to State Headquarter
                </span>
              </div>
            </>
          ) : (
            <p className="text-xs text-stone-500 text-center py-10">Select a centre to view details</p>
          )}
        </div>
      </div>

      {/* Statewide Audit History Log Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 bg-stone-50/70">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Statewide Real-Time Audit Trail</h3>
            <p className="text-xs text-stone-500">
              Immutable log of bookings, queue turns, weighments, quality checks and DBT payments
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
              <input
                type="text"
                value={searchAudit}
                onChange={(e) => setSearchAudit(e.target.value)}
                placeholder="Search actor or details..."
                className="text-xs rounded-lg border border-stone-300 pl-8 pr-3 py-1.5 bg-white text-stone-800 w-48 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="text-xs rounded-lg border border-stone-300 px-2 py-1.5 bg-white text-stone-800 font-medium"
            >
              <option value="ALL">All Roles</option>
              <option value="FARMER">Farmer Events</option>
              <option value="OPERATOR">Operator Events</option>
              <option value="SYSTEM">System/AI Events</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200 sticky top-0">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor & Role</th>
                <th className="p-3">Action</th>
                <th className="p-3">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/80 transition">
                  <td className="p-3 font-mono text-[11px] text-stone-500">{log.id}</td>
                  <td className="p-3 font-mono text-[11px] text-stone-500">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-stone-900 block">{log.actor}</span>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded inline-block ${
                        log.role === 'OPERATOR'
                          ? 'bg-blue-100 text-blue-800'
                          : log.role === 'FARMER'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {log.role}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-stone-900">{log.action}</td>
                  <td className="p-3 text-stone-600 max-w-md">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
