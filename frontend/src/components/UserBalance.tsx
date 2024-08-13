import { parseEther } from 'ethers';
import { useAccount, useBalance, useReadContract, useWriteContract } from 'wagmi';
import { abi as myContractAbi } from "../contracts/MyContract.json";
import { abi as tokenERC20Abi } from "../contracts/TokenERC20.json";
import { Token as myContractAddress } from "../contracts/myContract-address.json";
import { Token as tokenAddress } from "../contracts/tokenERC20-address.json";


type EthAddress = `0x${string}`;

export default function UserBalance() {
    const { address } = useAccount()


    const { data: balance, refetch:balanceRefetch } = useBalance({
      address: address,
      token: tokenAddress as EthAddress,
    })

      const { data: allowance, refetch: allowanceRefetch} = useReadContract({
        address: tokenAddress as EthAddress,  
        abi: tokenERC20Abi,         
        functionName: 'allowance',
        args: [address, myContractAddress],
      });

      console.log("allowance",allowance);
      

      const {data:deposit, refetch: depositRefetch} = useReadContract({
        abi: myContractAbi,
        address: myContractAddress as EthAddress,
        functionName: 'depositOf',
        args:[address]
      })

      const {data:balanceERC721, refetch: balanceERC721Refetch} = useReadContract({
        abi: myContractAbi,
        address: myContractAddress as EthAddress,
        functionName: 'getBalance',
        args:[address]
      })

      console.log("balanceERC721",balanceERC721);
      

      

    const {writeContract: mintWriteContract} = useWriteContract({
        mutation:{
            onError:(err)=> console.log(err),
            onSuccess:()=>{
                balanceRefetch()
            }
       }
    }) 

    const {writeContractAsync:approveWriteContract} = useWriteContract({
        mutation:{
            onError:(err)=> console.log(err),
            onSuccess:()=>{
                allowanceRefetch()
            }
       }
    }) 

    const {writeContract: depositWriteContract} = useWriteContract({
        mutation:{
            onError:(err)=> console.log(err),
            onSuccess:()=>{
                depositRefetch()
                balanceRefetch()
                allowanceRefetch()
            }
       }
    }) 

    function mint(){
        if(address && balance)
            mintWriteContract({
                address: tokenAddress as EthAddress,
                abi:tokenERC20Abi,
                functionName: 'mint',
                args: [address, parseEther("10000")],
            })
      }


      async function handleDeposit(){
        if(address && balance) {
            console.log(allowance, 1);
            if (allowance as bigint >= 10000) {
                console.log(">");
                
                depositWriteContract({
                    address: myContractAddress as EthAddress,
                    abi:myContractAbi,
                    functionName: 'depositToken',
                    args: [parseEther("10000")],
                })

                return
            }
            console.log("<");
            
          await approveWriteContract({
                address: tokenAddress as EthAddress,  
                abi: tokenERC20Abi,         
                functionName: 'approve',
                args: [myContractAddress, parseEther("1")], 
            }).then((data)=> console.log("approve",data)).catch(()=> console.log("error"))
        }
            
      }
      
console.log("deposit",deposit);


  
    return (
      <div>
        UserBalance: { balance?.formatted} { balance?.symbol }
        UserDeposit: { Number(deposit as bigint)!==undefined && balance?Number(deposit as bigint)/(10**balance.decimals):undefined}
        <button onClick={mint}>mint</button>
        <button onClick={handleDeposit}>deposit</button>
      </div>
    )
}
