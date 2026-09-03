import { useEffect, useRef, useState } from 'react'
import './ArtCursor.css'

export default function ArtCursor() {
  const cursor = useRef(null)
  const [bursts, setBursts] = useState([])
  useEffect(() => {
    const move = (event) => { if (cursor.current) cursor.current.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)` }
    const click = (event) => { const id = `${event.clientX}-${event.clientY}-${Date.now()}`; setBursts(items => [...items, { id, x:event.clientX, y:event.clientY }]); setTimeout(() => setBursts(items => items.filter(item => item.id !== id)), 600) }
    addEventListener('pointermove', move); addEventListener('pointerdown', click)
    return () => { removeEventListener('pointermove', move); removeEventListener('pointerdown', click) }
  }, [])
  return <><div ref={cursor} className="art-cursor" aria-hidden="true"><span/><i/><b/></div>{bursts.map(item => <span key={item.id} className="cursor-burst" style={{left:item.x,top:item.y}} aria-hidden="true"/>)}</>
}
