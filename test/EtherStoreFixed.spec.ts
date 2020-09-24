import { expect } from './setup'

/* External Imports */
import { ethers } from '@nomiclabs/buidler'
import { Contract, ContractFactory, Signer, BigNumber, utils, providers } from 'ethers'
import {
  getContractFactory, sleep, sendLT, getBalanceLT
} from './test-utils'

import { getLogger } from './test-utils'

import { GAS_LIMIT } from './test-helpers'

const log = getLogger('EtherStore-Test')

describe('EtherStore Attack Test', () => {
  let wallet: Signer
  let owner1: Signer
  let owner2: Signer
  let deployproxycont:boolean = false

  before(async () => {
    ;[wallet, owner1, owner2] = await ethers.getSigners()

    log.info(`Admin :: ${await wallet.getAddress()}`)
    log.info(`Own1 :: ${await owner1.getAddress()}`)
    log.info(`Own2 :: ${await owner2.getAddress()}`)
  })

  let etherstorefact: ContractFactory
  let etherstoreinst: Contract
  before(async () => {

    etherstorefact = getContractFactory( "EtherStoreFixed", wallet )

    // Deploy the implementation part of the logic
    etherstoreinst = await etherstorefact.deploy();

    log.debug( `EtherStore @ ${etherstoreinst.address}`)

    log.debug(`Ent wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

    const transamount = ethers.utils.parseUnits( "5", 18 );

    const receipt = await wallet.sendTransaction({
                              to: etherstoreinst.address,
                              value: transamount,
                              gasLimit: GAS_LIMIT,
                            })

    await etherstoreinst.provider.waitForTransaction( receipt.hash )

    const bal = await etherstoreinst.provider.getBalance( etherstoreinst.address );

    log.debug(`etherstoreinst balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    log.debug(`Ext wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

  })

  let attackfact: ContractFactory
  let attackinst: Contract
  before(async () => {

    attackfact = getContractFactory( "AttackFixed", wallet )

    // Deploy the implementation part of the logic
    attackinst = await attackfact.deploy( etherstoreinst.address )

    await attackinst.debugPrintBalance()

    log.debug( `Attack @ ${attackinst.address}`)

  })

  it("tst-item-001", async () => {

      try {

      let iseventfired: boolean = false
      let callbackcount: number = 0

      log.debug(`Enter :: ${ethers.utils.formatUnits( await wallet.getBalance(), "ether")}`)


      // // Register for the event-callback ...
      // attackinst.once( "eventAttackFallBack", ( contbalance ) => {

      //   callbackcount++

      //   log.info( `evtFB :: ${callbackcount}::${ethers.utils.formatUnits( contbalance , "ether" )}`);

      // })

      const transamount = ethers.utils.parseUnits( "1", 18 );

      // calldata to invoke the function pwnEtherStore
      const pwnEtherStoreCalldata = attackinst.interface.encodeFunctionData(
                                                        'pwnEtherStore'
                                                        )

      await attackinst.provider.call({
        to: attackinst.address,
        data: pwnEtherStoreCalldata,
        value: transamount,
        gasLimit: GAS_LIMIT,
      })

      // // Poll for the event-callback ...
      // while( iseventfired === false ){
      //   await sleep( 1 * 1000 ) //sleep for 5 sec, poll for the event
      //   // log.info( `Blocked for event notif state(${eventoccur})`);
      // }

      // attackinst.removeAllListeners( "eventAttackFallBack" )

      log.debug(`Exit :: ${ethers.utils.formatUnits( await wallet.getBalance(), "ether")}`)
    }
    catch( err ){

      log.error(`Exception Err ${err}`)
    }

  })

  afterEach("Test-Case End Contract Status", async () => {

    let bal = await etherstoreinst.provider.getBalance( etherstoreinst.address );

    log.debug(`etherstoreinst balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    bal = await attackinst.provider.getBalance( attackinst.address );

    log.debug(`attackinst balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    log.debug(`wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

  })


  afterEach("Test Done Cleanup", async () => {

    await etherstoreinst.withdrawEth();
    await attackinst.withdrawEth();

    let bal = await etherstoreinst.provider.getBalance( etherstoreinst.address );

    log.debug(`etherstoreinst balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    bal = await attackinst.provider.getBalance( attackinst.address );

    log.debug(`attackinst balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    log.debug(`wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

  })

})
