import { useMemo } from 'react';

type WeeklyProgressProps = {
  progress: boolean[];
  color?: string;
};

export function WeeklyProgress({ progress, color = 'purple' }: WeeklyProgressProps) {
  const dots = useMemo(() => {
    // Ensure we always show 14 dots (2 weeks)
    const paddedProgress = [...progress];
    while (paddedProgress.length < 14) {
      paddedProgress.unshift(false);
    }
    return paddedProgress.slice(-14);
  }, [progress]);

  return (
    <div className="grid grid-cols-7 gap-1.5 mt-2">
      {dots.map((completed, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full transition-colors duration-200 ${
            completed ? `bg-${color}-500` : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}
