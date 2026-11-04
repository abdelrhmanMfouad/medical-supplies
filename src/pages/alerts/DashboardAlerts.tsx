import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAlerts } from './useAlerts';
import AlertCard from './AlertCard';

interface DashboardAlertsProps {
  limit?: number;
}

const DashboardAlerts: React.FC<DashboardAlertsProps> = ({ limit = 3 }) => {
  const {
    activeAlerts,
    isLoading,
    dismissAlert,
    resolveAlert,
    loadActiveAlerts,
  } = useAlerts();

  useEffect(() => {
    loadActiveAlerts();
  }, [loadActiveAlerts]);

  const displayedAlerts = activeAlerts.slice(0, limit);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (displayedAlerts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-4">
          <span className="text-2xl">✅</span>
          <p className="text-gray-500 dark:text-gray-400 mt-2">No active alerts</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">All systems are running smoothly</p>
        </div>
      </div>
    );
  }

  const criticalCount = activeAlerts.filter(a => a.priority === 'CRITICAL').length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          ⚠️ Alerts
          {criticalCount > 0 && (
            <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
              {criticalCount} critical
            </span>
          )}
        </h3>
        <Link
          to="/alerts"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-3">
        {displayedAlerts.map((alert) => (
          <AlertCard
            key={alert.id}  // ✅ أضف key
            alert={alert}
            onDismiss={dismissAlert}
            onResolve={resolveAlert}
            isLoading={isLoading}
          />
        ))}
      </div>

      {activeAlerts.length > limit && (
        <div className="mt-4 text-center">
          <Link
            to="/alerts"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            + {activeAlerts.length - limit} more alerts
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardAlerts;