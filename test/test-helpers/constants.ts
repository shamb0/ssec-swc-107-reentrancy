import { defaultAccounts } from 'ethereum-waffle'
import { BigNumber } from '../test-utils'

export const DEFAULT_ACCOUNTS = defaultAccounts
export const DEFAULT_ACCOUNTS_BUIDLER = defaultAccounts.map((account) => {
  return {
    balance: new BigNumber(account.balance).toString('hex'),
    privateKey: account.secretKey,
  }
})

export const GAS_LIMIT = 1_000_000_000
