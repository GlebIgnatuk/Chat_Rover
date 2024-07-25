import { api } from '@/services/api'
import { useEffect } from 'react'

export const HomeScreen = () => {
  useEffect(() => {
    api('/health')
      .then((r) => r.json())
      .then(console.log)
  }, [])

  return <div>Home</div>
}
