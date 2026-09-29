import React, { useState, useEffect } from 'react';
import { Database, Table, Terminal, RefreshCw, CheckCircle2, Play, Code2 } from 'lucide-react';
import { NotificationRecord } from '../types';

interface Props {
  notifications: NotificationRecord[];
}

export const DatabaseInspector: React.FC<Props> = ({ notifications }) => {
  const [schemaData, setSchemaData] = useState<any>(null);
  const [activeTable, setActiveTable] = useState<'notifications' | 'appointments' | 'queue_state'>('notifications');
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM notifications ORDER BY created_timestamp DESC;');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const fetchSchema = async () => {
    try {
      const res = await fetch('/api/db/schema');
      const data = await res.json();
      setSchemaData(data);
    } catch (err) {
      console.error('Failed to fetch schema:', err);
    }
  };

  const handleRunQuery = async (queryToRun?: string) => {
    const q = queryToRun || sqlQuery;
    setIsExecuting(true);
    try {
      const res = await fetch('/api/db/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setQueryResult(data);
    } catch (err) {
      console.error('Query failed:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  useEffect(() => {
    fetchSchema();
    handleRunQuery();
  }, [notifications.length]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900">PostgreSQL Relational Storage & Schema Console</h2>
              <span className="text-[11px] font-mono font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                PostgreSQL 16 Compatible
              </span>
            </div>
            <p className="text-xs text-stone-500">Live inspection of permanent notification records and audit logs</p>
          </div>
        </div>

        <button
          onClick={() => {
            fetchSchema();
            handleRunQuery();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh DB</span>
        </button>
      </div>

      {/* SQL Table Selector */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        {(['notifications', 'appointments', 'queue_state'] as const).map((tbl) => (
          <button
            key={tbl}
            onClick={() => {
              setActiveTable(tbl);
              const q = `SELECT * FROM ${tbl};`;
              setSqlQuery(q);
              handleRunQuery(q);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${activeTable === tbl ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'}`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>public.{tbl}</span>
          </button>
        ))}
      </div>

      {/* Interactive SQL Query Box */}
      <div className="bg-stone-950 rounded-xl p-4 text-stone-200 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
          <span className="flex items-center gap-1.5 text-stone-400 text-[11px] font-bold">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" /> PostgreSQL Query Editor
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const q = 'SELECT * FROM notifications WHERE delivery_status = \'Delivered\';';
                setSqlQuery(q);
                handleRunQuery(q);
              }}
              className="text-[10px] text-stone-400 hover:text-amber-300 underline"
            >
              Filter Delivered
            </button>
            <button
              onClick={() => {
                const q = 'SELECT notification_type, delivery_status, COUNT(*) FROM notifications GROUP BY notification_type, delivery_status;';
                setSqlQuery(q);
                handleRunQuery(q);
              }}
              className="text-[10px] text-stone-400 hover:text-amber-300 underline"
            >
              Group Count
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <textarea
            rows={2}
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-stone-100 text-xs font-mono focus:outline-hidden focus:border-emerald-500 resize-none"
          />
          <button
            onClick={() => handleRunQuery()}
            disabled={isExecuting}
            className="px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-1 transition active:scale-95 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* Query Results / Table Data */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-stone-800">
            Query Results ({queryResult?.rowCount || notifications.length} Records)
          </h3>
          <span className="text-[11px] text-stone-400 font-mono">
            Table: public.{activeTable}
          </span>
        </div>

        <div className="border border-stone-200 rounded-xl overflow-x-auto max-h-[380px]">
          {activeTable === 'notifications' ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold sticky top-0">
                <tr>
                  <th className="p-2.5">notification_id</th>
                  <th className="p-2.5">farmer_id</th>
                  <th className="p-2.5">token_id</th>
                  <th className="p-2.5">notification_type</th>
                  <th className="p-2.5">message</th>
                  <th className="p-2.5">delivery_status</th>
                  <th className="p-2.5">read_status</th>
                  <th className="p-2.5">created_timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                {notifications.map((row) => (
                  <tr key={row.notification_id} className="hover:bg-stone-50/80">
                    <td className="p-2.5 text-stone-900 font-semibold">{row.notification_id}</td>
                    <td className="p-2.5 text-stone-600">{row.farmer_id}</td>
                    <td className="p-2.5 text-emerald-800 font-bold">{row.token_id}</td>
                    <td className="p-2.5 text-blue-700">{row.notification_type}</td>
                    <td className="p-2.5 font-sans text-xs text-stone-800 max-w-xs truncate" title={row.message}>
                      {row.message}
                    </td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${row.delivery_status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {row.delivery_status}
                      </span>
                    </td>
                    <td className="p-2.5 text-stone-600">{row.read_status}</td>
                    <td className="p-2.5 text-stone-500 whitespace-nowrap">{new Date(row.created_timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-xs text-stone-500 font-mono">
              <pre className="text-left bg-stone-50 p-3 rounded-lg overflow-x-auto text-[11px]">
                {JSON.stringify(queryResult?.rows || [], null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* PostgreSQL DDL Schema Reference (Prompt Spec 7) */}
      <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-stone-600" />
            PostgreSQL DDL Definition for <code className="font-mono text-emerald-800">notifications</code>
          </span>
          <span className="text-[11px] font-mono text-stone-400">Section 7 Compliance</span>
        </div>
        <pre className="text-[11px] font-mono text-stone-700 overflow-x-auto p-3 bg-white rounded-lg border border-stone-200/80 leading-relaxed">
{`CREATE TABLE notifications (
    notification_id    VARCHAR(64) PRIMARY KEY,
    farmer_id          VARCHAR(64) NOT NULL,
    booking_id         VARCHAR(64) NOT NULL,
    token_id           VARCHAR(32) NOT NULL,
    notification_type  VARCHAR(48) NOT NULL,
    message            TEXT NOT NULL,
    scheduled_time     TIMESTAMPTZ,
    sent_time          TIMESTAMPTZ,
    delivery_status    VARCHAR(24) CHECK (delivery_status IN ('Scheduled', 'Sent', 'Delivered', 'Failed')),
    read_status        VARCHAR(16) DEFAULT 'unread',
    created_timestamp  TIMESTAMPTZ DEFAULT NOW()
);`}
        </pre>
      </div>
    </div>
  );
};
