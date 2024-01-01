import { ContractFunctionConfig, MulticallContracts, MulticallReturnType, Narrow, PublicClient } from 'viem'

export type MulticallRequest = Narrow<readonly [...MulticallContracts<ContractFunctionConfig[]>]>
export type MulticallReturn = MulticallReturnType<ContractFunctionConfig[], true>

export type Multicall = {
  requests: MulticallRequest
  parser: (responses: MulticallReturn) => unknown
}

export async function processMulticalls(client: PublicClient, multicalls: Multicall[]): Promise<unknown[]> {
  const flatResponses = await client.multicall({ contracts: multicalls.map((c) => c.requests).flat() })
  const responses: MulticallReturn[] = []
  for (let pointer = 0, i = 0; i < multicalls.length; i++) {
    responses.push(flatResponses.slice(pointer, pointer + multicalls[i].requests.length))
    pointer += multicalls[i].requests.length
  }
  return multicalls.map((c, i) => c.parser(responses[i]))
}
