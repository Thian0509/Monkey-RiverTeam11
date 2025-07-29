// src/components/WorldRiskMap.jsx
import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { MapChart } from 'echarts/charts'
import { TooltipComponent, VisualMapComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// Register components globally
echarts.use([MapChart, TooltipComponent, VisualMapComponent, CanvasRenderer])

const WorldRiskMap = () => {
  const chartRef = useRef(null)

  useEffect(() => {
    const chart = echarts.init(chartRef.current)

    // Fetch GeoJSON and render chart
    fetch('/custom.geo.json')
      .then((res) => res.json())
      .then((geoJson) => {
        echarts.registerMap('world', geoJson)

        chart.setOption({
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
            bottom: '10%',
            text: ['High Risk', 'Low Risk'],
            inRange: {
              color: ['#d2f5f5', '#f5222d']
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
                { name: 'South Africa', value: 80 },
                { name: 'Nigeria', value: 65 },
                { name: 'United States', value: 30 },
                { name: 'Russia', value: 90 }
              ]
            }
          ]
        })
      })

    // Cleanup
    return () => {
      chart.dispose()
    }
  }, [])

  return <div ref={chartRef} className="w-screen h-screen" />
}

export default WorldRiskMap
