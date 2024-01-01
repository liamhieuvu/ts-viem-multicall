import { Address, parseAbi } from 'viem'
import { Multicall } from './multicall'

export type TotalSupplyReturn = bigint
export function getTotalSupply(pair: Address): Multicall {
  const abi = parseAbi(['function totalSupply() external view returns (uint)'])
  return {
    requests: [{ address: pair, abi, functionName: 'totalSupply' }],
    parser: ([resp]): TotalSupplyReturn => (!!resp && resp.status === 'success' ? (resp.result as bigint) : 0n)
  }
}

export type ReservesReturn = [bigint, bigint]
export function getReserves(pair: Address): Multicall {
  const abi = parseAbi(['function getReserves() view returns (uint112 _reserve0, uint112 _reserve1, uint32 ts)'])
  return {
    requests: [{ address: pair, abi, functionName: 'getReserves' }],
    parser: ([resp]): ReservesReturn => {
      const data = resp.result as any[]
      return resp.status === 'success' && data.length === 3 ? [data[0], data[1]] : [0n, 0n]
    }
  }
}

export type BalancesReturn = bigint[]
export function getBalances(users: Address[], pair: Address): Multicall {
  const abi = parseAbi(['function balanceOf(address owner) external view returns (uint)'])
  return {
    requests: users.map((u) => ({ address: pair, abi, functionName: 'balanceOf', args: [u] })),
    parser: (responses): BalancesReturn => responses.map((r) => (r.status === 'success' ? (r.result as bigint) : 0n))
  }
}
