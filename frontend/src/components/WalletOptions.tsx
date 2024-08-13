import { useConnect } from "wagmi";

export default function WalletOptions() {
    const { connectors, connect } = useConnect()

    console.log(connectors);
    

    return connectors.map((connector, idx) => connector.icon &&(
        <div key={idx}>
        <img src={connector.icon}/>
        <button key={connector.uid} onClick={() => {
            connect({ connector })}}>
          {connector.name}
        </button>
        </div>
        
      ))
}
