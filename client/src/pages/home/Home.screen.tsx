import { useEffect } from 'react'

export const HomeScreen = () => {
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then((r) => r.json())
      .then(console.log)
  }, [])

  return <div>Home</div>
}
