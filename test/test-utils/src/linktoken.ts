/* External Imports */
import { ethers, Contract, Signer, utils } from 'ethers'

import { getLogger } from './log'
import { sleep } from './misc'

const log = getLogger('LinkToken-Intf')

// The ERC-20 ABI
let abi: string[] = [
    "function balanceOf(address owner) view returns (uint)",
    "function transfer(address to, uint amount)",
    "event Transfer(address indexed from, address indexed to, uint amount)"
  ]

  // Connect to Kovan "Link token" Contract (ERC-20 compliant)
let linktokenaddress: string = "0xa36085F69e2889c224210F603D836748e7dC0088"

export const getBalanceLT = async (
    wallet: Signer,
    srcaddress: string
  ): Promise<string> => {

    let linktokencontract: Contract = new Contract(linktokenaddress, abi, wallet);

    let linkbalance = await linktokencontract.balanceOf(await srcaddress)

    let linkbalancestr = utils.formatEther(linkbalance)

    return linkbalancestr

}

export const sendLT = async (
    wallet: Signer,
    targetAddress: string,
    amount: string
  )  => {

    let iseventfired: boolean = false

    let transamount = ethers.utils.parseUnits( amount, 18 );

    let linktokencontract: Contract = new Contract(linktokenaddress, abi, wallet);

    // Register for the event-callback ...
    linktokencontract.once( "Transfer", ( from, to, amount ) => {
        let text = utils.formatEther(amount);

        log.debug("Transfer");
        log.debug("  From:   ", from);
        log.debug("  To:     ", to);
        log.debug("  Amount: ", text);

        iseventfired = true
    })

    await linktokencontract.transfer(targetAddress, transamount)

    while( iseventfired === false ){
        await sleep( 1 * 1000 ) //sleep for 1 sec, poll for the event
    }

}
