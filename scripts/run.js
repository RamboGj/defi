async function getBalance(address) {
    const balanceBigDigit = await hre.waffle.provider.getBalance(address)
    return hre.ethers.utils.formatEther(balanceBigDigit)
}

async function printBalances(addresses) {
    let idx = 0
    for (const address of addresses) {
        console.log(`Address ${idx} balance: `, await getBalance(address))
        idx++
    }
}

async function printMemos(memos) {
    for (const memo of memos) {
        const timestamp = memo.timestamp
        const tipper = memo.name
        const tipperAddress = memo.sender
        const message = memo.message
        console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`)
    }
}

const main = async () => {
    // Getting fake wallets from hardhat
    const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners()

    // Deploy smart contract
    const BuyMeACoffe = await hre.ethers.getContractFactory("BuyMeACoffe")
    const BuyMeACoffeDeployed = await BuyMeACoffe.deploy()

    await BuyMeACoffeDeployed.deployed()

    console.log("ADDRESS:", BuyMeACoffeDeployed.address)

    const addresses = [owner.address, tipper.address, BuyMeACoffeDeployed.address]
    console.log("== start ==")
    await printBalances(addresses)

    // Buy coffes
    const tip = {value: hre.ethers.utils.parseEther("1")}
    await BuyMeACoffeDeployed.connect(tipper).buyCoffe("João", "you're the best!", tip)
    await BuyMeACoffeDeployed.connect(tipper2).buyCoffe("André", "incredible!", tip)
    await BuyMeACoffeDeployed.connect(tipper3).buyCoffe("Thiago", "take your coffe dude!", tip)

    console.log("== after bought coffe ==")
    await printBalances(addresses)

    // Withdraw funds for owner
    await BuyMeACoffeDeployed.connect(owner).withdrawTips()

    console.log("== after bought coffe ==")
    const memos = await BuyMeACoffeDeployed.getMemos()
    printMemos(memos)

    // Read all memos
}

const runMain = async () => {
    try {
        await main()
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

runMain()