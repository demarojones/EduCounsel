import React, { useEffect, useRef } from 'react';
import { Interaction } from '../../types';

interface TimeDistributionChartProps {
  interactions: Interaction[];
}

const TimeDistributionChart: React.FC<TimeDistributionChartProps> = ({ interactions }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // No data check
    if (interactions.length === 0) {
      ctx.fillStyle = '#6B7280';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('No data available for the selected time period', canvas.width / 2, canvas.height / 2);
      return;
    }
    
    // Group interactions by date
    const interactionsByDate: Record<string, number> = {};
    
    // Sort dates to ensure chronological order
    const allDates = interactions.map(interaction => interaction.date);
    const sortedDates = [...new Set(allDates)].sort();
    
    // Fill in all dates in the range
    if (sortedDates.length > 1) {
      const startDate = new Date(sortedDates[0]);
      const endDate = new Date(sortedDates[sortedDates.length - 1]);
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        interactionsByDate[dateStr] = 0;
      }
    }
    
    // Count minutes per date
    interactions.forEach(interaction => {
      interactionsByDate[interaction.date] = (interactionsByDate[interaction.date] || 0) + interaction.duration;
    });
    
    // Prepare data for rendering
    const dates = Object.keys(interactionsByDate).sort();
    const minutes = dates.map(date => interactionsByDate[date]);
    
    // Chart dimensions
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const chartWidth = canvas.width - margin.left - margin.right;
    const chartHeight = canvas.height - margin.top - margin.bottom;
    
    // Scale factors
    const maxMinutes = Math.max(...minutes, 10); // Ensure minimum scale
    const barWidth = Math.min(Math.floor(chartWidth / dates.length) - 2, 40);
    
    // Draw axes
    ctx.strokeStyle = '#E5E7EB';
    ctx.beginPath();
    
    // X axis
    ctx.moveTo(margin.left, canvas.height - margin.bottom);
    ctx.lineTo(canvas.width - margin.right, canvas.height - margin.bottom);
    
    // Y axis
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, canvas.height - margin.bottom);
    
    ctx.stroke();
    
    // Draw grid lines
    ctx.strokeStyle = '#F3F4F6';
    ctx.beginPath();
    
    // Horizontal grid lines (5 lines)
    for (let i = 0; i < 5; i++) {
      const y = margin.top + (chartHeight / 5) * i;
      ctx.moveTo(margin.left, y);
      ctx.lineTo(canvas.width - margin.right, y);
    }
    
    ctx.stroke();
    
    // Draw bars
    dates.forEach((date, i) => {
      const barHeight = (minutes[i] / maxMinutes) * chartHeight;
      const x = margin.left + (chartWidth / dates.length) * i + (chartWidth / dates.length - barWidth) / 2;
      const y = canvas.height - margin.bottom - barHeight;
      
      // Create gradient for bar
      const gradient = ctx.createLinearGradient(x, y, x, canvas.height - margin.bottom);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.4)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw value on top of bar if high enough
      if (barHeight > 25) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(minutes[i].toString(), x + barWidth / 2, y + 15);
      }
      
      // Draw date label
      ctx.fillStyle = '#6B7280';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      
      // Format date for display (e.g., "May 15")
      const displayDate = new Date(date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      });
      
      ctx.save();
      ctx.translate(x + barWidth / 2, canvas.height - margin.bottom + 10);
      ctx.rotate(Math.PI / 4); // Rotate labels for better readability
      ctx.fillText(displayDate, 0, 0);
      ctx.restore();
    });
    
    // Draw Y-axis labels (minutes)
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxMinutes / 5) * i);
      const y = canvas.height - margin.bottom - (chartHeight / 5) * i;
      ctx.fillText(value.toString(), margin.left - 10, y + 4);
    }
    
    // Draw axis titles
    ctx.fillStyle = '#4B5563';
    ctx.font = 'bold 12px Arial';
    
    // Y-axis title
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Minutes', 0, 0);
    ctx.restore();
    
    // X-axis title
    ctx.textAlign = 'center';
    ctx.fillText('Date', canvas.width / 2, canvas.height - 10);
    
  }, [interactions]);
  
  return (
    <div className="w-full">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400}
        className="w-full h-auto max-h-96"
      ></canvas>
    </div>
  );
};

export default TimeDistributionChart;