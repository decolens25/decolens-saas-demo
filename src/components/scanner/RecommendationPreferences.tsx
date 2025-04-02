import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { cn } from '../../utils/cn';
import { supabase } from '../../lib/supabase';
import { Style } from '@decolens/decolens-sdk';

interface PriceHistogramData {
  bucket: number;
  count: number;
}

interface RecommendationPreferencesProps {
  onSubmit: (preferences: {
    styles: string[];
    priceRange: [number, number];
  }) => void;
  onCancel: () => void;
  isPro?: boolean;
  initialPriceRange?: [number, number];
  initialStyles?: string[];
}

const styleOptions = [
  { id: Style.Minimalist, label: 'Minimalist', description: 'Clean lines and simple forms' },
  { id: Style.Modern, label: 'Modern', description: 'Contemporary and sleek' },
  { id: Style.Traditional, label: 'Traditional', description: 'Classic and timeless' },
  { id: Style.Eclectic, label: 'Eclectic', description: 'Mixed styles and unique combinations' },
  { id: Style.Bohemian, label: 'Bohemian', description: 'Free-spirited and artistic' },
  { id: Style.Industrial, label: 'Industrial', description: 'Raw and urban feel' },
  { id: Style.Coastal, label: 'Coastal', description: 'Beach-inspired and relaxed' },
  { id: Style.Scandinavian, label: 'Scandinavian', description: 'Light and functional' },
  { id: Style.Rustic, label: 'Rustic', description: 'Natural and weathered' },
  { id: Style.MidCenturyModern, label: 'Mid-Century', description: 'Retro and geometric' },
  { id: Style.ArtDeco, label: 'Art Deco', description: 'Glamorous and bold' },
  { id: Style.Tropical, label: 'Tropical', description: 'Vibrant and exotic' },
  { id: Style.Zen, label: 'Zen', description: 'Peaceful and balanced' },
  { id: Style.Farmhouse, label: 'Farmhouse', description: 'Cozy and vintage' },
  { id: Style.Mediterranean, label: 'Mediterranean', description: 'Warm and textured' }
];

const RecommendationPreferences: React.FC<RecommendationPreferencesProps> = ({
  onSubmit,
  onCancel,
  isPro = false,
  initialPriceRange,
  initialStyles = []
}) => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(initialStyles);
  const [priceRange, setPriceRange] = useState<[number, number]>(initialPriceRange || [0, 5000]);
  const [histogramData, setHistogramData] = useState<PriceHistogramData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPriceDistribution = async () => {
      try {
        const { data, error } = await supabase.rpc('get_price_distribution');

        if (error) throw error;
        console.log(data);
        setHistogramData(data);

        if (!initialPriceRange && data.length > 0) {
          const minPrice = data[0].bucket;
          const maxPrice = data[data.length - 1].bucket;
          setPriceRange([minPrice, maxPrice]);
        }
      } catch (error) {
        console.error('Error fetching price distribution:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceDistribution();
  }, []);

  useEffect(() => {
    console.log("Updated preferences:", { styles: selectedStyles, priceRange });
  }, [selectedStyles, priceRange]);

  const toggleStyle = (styleId: string) => {
    if (!isPro) return;

    setSelectedStyles(prev => {
      if (prev.includes(styleId)) {
        return prev.filter(v => v !== styleId);
      }
      if (prev.length >= 2) {
        return [prev[1], styleId];
      }
      return [...prev, styleId];
    });
  };

  const handlePriceRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const numValue = Number(value);

    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      if (name === 'min') {
        newRange[0] = Math.min(numValue, prev[1]);
      } else {
        newRange[1] = Math.max(numValue, prev[0]);
      }
      return newRange;
    });
  };

  const maxCount = Math.max(...histogramData.map(d => d.count));
  const getBarHeight = (count: number) => {
    return (count / maxCount) * 100;
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="relative h-40 mb-4">
          <div className="absolute inset-0 flex items-end">
            {histogramData.map((bucket, i) => (
              <div
                key={i}
                className="flex-1 mx-0.5"
                style={{ height: `${getBarHeight(bucket.count)}%` }}
              >
                <div
                  className={cn(
                    "w-full h-full transition-colors",
                    bucket.bucket >= priceRange[0] && bucket.bucket <= priceRange[1]
                      ? "bg-primary/20"
                      : "bg-gray-100"
                  )}
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-x-4 bottom-0">
            <input
              type="range"
              name="min"
              min={histogramData[0]?.bucket || 0}
              max={histogramData[histogramData.length - 1]?.bucket || 5000}
              value={priceRange[0]}
              onChange={handlePriceRangeChange}
              className="absolute w-full"
            />
            <input
              type="range"
              name="max"
              min={histogramData[0]?.bucket || 0}
              max={histogramData[histogramData.length - 1]?.bucket || 5000}
              value={priceRange[1]}
              onChange={handlePriceRangeChange}
              className="absolute w-full"
            />
          </div>
        </div>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0].toLocaleString()}</span>
          <span>${priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Preferred Styles</h4>
          {!isPro && (
            <div className="flex items-center gap-1 text-sm text-primary">
              <Info className="h-4 w-4" />
              <span>Pro feature</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {styleOptions.map((style) => (
            <button
              key={style.id}
              onClick={() => toggleStyle(style.id)}
              disabled={!isPro}
              className={cn(
                "p-3 rounded-lg text-left transition-colors",
                selectedStyles.includes(style.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80",
                !isPro && "opacity-50 cursor-not-allowed hover:bg-secondary"
              )}
            >
              <div className="font-medium text-sm">{style.label}</div>
              <div className="text-xs opacity-80">{style.description}</div>
            </button>
          ))}
        </div>

        {selectedStyles.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Selected: {selectedStyles.map(id =>
              styleOptions.find(v => v.id === id)?.label
            ).join(', ')}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          onClick={onCancel}
          className="btn btn-outline"
        >
          Cancel
        </button>
        <button
          onClick={() => onSubmit({
            styles: selectedStyles,
            priceRange: priceRange
          })}
          className="btn btn-primary"
        >
          Update Recommendations
        </button>
      </div>
    </div>
  );
};

export default RecommendationPreferences;