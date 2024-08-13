import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { WagmiProvider } from 'wagmi'
import './App.css'
import reactLogo from './assets/react.svg'
import ConnectWallet from './components/ConnectWallet'
import { wagmiConfig } from './configs/wagmi'
import viteLogo from '/vite.svg'


function App() {
  const [count, setCount] = useState(0)

  const queryClient = new QueryClient()

 


  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
        <ConnectWallet/>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
