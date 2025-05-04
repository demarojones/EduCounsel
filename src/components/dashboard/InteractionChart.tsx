import React, { useEffect, useRef } from 'react';

interface InteractionChartProps {
  categories: { [key: string]: number };
}

const getRandomColor = (index: number): string => {
  const colors = [
    'rgba(59, 130, 246, 0.7)', // blue
    'rgba(16, 185, 129, 0.7)', // green
    'rgba(245, 158, 11, 0.7)', // amber
    'rgba(139, 92, 246, 0.7)', // purple
    'rgba(236, 72, 153, 0.7)', // pink
    'rgba(239, 68, 68, 0.7)', // red
    'rgba(14, 165, 233, 0.7)', // sky
    'rgba(168, 85, 247, 0.7)', // violet
  ];
  return colors[index % colors.length];
};

const InteractionChart: React.FC<InteractionChartProps> = ({ categories }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || Object.keys(categories).length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    // Calculate total value
    const total = Object.values(categories).reduce((sum, value) => sum + value, 0);
    
    let startAngle = 0;
    
    // Draw pie chart
    Object.entries(categories).forEach(([category, value], index) => {
      const sliceAngle = (2 * Math.PI * value) / total;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = getRandomColor(index);
      ctx.fill();
      
      // Draw label
      const labelAngle = startAngle + sliceAngle / 2;
      const percent = Math.round((value / total) * 100);
      
      if (percent >= 5) { // Only draw labels for significant segments
        const labelRadius = radius * 0.7;
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;
        
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${percent}%`, labelX, labelY);
      }
      
      startAngle += sliceAngle;
    });
    
    // Draw center circle for donut chart
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    
  }, [categories]);
  
  // Generate legend data
  const legendItems = Object.entries(categories).map(([category, value], index) => ({
    category,
    value,
    color: getRandomColor(index)
  }));
  
  return (
    <div className="flex flex-col md:flex-row items-center">
      <div className="w-full md:w-3/5">
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={300}
          className="mx-auto"
        ></canvas>
      </div>
      <div className="w-full md:w-2/5 mt-4 md:mt-0">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Categories</h3>
        <div className="space-y-2">
          {legendItems.map((item) => (
            <div key={item.category} className="flex items-center">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="ml-2 text-sm text-gray-700">{item.category}</span>
              <span className="ml-auto text-sm font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractionChart;