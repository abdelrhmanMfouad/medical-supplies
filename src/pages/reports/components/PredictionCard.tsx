import React from 'react';
import { PredictionData } from '../reports.types';

interface PredictionCardProps {
  predictions: PredictionData[];
}

const PredictionCard: React.FC<PredictionCardProps> = ({ predictions }) => {
  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'ORDER':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'REDUCE':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    }
  };

  const getRecommendationEmoji = (rec: string) => {
    switch (rec) {
      case 'ORDER':
        return '⚠️';
      case 'REDUCE':
        return '📉';
      default:
        return '✅';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        🔮 AI Predictions
      </h3>
      <div className="space-y-3">
        {predictions.slice(0, 10).map((pred) => (
          <div
            key={pred.itemId}
            className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div>
              <p className="font-medium text-gray-800 dark:text-white">{pred.itemName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Stock: {pred.currentStock} | Predicted: {Math.round(pred.predictedUsage)}
              </p>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRecommendationColor(pred.recommendation)}`}>
                {getRecommendationEmoji(pred.recommendation)} {pred.recommendation}
              </span>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {pred.daysUntilOut > 999 ? '∞' : pred.daysUntilOut} days left
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Confidence: {Math.round(pred.confidence * 100)}%
              </p>
            </div>
          </div>
        ))}
      </div>
      {predictions.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">No predictions available</p>
      )}
    </div>
  );
};

export default PredictionCard;