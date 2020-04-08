import React, { useEffect, useState } from 'react'
import StatTracker from '../../sort/StatTracker'
import './Stats.scss'

const Stats: React.FC<{
  stats?: StatTracker
  display: boolean
}> = ({ stats = { comparisons: 0, reads: 0, writes: 0 }, display }) => {
  const [comparisons, setComparisons] = useState(stats.comparisons)
  const [reads, setReads] = useState(stats.reads)
  const [writes, setWrites] = useState(stats.writes)

  /** update the values if they have changed  */
  useEffect(() => {
    const interval = setInterval(() => {
      setComparisons(stats.comparisons)
      setReads(stats.reads)
      setWrites(stats.writes)
    }, 50)
    return () => clearInterval(interval)
  }, [stats])

  return (
    <div className={`Stats ${display ? 'show' : 'hide'}`}>
      <div className="stat comparisons">Comparisons: {comparisons}</div>
      <div className="stat reads">Reads: {reads}</div>
      <div className="stat writes">Writes: {writes}</div>
    </div>
  )
}

export default Stats
