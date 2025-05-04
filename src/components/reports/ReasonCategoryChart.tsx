import React, { useEffect, useRef } from 'react';

interface ReasonCategoryChartProps {
  distribution: Record<string, number>;
}

const ReasonCategoryChart: React.FC<ReasonCategoryChartProps> = ({ distribution }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // No data check
    if (Object.keys(distribution).length === 0) {
      ctx.fillStyle = '#6B7280';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('No data available for the selected time period', canvas.width / 2, canvas.height / 2);
      return;
    }
    
    // Sort categories by count
    const sortedCategories = Object.entries(distribution)
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category);
    
    // Define colors for categories
    const colors = [
      'rgba(59, 130, 246, 0.8)', // blue
      'rgba(16, 185, 129, 0.8)', // green
      'rgba(245, 158, 11, 0.8)', // amber
      'rgba(139, 92, 246, 0.8)', // purple
      'rgba(236, 72, 153, 0.8)', // pink
      'rgba(239, 68, 68, 0.8)', // red
      'rgba(14, 165, 233, 0.8)', // sky
      'rgba(168, 85, 247, 0.8)', // violet
    ];
    
    // Chart dimensions
    const margin = { top: 20, right: 20, bottom: 50, left: 120 };
    const chartWidth = canvas.width - margin.left - margin.right;
    const chartHeight = canvas.height - margin.top - margin.bottom;
    
    // Scale factors
    const totalCount = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    const barHeight = Math.min(25, chartHeight / sortedCategories.length - 5);
    
    // Draw horizontal bars
    sortedCategories.forEach((category, i) => {
      const count = distribution[category];
      const percentage = (count / totalCount) * 100;
      const barWidth = (count / Math.max(...Object.values(distribution))) * chartWidth;
      
      const y = margin.top + (chartHeight / sortedCategories.length) * i + (chartHeight / sortedCategories.length - barHeight) / 2;
      
      // Create gradient for bar
      const gradient = ctx.createLinearGradient(margin.left, y, margin.left + barWidth, y);
      gradient.addColorStop(0, colors[i % colors.length]);
      gradient.addColorStop(1, colors[i % colors.length].replace('0.8', '0.5'));
      
      // Draw bar
      ctx.fillStyle = gradient;
      ctx.fillRect(margin.left, y, barWidth, barHeight);
      
      // Draw category label
      ctx.fillStyle = '#4B5563';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(category, margin.left - 10, y + barHeight / 2 + 4);
      
      // Draw count and percentage
      if (barWidth > 40) {
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.fillText(`${count} (${Math.round(percentage)}%)`, margin.left + 5, y + barHeight / 2 + 4);
      } else {
        ctx.fillStyle = '#4B5563';
        ctx.textAlign = 'left';
        ctx.fillText(`${count} (${Math.round(percentage)}%)`, margin.left + barWidth + 5, y + barHeight / 2 + 4);
      }
    });
    
    // Draw x-axis
    ctx.strokeStyle = '#E5E7EB';
    ctx.beginPath();
    ctx.moveTo(margin.left, canvas.height - margin.bottom);
    ctx.lineTo(canvas.width - margin.right, canvas.height - margin.bottom);
    ctx.stroke();
    
    // Draw title
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Interaction Reasons by Category', canvas.width / 2, 15);
    
  }, [distribution]);
  
  return (
    <div className="w-full">
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={300}
        className="w-full h-auto mx-auto"
      ></canvas>
    </div>
  );
};

export default ReasonCategoryChart;