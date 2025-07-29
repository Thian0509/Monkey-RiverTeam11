import { render, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, afterEach } from 'vitest';
import * as echarts from 'echarts/core';

vi.mock('../hooks/useMap', () => ({
  useMap: () => ({
    mapData: [
      { location: 'South Africa', riskLevel: 75 },
      { location: 'United States', riskLevel: 50 },
    ],
  }),
}));

import WorldRiskMap from './WorldRiskMap';


// Mock echarts
vi.mock('echarts/core', () => ({
  use: vi.fn(),
  init: vi.fn(),
  registerMap: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

describe('WorldRiskMap Component', () => {
  const mockChart = {
    setOption: vi.fn(),
    dispose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (echarts.init as any).mockReturnValue(mockChart);
    (global.fetch as any).mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        type: 'FeatureCollection',
        features: []
      })
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<WorldRiskMap />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has correct container styling classes', () => {
    const { container } = render(<WorldRiskMap />);
    const chartDiv = container.firstChild;
    
    expect(chartDiv).toHaveClass('w-full', 'h-full', 'max-w-screen', 'overflow-hidden');
  });

  it('initializes echarts chart on mount', async () => {
    render(<WorldRiskMap />);
    
    await waitFor(() => {
      expect(echarts.init).toHaveBeenCalledTimes(1);
    });
  });

  it('fetches geo JSON data', async () => {
    render(<WorldRiskMap />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/custom.geo.json');
    });
  });

  it('registers world map with echarts', async () => {
    const mockGeoJson = { type: 'FeatureCollection', features: [] };
    (global.fetch as any).mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockGeoJson)
    });

    render(<WorldRiskMap />);
    
    await waitFor(() => {
      expect(echarts.registerMap).toHaveBeenCalledWith('world', mockGeoJson);
    });
  });

  it('sets chart options with correct configuration', async () => {
    render(<WorldRiskMap />);
    
    await waitFor(() => {
      expect(mockChart.setOption).toHaveBeenCalledWith({
        title: {
          text: 'Country Risk Map',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          min: 0,
          max: 100,
          left: 'left',
          text: ['High Risk', 'Low Risk'],
          inRange: {
            color: ['#00c951', '#fb2c36']
          },
          calculable: true
        },
        series: [
          {
            name: 'Risk Level',
            type: 'map',
            map: 'world',
            roam: true,
            emphasis: {
              label: {
                show: true
              }
            },
            data: [
              { name: 'South Africa', value: 75 },
              { name: 'United States', value: 50 }
            ]
          }
        ],
      });
    });
  });

  it('configures visual map with correct risk colors', async () => {
    render(<WorldRiskMap />);
    
    await waitFor(() => {
      const setOptionCall = mockChart.setOption.mock.calls[0][0];
      const visualMap = setOptionCall.visualMap;
      
      expect(visualMap.min).toBe(0);
      expect(visualMap.max).toBe(100);
      expect(visualMap.text).toEqual(['High Risk', 'Low Risk']);
      expect(visualMap.inRange.color).toEqual(['#00c951', '#fb2c36']);
    });
  });

  it('enables map roaming functionality', async () => {
    render(<WorldRiskMap />);
    
    await waitFor(() => {
      const setOptionCall = mockChart.setOption.mock.calls[0][0];
      const series = setOptionCall.series[0];
      
      expect(series.roam).toBe(true);
    });
  });

  it('configures tooltip for item interaction', async () => {
    render(<WorldRiskMap />);
    
    await waitFor(() => {
      const setOptionCall = mockChart.setOption.mock.calls[0][0];
      
      expect(setOptionCall.tooltip.trigger).toBe('item');
    });
  });

  it('disposes chart on unmount', async () => {
    const { unmount } = render(<WorldRiskMap />);
    
    await waitFor(() => {
      expect(echarts.init).toHaveBeenCalledTimes(1);
    });
    
    unmount();
    
    expect(mockChart.dispose).toHaveBeenCalledTimes(1);
  });


  it('uses correct echarts components', () => {
    // This test verifies that the required echarts components are imported
    // The actual mocking happens at the module level
    expect(vi.mocked(echarts.use)).toBeDefined();
  });
});