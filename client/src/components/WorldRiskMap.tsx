// src/components/WorldRiskMap.jsx
import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { MapChart } from 'echarts/charts'
import { TooltipComponent, VisualMapComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([MapChart, TooltipComponent, VisualMapComponent, CanvasRenderer])

const WorldRiskMap = () => {
  const chartRef = useRef(null)

  useEffect(() => {
    const chart = echarts.init(chartRef.current)

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
                { name: 'South Africa', value: 80 },
                { name: 'Nigeria', value: 65 },
                { name: 'United States', value: 30 },
                { name: 'Russia', value: 90 }
              ]
            }
          ]
        })
      })

    return () => {
      chart.dispose()
    }
  }, [])

  return <div ref={chartRef} className="w-full h-full max-w-screen overflow-hidden" />
}

export default WorldRiskMap
