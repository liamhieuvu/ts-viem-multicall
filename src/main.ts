import { Address, createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { BalancesReturn, ReservesReturn, TotalSupplyReturn, getBalances, getReserves, getTotalSupply } from './pair'
import { processMulticalls } from './multicall'

async function main() {
  const users: Address[] = ['0x18498Ab9931c671742C4fF0CA292c1876CaB7384', '0x1A68f74F59405Dcdb5Dc994ADab6C1708A3Da898']
  const pair = '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc'
  const client = createPublicClient({ chain: mainnet, transport: http() })

  const multicalls = [getReserves(pair), getTotalSupply(pair), getBalances(users, pair)]
  const outputs = await processMulticalls(client, multicalls)
  const [reserves, totalSupply, balances] = <[ReservesReturn, TotalSupplyReturn, BalancesReturn]>outputs

  const usdcUsers = balances.map((balance) => Number((balance * reserves[0]) / totalSupply) / 1e6)
  console.log('usdcUsers:', usdcUsers)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
