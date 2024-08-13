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

      console.log("decimals",balance?.decimals);

      const { data: allowance} = useReadContract({
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

      

    const {writeContract: mintWriteContract} = useWriteContract({
        mutation:{
            onError:(err)=> console.log(err),
            onSuccess:()=>{
                balanceRefetch()
            }
       }
    }) 

    const {writeContractAsync:approveWriteContract} = useWriteContract() 

    function mint(){
        if(address && balance)
            mintWriteContract({
                address: tokenAddress as EthAddress,
                abi:tokenERC20Abi,
                functionName: 'mint',
                args: [address, parseEther(`${1*10**balance.decimals}`)],
            })
      }

      async function handleDeposit(){
        if(address && balance) {

            if (Number(allowance as bigint) > 1) {
                console.log(">");
                
                mintWriteContract({
                    address: myContractAddress as EthAddress,
                    abi:myContractAbi,
                    functionName: 'depositToken',
                    args: [parseEther(`${1}`)],
                })

                return
            }
            console.log("<");
            
          await approveWriteContract({
                address: tokenAddress as EthAddress,  
                abi: tokenERC20Abi,         
                functionName: 'approve',
                args: [myContractAddress, 1], 
            }).then((data)=> console.log(data))
        }
            
      }

      console.log(Number(deposit as bigint));
      


  
    return (
      <div>
        UserBalance: { Number(balance?.formatted)?Number(balance!.formatted)/(10**balance!.decimals):undefined  } { balance?.symbol }
        UserDeposit: { Number(deposit as bigint)?Number(deposit as bigint)/(10**balance!.decimals):undefined }
        <button onClick={mint}>mint</button>
        <button onClick={handleDeposit}>deposit</button>
      </div>
    )
}
