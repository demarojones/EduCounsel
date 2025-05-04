import React, { useEffect, useRef } from 'react';

interface InteractionTypeChartProps {
  studentCount: number;
  contactCount: number;
}

const InteractionTypeChart: React.FC<InteractionTypeChartProps> = ({ studentCount, contactCount }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // No data check
    if (studentCount === 0 && contactCount === 0) {
      ctx.fillStyle = '#6B7280';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('No data available for the selected time period', canvas.width / 2, canvas.height / 2);
      return;
    }
    
    const total = studentCount + contactCount;
    const studentPercentage = Math.round((studentCount / total) * 100);
    const contactPercentage = Math.round((contactCount / total) * 100);
    
    // Draw pie chart
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;
    
    // Student section (blue)
    const studentAngle = (studentCount / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, 0, studentAngle);
    ctx.closePath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.fill();
    
    // Contact section (green)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, studentAngle, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
    ctx.fill();
    
    // Draw center circle for donut chart
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    // Draw total count in center
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toString(), centerX, centerY - 10);
    ctx.font = '14px Arial';
    ctx.fillText('Total', centerX, centerY + 10);
    
    // Draw legend
    const legendY = canvas.height - 40;
    const legendTextY = legendY + 4;
    
    // Student legend
    ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.fillRect(centerX - 100, legendY, 15, 15);
    ctx.fillStyle = '#4B5563';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Students: ${studentCount} (${studentPercentage}%)`, centerX - 80, legendTextY);
    
    // Contact legend
    ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
    ctx.fillRect(centerX + 10, legendY, 15, 15);
    ctx.fillStyle = '#4B5563';
    ctx.fillText(`Contacts: ${contactCount} (${contactPercentage}%)`, centerX + 30, legendTextY);
    
  }, [studentCount, contactCount]);
  
  return (
    <div className="w-full">
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={300}
        className="w-full h-auto mx-auto"
      ></canvas>
    </div>
  );
};

export default InteractionTypeChart;