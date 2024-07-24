import { useEffect } from 'react'

export const HomeScreen = () => {
  useEffect(() => {
    console.log(import.meta.env.BASE_URL)
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then((r) => r.json())
      .then(console.log)
  }, [])

  return <div>Home</div>
}
