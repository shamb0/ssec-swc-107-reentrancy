# ssec-swc-107-reentrancy | Solidity | Security | SWC-107 | reentrancy attack (a.k.a. recursive call attack) examples

---

## Reference

* [SWC-107 · Overview](https://swcregistry.io/docs/SWC-107)

* [HackPedia: 16 Solidity Hacks/Vulnerabilities, their Fixes and Real World Examples | by vasa | HackerNoon.com | Medium](https://medium.com/hackernoon/hackpedia-16-solidity-hacks-vulnerabilities-their-fixes-and-real-world-examples-f3210eba5148)

---

## Example-1

**Howto Install & build**

```shell
git clone https://github.com/shamb0/ssec-swc-107-reentrancy.git
cd ssec-swc-107-reentrancy
yarn install
yarn build
```

### EtherStore ( Vulnarable One )

```shell
master$ env DEBUG="debug*,info*,error*" yarn run test ./test/EtherStore.spec.ts
All contracts have already been compiled, skipping compilation.

  EtherStore Attack Test
  info:EtherStore-Test Admin :: 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff +0ms
  info:EtherStore-Test Own1 :: 0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 +0ms
  info:EtherStore-Test Own2 :: 0xD1D84F0e28D6fedF03c73151f98dF95139700aa7 +0ms
  debug:EtherStore-Test Network Gas price @ 8000000000 +0ms
  debug:EtherStore-Test EtherStore @ 0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA +52ms
  debug:EtherStore-Test Ent wallet bal :: 25310251388.1990675704 +3ms

Info@EtherStore.sol::fallback ContBal(5000000000000000000)
  debug:EtherStore-Test etherstoreinst balance :: 5.0 +32ms
  debug:EtherStore-Test Ext wallet bal :: 25310251383.1988820584 +2ms

Info@Attack.sol::constructor ContBal(0)
Info@Attack.sol::debugPrintBalance ContBal(0)

  debug:EtherStore-Test Attack @ 0xaC8444e7d45c34110B34Ed269AD86248884E78C7 +86ms
  debug:EtherStore-Test Enter :: 25310251383.1943116904 +3ms

Info@Attack.sol::pwnEtherStore Sender(0x17ec8597ff92c3f44523bdc65bf0f1be632917ff)
Info@Attack.sol::pwnEtherStore Val(1000000000000000000)
Info@Attack.sol::pwnEtherStore ContBal(1000000000000000000)

Info@EtherStore.sol::debugPrintBalance ContBal(5000000000000000000)

Info@EtherStore.sol::depositFunds Entry ContBal(6000000000000000000)
Info@EtherStore.sol::depositFunds Sender(0xac8444e7d45c34110b34ed269ad86248884e78c7)
Info@EtherStore.sol::depositFunds Val(1000000000000000000)
Info@EtherStore.sol::depositFunds Exit ContBal(6000000000000000000)
Info@Attack.sol::pwnEtherStore ContBal(0)

Info@EtherStore.sol::withdrawFunds Entry ContBal(6000000000000000000)
Info@EtherStore.sol::withdrawFunds Sender(0xac8444e7d45c34110b34ed269ad86248884e78c7)
Info@EtherStore.sol::withdrawFunds _weiToWithdraw(1000000000000000000)

Info@Attack.sol::fallback Ent ContBal(1000000000000000000)

Info@EtherStore.sol::withdrawFunds Entry ContBal(5000000000000000000)
Info@EtherStore.sol::withdrawFunds Sender(0xac8444e7d45c34110b34ed269ad86248884e78c7)
Info@EtherStore.sol::withdrawFunds _weiToWithdraw(1000000000000000000)

Info@Attack.sol::fallback Ent ContBal(2000000000000000000)

Info@EtherStore.sol::withdrawFunds Entry ContBal(4000000000000000000)
Info@EtherStore.sol::withdrawFunds Sender(0xac8444e7d45c34110b34ed269ad86248884e78c7)
Info@EtherStore.sol::withdrawFunds _weiToWithdraw(1000000000000000000)
Info@Attack.sol::fallback Ent ContBal(3000000000000000000)

Info@EtherStore.sol::withdrawFunds Entry ContBal(3000000000000000000)
Info@EtherStore.sol::withdrawFunds Sender(0xac8444e7d45c34110b34ed269ad86248884e78c7)
Info@EtherStore.sol::withdrawFunds _weiToWithdraw(1000000000000000000)
Info@Attack.sol::fallback Ent ContBal(4000000000000000000)

Info@EtherStore.sol::withdrawFunds Entry ContBal(2000000000000000000)
Info@EtherStore.sol::withdrawFunds Sender(0xac8444e7d45c34110b34ed269ad86248884e78c7)
Info@EtherStore.sol::withdrawFunds _weiToWithdraw(1000000000000000000)
Info@Attack.sol::fallback Ent ContBal(5000000000000000000)

Info@Attack.sol::fallback Ext ContBal(5000000000000000000)
Info@EtherStore.sol::withdrawFunds Exit ContBal(1000000000000000000)

Info@Attack.sol::fallback Ext ContBal(5000000000000000000)
Info@EtherStore.sol::withdrawFunds Exit ContBal(1000000000000000000)

Info@Attack.sol::fallback Ext ContBal(5000000000000000000)
Info@EtherStore.sol::withdrawFunds Exit ContBal(1000000000000000000)

Info@Attack.sol::fallback Ext ContBal(5000000000000000000)
Info@EtherStore.sol::withdrawFunds Exit ContBal(1000000000000000000)

Info@Attack.sol::fallback Ext ContBal(5000000000000000000)
Info@EtherStore.sol::withdrawFunds Exit ContBal(1000000000000000000)

Info@Attack.sol::pwnEtherStore ContBal(5000000000000000000)
Info@EtherStore.sol::debugPrintBalance ContBal(1000000000000000000)

  debug:EtherStore-Test Exit :: 25310251383.1943116904 +98ms
    ✓ tst-item-001 (100ms)
  debug:EtherStore-Test etherstoreinst balance :: 5.0 +3ms
  debug:EtherStore-Test attackinst balance :: 0.0 +2ms
  debug:EtherStore-Test wallet bal :: 25310251383.1943116904 +2ms

  debug:EtherStore-Test etherstoreinst balance :: 0.0 +63ms
  debug:EtherStore-Test attackinst balance :: 0.0 +2ms
  debug:EtherStore-Test wallet bal :: 25310251388.1938943864 +2ms


  1 passing (555ms)

Done in 8.10s.
```

### EtherStoreFixed ( Fixed with best practise solutions )

```shell
master$ env DEBUG="debug*,info*,error*" yarn run test ./test/EtherStoreFixed.spec.ts
yarn run v1.22.4
$ yarn run test:contracts ./test/EtherStoreFixed.spec.ts
$ cross-env SOLPP_FLAGS="FLAG_IS_TEST,FLAG_IS_DEBUG" buidler test --show-stack-traces ./test/EtherStoreFixed.spec.ts
$(process.argv.length)
All contracts have already been compiled, skipping compilation.


  EtherStore Attack Test
  info:EtherStore-Test Admin :: 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff +0ms
  info:EtherStore-Test Own1 :: 0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 +1ms
  info:EtherStore-Test Own2 :: 0xD1D84F0e28D6fedF03c73151f98dF95139700aa7 +0ms
  debug:EtherStore-Test EtherStore @ 0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA +0ms
  debug:EtherStore-Test Ent wallet bal :: 25310251388.1989044904 +3ms
Info@EtherStoreFixed.sol::fallback ContBal(5000000000000000000)
  debug:EtherStore-Test etherstoreinst balance :: 5.0 +21ms
  debug:EtherStore-Test Ext wallet bal :: 25310251383.1987189784 +2ms
Info@AttackFixed.sol::constructor ContBal(0)
Info@AttackFixed.sol::debugPrintBalance ContBal(0)
  debug:EtherStore-Test Attack @ 0xaC8444e7d45c34110B34Ed269AD86248884E78C7 +89ms
  debug:EtherStore-Test Enter :: 25310251383.1943589864 +3ms
Info@AttackFixed.sol::pwnEtherStore Sender(0x17ec8597ff92c3f44523bdc65bf0f1be632917ff)
Info@AttackFixed.sol::pwnEtherStore Val(1000000000000000000)
Info@AttackFixed.sol::pwnEtherStore ContBal(1000000000000000000)
Info@EtherStoreFixed.sol::debugPrintBalance ContBal(5000000000000000000)
Info@EtherStoreFixed.sol::depositFunds Entry ContBal(6000000000000000000)
Info@EtherStoreFixed.sol::depositFunds Sender(0xac8444e7d45c34110b34ed269ad86248884e78c7)
Info@EtherStoreFixed.sol::depositFunds Val(1000000000000000000)
Info@EtherStoreFixed.sol::depositFunds Exit ContBal(6000000000000000000)
Info@AttackFixed.sol::pwnEtherStore ContBal(0)
Info@EtherStoreFixed.sol::withdrawFunds Entry ContBal(6000000000000000000)
Info@EtherStoreFixed.sol::withdrawFunds Sender(0xac8444e7d45c34110b34ed269ad86248884e78c7)
Info@EtherStoreFixed.sol::withdrawFunds _weiToWithdraw(1000000000000000000)
Info@AttackFixed.sol::fallback Ent ContBal(1000000000000000000)
Info@EtherStoreFixed.sol::withdrawFunds Entry ContBal(5000000000000000000)
Info@EtherStoreFixed.sol::withdrawFunds Sender(0xac8444e7d45c34110b34ed269ad86248884e78c7)
Info@EtherStoreFixed.sol::withdrawFunds _weiToWithdraw(1000000000000000000)
  error:EtherStore-Test Exception Err Error: VM Exception while processing transaction: revert Err Eth Transfer failed +0ms
    ✓ tst-item-001 (60ms)
  debug:EtherStore-Test etherstoreinst balance :: 5.0 +60ms
  debug:EtherStore-Test attackinst balance :: 0.0 +2ms
  debug:EtherStore-Test wallet bal :: 25310251383.1943589864 +3ms
  debug:EtherStore-Test etherstoreinst balance :: 0.0 +68ms
  debug:EtherStore-Test attackinst balance :: 0.0 +3ms
  debug:EtherStore-Test wallet bal :: 25310251388.1939416824 +3ms


  1 passing (528ms)

Done in 8.11s.

```

---
