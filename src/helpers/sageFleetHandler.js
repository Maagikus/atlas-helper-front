import * as anchor from "@project-serum/anchor"
import { BN } from "@project-serum/anchor"
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getAssociatedTokenAddressSync } from "@solana/spl-token"
import { ComputeBudgetProgram, PublicKey } from "@solana/web3.js"
import { readFromRPCOrError, InstructionReturn, createAssociatedTokenAccountIdempotent } from "@staratlas/data-source"
import { CARGO_IDL, CargoPod } from "@staratlas/cargo"
import {
    Fleet,
    MineItem,
    Planet,
    Resource,
    Starbase,
    Sector,
    LoadingBayToIdleInput,
    StartMiningAsteroidInput,
    StopMiningAsteroidInput,
    DepositCargoToFleetInput,
    WithdrawCargoFromFleetInput,
    WarpToCoordinateInput,
    ShipStats,
    CargoStats,
    StarbaseCreateCargoPod,
    StarbasePlayer,
    StarbaseCreateCargoPodInput,
    SageProgram,
} from "@staratlas/sage"
import { SageGameHandler, sageProgram } from "./sageGameHandler"
import { calculateMiningDuration } from "./calcForMovement"
import { UserPoints } from "@staratlas/points"

export class SageFleetHandler {
    _gameHandler
    constructor(_gameHandler) {
        this._gameHandler = _gameHandler
    }

    async getFleetAccount(fleetPubkey) {
        const fleet = await readFromRPCOrError(this._gameHandler.provider.connection, this._gameHandler.program, fleetPubkey, Fleet, "confirmed")
        return fleet
    }
    async getMineItemAccount(mineItemPubkey) {
        const mineItem = readFromRPCOrError(this._gameHandler.provider.connection, this._gameHandler.program, mineItemPubkey, MineItem, "confirmed")

        return mineItem
    }
    async getPlanetAccount(planetPubkey) {
        const planet = readFromRPCOrError(this._gameHandler.provider.connection, this._gameHandler.program, planetPubkey, Planet, "confirmed")

        return planet
    }
    async getResourceAccount(resourcePubkey) {
        const resource = readFromRPCOrError(this._gameHandler.provider.connection, this._gameHandler.program, resourcePubkey, Resource, "confirmed")
        const r = await resource

        return resource
    }
    async getSectorAccount(sectorPubkey) {
        const sector = readFromRPCOrError(this._gameHandler.provider.connection, this._gameHandler.program, sectorPubkey, Sector, "confirmed")

        return sector
    }
    async getStarbaseAccount(starbasePubkey) {
        const starbase = readFromRPCOrError(this._gameHandler.provider.connection, this._gameHandler.program, starbasePubkey, Starbase, "confirmed")

        return starbase
    }
    async execRegisterStarbasePlayer(fleetPubkey) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)
        // TODO: ensure fleet state is "Idle" - is there a better way to do this?
        if (!fleetAccount.state.Idle && !this._gameHandler.game) {
            throw "fleet is not idle (or game is not loaded)"
        }

        const ixs = []

        const coordinates = fleetAccount.state.Idle?.sector

        const starbaseKey = this._gameHandler.getStarbaseAddress(coordinates)

        const starbaseAccount = await this.getStarbaseAccount(starbaseKey)

        const playerProfile = fleetAccount.data.ownerProfile
        const sagePlayerProfile = this._gameHandler.getSagePlayerProfileAddress(playerProfile)
        const program = this._gameHandler.program
        const profileFaction = this._gameHandler.getProfileFactionAddress(playerProfile)
        const gameId = this._gameHandler.gameId
        const gameState = this._gameHandler.gameState
        const bumpArrBuff = new ArrayBuffer(2)
        const bumpData = new DataView(bumpArrBuff)
        bumpData.setUint16(0, starbaseAccount.data.seqId, !0)
        const [starbasePlayer] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("starbase_player"), starbaseKey.toBuffer(), sagePlayerProfile.toBuffer(), new Uint8Array(bumpData.buffer)],
            new PublicKey("SAGE2HAwep459SNq61LHvjxPk4pLPEJLoMETef7f7EE")
        )

        const ix_1 = StarbasePlayer.registerStarbasePlayer(program, profileFaction, sagePlayerProfile, starbaseKey, gameId, gameState, starbaseAccount.data.seqId)

        ixs.push(ix_1)

        const rx = await this._gameHandler.createBuildAndSendTransaction(1, ixs)
        //  console.log('trueeeee');

        if (!rx.value.isOk()) {
            throw "fleet failed register starbase"
        }

        return starbasePlayer
    }
    async ixDockToStarbase(fleetPubkey, playerPubkey) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)

        // TODO: ensure fleet state is "Idle" - is there a better way to do this?
        if (!fleetAccount.state.Idle && !this._gameHandler.game) {
            throw "fleet is not idle (or game is not loaded)"
        }
        const key = playerPubkey
        console.log("key", key)
        const ixs = []

        const coordinates = fleetAccount.state.Idle?.sector

        const starbaseKey = this._gameHandler.getStarbaseAddress(coordinates)

        const starbaseAccount = await this.getStarbaseAccount(starbaseKey)

        const playerProfile = fleetAccount.data.ownerProfile
        //  const sagePlayerProfile = this._gameHandler.getSagePlayerProfileAddress(playerProfile);
        let sagePlayerProfile = await this._gameHandler.getStarbasePlayer(playerProfile, starbaseKey)
        //  console.log('sagePlayerProfile', sagePlayerProfile.publicKey);
        //  console.log('sagePlayerProfile1', sagePlayerProfile1.publicKey);

        sagePlayerProfile = sagePlayerProfile ? sagePlayerProfile.publicKey : await this.execRegisterStarbasePlayer(fleetPubkey)

        //  console.log('sagePlayerProfile', sagePlayerProfile);
        //  let sagePlayerProfile = await this.execRegisterStarbasePlayer(fleetPubkey);
        //  console.log('sagePlayerProfile', sagePlayerProfile);
        //  console.log('sagePlayerProfile', sagePlayerProfile);

        //  const starbasePlayerKey = this._gameHandler.getStarbasePlayerAddress(
        //    starbaseKey,
        //    sagePlayerProfile,
        //    starbaseAccount.data.seqId,
        //  );
        const starbasePlayerKey = sagePlayerProfile

        const program = this._gameHandler.program
        const profileFaction = this._gameHandler.getProfileFactionAddress(playerProfile)
        const fleetKey = fleetAccount.key
        const gameId = this._gameHandler.gameId
        const gameState = this._gameHandler.gameState
        const input = 0 // TODO: when would this change?

        //   const ix_1 = Fleet.idleToLoadingBay(program, key, playerProfile, profileFaction, fleetKey, starbaseKey, starbasePlayerKey, gameId, gameState, input)
        let tx = {
            instruction: await this._gameHandler.program.methods
                .idleToLoadingBay(new BN(0))
                .accountsStrict({
                    gameAccountsFleetAndOwner: {
                        gameFleetAndOwner: {
                            fleetAndOwner: {
                                fleet: fleetKey,
                                owningProfile: playerProfile,
                                owningProfileFaction: profileFaction,
                                key: key,
                            },
                            gameId: gameId,
                        },
                        gameState: gameState,
                    },
                    starbaseAndStarbasePlayer: {
                        starbase: starbaseKey,
                        starbasePlayer: starbasePlayerKey,
                    },
                })
                .remainingAccounts([
                    {
                        pubkey: starbaseKey,
                        isSigner: false,
                        isWritable: false,
                    },
                ])
                .instruction(),
        }
        //   ixs.push(ix_1)
        console.log("tx", tx)
        return tx
    }

    async ixUndockFromStarbase(fleetPubkey) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)

        // TODO: ensure fleet state is "StarbaseLoadingBay" - is there a better way to do this?
        if (!fleetAccount.state.StarbaseLoadingBay && !this._gameHandler.game) {
            throw "fleet is not at starbase loading bay (or game is not loaded)"
        }

        const ixs = []

        const starbaseKey = fleetAccount.state.StarbaseLoadingBay?.starbase
        const starbaseAccount = await this.getStarbaseAccount(starbaseKey)

        const playerProfile = fleetAccount.data.ownerProfile
        const sagePlayerProfile = await this._gameHandler.getSagePlayerProfileAddress(playerProfile)
        const starbasePlayerKey = await this._gameHandler.getStarbasePlayerAddress(starbaseKey, sagePlayerProfile, starbaseAccount.data.seqId)

        const program = this._gameHandler.program
        const key = this._gameHandler.funder
        const profileFaction = this._gameHandler.getProfileFactionAddress(playerProfile)
        const fleetKey = fleetAccount.key
        const gameId = this._gameHandler.gameId
        const gameState = this._gameHandler.gameState
        const input = 0 // TODO: when would this change?

        const ix_1 = Fleet.loadingBayToIdle(program, key, playerProfile, profileFaction, fleetKey, starbaseKey, starbasePlayerKey, gameId, gameState, input)

        ixs.push(ix_1)

        return ixs
    }

    async ixStartMining(fleetPubkey, resource, planetName) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)
        // const fleetFuelTokenAccount = fleetAccount.data.
        // TODO: ensure fleet state is "Idle" - is there a better way to do this?
        if (!fleetAccount.state.Idle && !this._gameHandler.game) {
            throw "fleet is not idle (or game is not loaded)"
        }

        const ixs = []

        const mint = this._gameHandler.getResourceMintAddress(resource)

        if (!mint) {
            throw `resource mint not found for ${resource}`
        }
        const mineItemKey = this._gameHandler.getMineItemAddress(mint)
        // TODO: is there a better way determine if anything is mineable (mint) at this 'location'?
        // see `getPlanetAddress` in sageGameHandler.ts (cache of planet addresses on load)

        const coordinates = fleetAccount.state.Idle?.sector

        //test code with planets

        const starbaseKey = this._gameHandler.getStarbaseAddress(coordinates)

        const starbaseAccount = await this.getStarbaseAccount(starbaseKey)

        const playerProfile = fleetAccount.data.ownerProfile

        const sagePlayerProfile = this._gameHandler.getSagePlayerProfileAddress(playerProfile)
        const starbasePlayerKey = this._gameHandler.getStarbasePlayerAddress(starbaseKey, sagePlayerProfile, starbaseAccount.data.seqId)
        const planetName1 = await this.getPlanetName(fleetPubkey, resource)
        console.log("planetName1", planetName1)
        const planetKey = await this._gameHandler.getPlanetAddress(starbaseAccount.data.sector, this._gameHandler.program, planetName1)

        const resourceKey = this._gameHandler.getResrouceAddress(mineItemKey, planetKey)

        const profileFaction = this._gameHandler.getProfileFactionAddress(playerProfile)
        const fleetKey = fleetAccount.key

        const program = this._gameHandler.program
        const key = this._gameHandler.funder
        const gameState = this._gameHandler.gameState
        const gameId = this._gameHandler.gameId
        const input = { keyIndex: 0 }
        const gameFuelMint = this._gameHandler.game?.data.mints.fuel
        const fleetFuelTank = fleetAccount.data.fuelTank

        const fleetFuelToken = await getAssociatedTokenAddress(gameFuelMint, fleetFuelTank, true)

        const ix_1 = Fleet.startMiningAsteroid(
            program,
            key,
            playerProfile,
            profileFaction,
            fleetKey,
            starbaseKey,
            starbasePlayerKey,
            mineItemKey,
            resourceKey,
            planetKey,
            gameState,
            gameId,
            fleetFuelToken,
            input
        )

        ixs.push(ix_1)

        return ixs
    }

    async ixStopMining(fleetPubkey) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)

        // TODO: ensure fleet state is "MineAsteroid" - is there a better way to do this?
        if (!fleetAccount.state.MineAsteroid && !this._gameHandler.game) {
            throw "fleet is not mining an asteroid (or game is not loaded)"
        }

        const ixs = []

        const gameFoodMint = this._gameHandler.game?.data.mints.food
        const gameAmmoMint = this._gameHandler.game?.data.mints.ammo
        const gameFuelMint = this._gameHandler.game?.data.mints.fuel

        const resourceKey = fleetAccount.state.MineAsteroid?.resource
        const resourceAccount = await this.getResourceAccount(resourceKey)

        const mineItemKey = resourceAccount.data.mineItem // TODO: check if this is the only way to get the 'mineItemKey'
        const mineItemAccount = await this.getMineItemAccount(mineItemKey)
        mineItemAccount.data.resourceHardness
        const mint = mineItemAccount.data.mint // TODO: check if this is the only way get the 'mint'

        const planetKey = fleetAccount.state.MineAsteroid?.asteroid
        const planetAccount = await this.getPlanetAccount(planetKey)

        const coordinates = planetAccount.data.sector // TODO: check if this is the only way get the 'coordinates'
        const starbaseKey = this._gameHandler.getStarbaseAddress(coordinates)

        const cargoHold = fleetAccount.data.cargoHold

        const fleetAmmoBank = fleetAccount.data.ammoBank
        const fleetFuelTank = fleetAccount.data.fuelTank

        const resourceTokenFrom = await getAssociatedTokenAddress(mint, mineItemKey, true)

        const ataResourceTokenTo = createAssociatedTokenAccountIdempotent(mint, cargoHold, true)

        const resourceTokenTo = ataResourceTokenTo.address
        const ix_0 = ataResourceTokenTo.instructions

        ixs.push(ix_0)

        const fleetFoodToken = await getAssociatedTokenAddress(gameFoodMint, cargoHold, true)
        const fleetAmmoToken = await getAssociatedTokenAddress(gameAmmoMint, fleetAmmoBank, true)
        const fleetFuelToken = await getAssociatedTokenAddress(gameFuelMint, fleetFuelTank, true)

        const program = this._gameHandler.program
        const cargoProgram = this._gameHandler.cargoProgram
        const playerProfile = fleetAccount.data.ownerProfile
        const profileFaction = this._gameHandler.getProfileFactionAddress(playerProfile)
        const fleetKey = fleetAccount.key
        const ammoBank = fleetAccount.data.ammoBank
        const foodCargoType = this._gameHandler.getCargoTypeAddress(gameFoodMint)
        const ammoCargoType = this._gameHandler.getCargoTypeAddress(gameAmmoMint)
        const resourceCargoType = this._gameHandler.getCargoTypeAddress(mint)
        const cargoStatsDefinition = this._gameHandler.cargoStatsDefinition
        const gameState = this._gameHandler.gameState
        const gameId = this._gameHandler.gameId
        const foodTokenFrom = fleetFoodToken
        const ammoTokenFrom = fleetAmmoToken
        const foodMint = gameFoodMint
        const ammoMint = gameAmmoMint

        const ix_1 = Fleet.asteroidMiningHandler(
            program,
            cargoProgram,
            fleetKey,
            starbaseKey,
            mineItemKey,
            resourceKey,
            planetKey,
            cargoHold,
            ammoBank,
            foodCargoType,
            ammoCargoType,
            resourceCargoType,
            cargoStatsDefinition,
            gameState,
            gameId,
            foodTokenFrom,
            ammoTokenFrom,
            resourceTokenFrom,
            resourceTokenTo,
            foodMint,
            ammoMint
        )

        ixs.push(ix_1)

        const key = this._gameHandler.funder
        const fuelTank = fleetFuelTank
        const fuelCargoType = this._gameHandler.getCargoTypeAddress(gameFuelMint)
        const fuelTokenFrom = fleetFuelToken
        const fuelMint = gameFuelMint
        const input = { keyIndex: 0 }
        //  const playerProfile = fleetAccount.data.ownerProfile;
        const userXpAccounts = {
            userCouncilRankXpAccounts: {},
            userDataRunningXpAccounts: {},
            userPilotingXpAccounts: {},
            userMiningXpAccounts: {},
        }
        const miningXpCategory = new PublicKey("MineMBxARiRdMh7s1wdStSK4Ns3YfnLjBfvF5ZCnzuw")
        const dataRunningXpCategory = new PublicKey("DataJpxFgHhzwu4zYJeHCnAv21YqWtanEBphNxXBHdEY")
        const councilRankXpCategory = new PublicKey("XPneyd1Wvoay3aAa24QiKyPjs8SUbZnGg5xvpKvTgN9")
        const pilotingXpCategory = new PublicKey("PiLotBQoUBUvKxMrrQbuR3qDhqgwLJctWsXj3uR7fGs")

        await this._gameHandler.buildXpAccounts(miningXpCategory, userXpAccounts, "userMiningXpAccounts", playerProfile)
        await this._gameHandler.buildXpAccounts(pilotingXpCategory, userXpAccounts, "userPilotingXpAccounts", playerProfile)
        await this._gameHandler.buildXpAccounts(councilRankXpCategory, userXpAccounts, "userCouncilRankXpAccounts", playerProfile)
        await this._gameHandler.buildXpAccounts(dataRunningXpCategory, userXpAccounts, "userDataRunningXpAccounts", playerProfile)

        const ix_2 = Fleet.stopMiningAsteroid(
            program,
            cargoProgram,
            this._gameHandler.pointsProgram,
            key,
            playerProfile,
            profileFaction,
            fleetKey,
            mineItemKey,
            resourceKey,
            planetKey,
            fuelTank,
            fuelCargoType,
            cargoStatsDefinition,
            userXpAccounts.userMiningXpAccounts.userPointsAccount,
            userXpAccounts.userMiningXpAccounts.pointsCategory,
            userXpAccounts.userMiningXpAccounts.pointsModifierAccount,
            userXpAccounts.userPilotingXpAccounts.userPointsAccount,
            userXpAccounts.userPilotingXpAccounts.pointsCategory,
            userXpAccounts.userPilotingXpAccounts.pointsModifierAccount,
            userXpAccounts.userCouncilRankXpAccounts.userPointsAccount,
            userXpAccounts.userCouncilRankXpAccounts.pointsCategory,
            userXpAccounts.userCouncilRankXpAccounts.pointsModifierAccount,
            gameState,
            gameId,
            fuelTokenFrom,
            fuelMint,
            input
        )

        ixs.push(ix_2)

        return ixs
    }

    async ixWithdrawCargoFromFleet(fleetPubkey, tokenMint, amount, cargoPodFromKey) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)

        // TODO: ensure fleet state is "StarbaseLoadingBay" - is there a better way to do this?
        if (!fleetAccount.state.StarbaseLoadingBay && !this._gameHandler.game) {
            throw "fleet is not at starbase loading bay (or game is not loaded)"
        }

        const ixs = []

        const playerProfileKey = fleetAccount.data.ownerProfile
        const starbaseKey = fleetAccount.state.StarbaseLoadingBay?.starbase

        const starbaseAccount = await this.getStarbaseAccount(starbaseKey)
        const sagePlayerProfile = this._gameHandler.getSagePlayerProfileAddress(playerProfileKey)
        const starbasePlayerKey = this._gameHandler.getStarbasePlayerAddress(starbaseKey, sagePlayerProfile, starbaseAccount.data.seqId)

        // FIXME: how is this different from `this._gameHandler.cargoProgram`?
        const cargo = this._gameHandler.cargoProgram
        const spbCargoHolds = await cargo.account.cargoPod.all([
            {
                memcmp: {
                    offset: 41,
                    bytes: starbasePlayerKey.toBase58(),
                },
            },
        ])
        let starbasePlayerCargoHolds = spbCargoHolds.find((item) => item.account.openTokenAccounts > 0)
        starbasePlayerCargoHolds = starbasePlayerCargoHolds ? starbasePlayerCargoHolds.publicKey : spbCargoHolds.length > 0 ? spbCargoHolds[0].publicKey : await this.execCreateCargoPod(fleetPubkey)
        //  starbasePlayerCargoHolds =
        //    starbasePlayerCargoHolds.length > 1 ? starbasePlayerCargoHolds[0] : starbasePlayerCargoHolds;

        //  if (spbCargoHolds.length !== 1) {
        //    throw "expected to find one cargo pod for the starbase player";
        //  }

        //  const cargo = this._gameHandler.cargoProgram;
        //  const spbCargoHolds = await cargo.account.cargoPod.all([
        //    {
        //      memcmp: {
        //        offset: 41,
        //        bytes: starbasePlayerKey.toBase58(),
        //      },
        //    },
        //  ]);
        //  //  TEST WITH CARGOPOD
        //  let starbasePlayerCargoHolds = spbCargoHolds.find(
        //    (item) => item.account.openTokenAccounts > 0
        //  );
        //  starbasePlayerCargoHolds = starbasePlayerCargoHolds
        //    ? starbasePlayerCargoHolds
        //    : starbasePlayerCargoHolds.length > 0
        //    ? starbasePlayerCargoHolds[0]
        //    : await this.execCreateCargoPod(fleetPubkey);

        const program = this._gameHandler.program
        const cargoProgram = this._gameHandler.cargoProgram
        const key = this._gameHandler.funder
        const fundsToKey = this._gameHandler.funder.publicKey()
        const profileFactionKey = this._gameHandler.getProfileFactionAddress(playerProfileKey)
        const fleetKey = fleetPubkey

        // TODO: refactor this and along with `ixDepositCargoToFleet`
        //  const cargoPodFromKey = fleetAccount.data.cargoHold;
        const cargoPodToKey = starbasePlayerCargoHolds

        const tokenAccounts = await this._gameHandler.getParsedTokenAccountsByOwner(cargoPodFromKey)
        const tokenAccount = tokenAccounts.find((tokenAccount) => tokenAccount.mint.toBase58() === tokenMint.toBase58())

        if (!tokenAccount) {
            throw "token account not found"
        }
        const t = new BN(parseInt(tokenAccount.amount.toString()))

        amount = new BN(amount.toNumber() === 0 ? t : amount.toNumber())

        const cargoType = this._gameHandler.getCargoTypeAddress(tokenMint)
        const cargoStatsDefinition = this._gameHandler.cargoStatsDefinition
        const gameId = this._gameHandler.gameId
        const gameState = this._gameHandler.gameState
        const input = { keyIndex: 0, amount }

        const tokenFrom = await getAssociatedTokenAddress(tokenMint, cargoPodFromKey, true)
        console.log("tokenMint", tokenMint)
        console.log("cargoPodToKey")
        console.log("tokenMint", tokenMint)
        const ataTokenTo = createAssociatedTokenAccountIdempotent(tokenMint, cargoPodToKey, true)
        const tokenTo = ataTokenTo.address
        const ix_0 = ataTokenTo.instructions

        ixs.push(ix_0)

        const ix_1 = Fleet.withdrawCargoFromFleet(
            program,
            cargoProgram,
            key,
            fundsToKey,
            playerProfileKey,
            profileFactionKey,
            starbaseKey,
            starbasePlayerKey,
            fleetKey,
            cargoPodFromKey,
            cargoPodToKey,
            cargoType,
            cargoStatsDefinition,
            tokenFrom,
            tokenTo,
            tokenMint,
            gameId,
            gameState,
            input
        )

        ixs.push(ix_1)

        return ixs
    }
    async execCreateCargoPod(fleetPubkey) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)

        const ixs = []

        const playerProfileKey = fleetAccount.data.ownerProfile
        const program = this._gameHandler.program
        const cargoProgram = this._gameHandler.cargoProgram
        const key = this._gameHandler.funder
        const fundsToKey = this._gameHandler.funder.publicKey()
        const profileFactionKey = this._gameHandler.getProfileFactionAddress(playerProfileKey)
        const starbaseKey = fleetAccount.state.StarbaseLoadingBay?.starbase
        const starbaseAccount = await this.getStarbaseAccount(starbaseKey)

        const sagePlayerProfile = this._gameHandler.getSagePlayerProfileAddress(playerProfileKey)
        const starbasePlayerKey = this._gameHandler.getStarbasePlayerAddress(starbaseKey, sagePlayerProfile, starbaseAccount.data.seqId)
        const cargoStatsDefinition = this._gameHandler.cargoStatsDefinition
        const gameId = this._gameHandler.gameId
        const gameState = this._gameHandler.gameState
        const input = {
            keyIndex: 0,
            podSeeds: Array.from(fundsToKey.toBuffer()),
        }
        const cargoPodAdress = CargoPod.findAddress(program, fundsToKey.toBuffer())
        const _starbasePod1 = cargoPodAdress[0]
        console.log("_starbasePod1", _starbasePod1)

        //  const cargoPod = await readFromRPCOrError(
        //    this._gameHandler.provider.connection,
        //    this._gameHandler.program,
        //    _starbasePod1,
        //    CargoPod,
        //    'confirmed',
        //  );
        const [cargoPod] = await anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("cargo_pod"), Buffer.from(input.podSeeds)], new PublicKey("Cargo2VNTPPTi9c1vq1Jw5d3BWUNr18MjRtSupAghKEk"))
        console.log("cargoPod ", cargoPod)
        const ix_1 = StarbasePlayer.createCargoPod(program, cargoProgram, starbasePlayerKey, key, playerProfileKey, profileFactionKey, starbaseKey, cargoStatsDefinition, gameId, gameState, input)

        ixs.push(ix_1)

        await this._gameHandler.createBuildAndSendTransaction(10000, ixs)

        return cargoPod
    }
    async getItemsInStarbase(fleetPubkey, tokenMint) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)

        // TODO: ensure fleet state is "StarbaseLoadingBay" - is there a better way to do this?
        if (!fleetAccount.state.StarbaseLoadingBay && !this._gameHandler.game) {
            throw "fleet is not at starbase loading bay (or game is not loaded)"
        }
        const starbaseKey = fleetAccount.state.StarbaseLoadingBay?.starbase

        const starbaseAccount = await this.getStarbaseAccount(starbaseKey)
        const playerProfileKey = fleetAccount.data.ownerProfile

        const sagePlayerProfile = this._gameHandler.getSagePlayerProfileAddress(playerProfileKey)
        const starbasePlayerKey = this._gameHandler.getStarbasePlayerAddress(starbaseKey, sagePlayerProfile, starbaseAccount.data.seqId)
        const cargo = this._gameHandler.cargoProgram
        const spbCargoHolds = await cargo.account.cargoPod.all([
            {
                memcmp: {
                    offset: 41,
                    bytes: starbasePlayerKey.toBase58(),
                },
            },
        ])

        //  let starbasePlayerCargoHold = spbCargoHolds[0];

        const starbasePlayerCargoHold = spbCargoHolds.find((item) => item.account.openTokenAccounts > 0)

        if (!starbasePlayerCargoHold) {
            return -1
        }
        const cargoPodFromKey = starbasePlayerCargoHold.publicKey
        //  const cargoPodFromKey = cargoPodToKey;

        const allItemsInStarbase = await this._gameHandler.getParsedTokenAccountsByOwner(cargoPodFromKey)
        const fuelInStarbase = allItemsInStarbase.find((tokenAccount) => tokenAccount.mint.toBase58() === tokenMint.toBase58())
        const amount = fuelInStarbase ? Number(fuelInStarbase.amount) : 0

        return { allItemsInStarbase, fuelInStarbase: amount }
    }
    async ixDepositCargoToFleet(fleetPubkey, cargoPodToKey, tokenMint, amount) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)

        // TODO: ensure fleet state is "StarbaseLoadingBay" - is there a better way to do this?
        if (!fleetAccount.state.StarbaseLoadingBay && !this._gameHandler.game) {
            throw "fleet is not at starbase loading bay (or game is not loaded)"
        }

        const ixs = []

        const playerProfileKey = fleetAccount.data.ownerProfile

        const starbaseKey = fleetAccount.state.StarbaseLoadingBay?.starbase

        const starbaseAccount = await this.getStarbaseAccount(starbaseKey)

        const sagePlayerProfile = this._gameHandler.getSagePlayerProfileAddress(playerProfileKey)
        const starbasePlayerKey = this._gameHandler.getStarbasePlayerAddress(starbaseKey, sagePlayerProfile, starbaseAccount.data.seqId)

        //  FIXME: how is this different from `this._gameHandler.cargoProgram`?
        //  const cargo = new Program(
        //    CARGO_IDL,
        //    new PublicKey(SageGameHandler.CARGO_PROGRAM_ID),
        //    this._gameHandler.provider
        //  );
        const cargo = this._gameHandler.cargoProgram
        const spbCargoHolds = await cargo.account.cargoPod.all([
            {
                memcmp: {
                    offset: 41,
                    bytes: starbasePlayerKey.toBase58(),
                },
            },
        ])

        //  let starbasePlayerCargoHold = spbCargoHolds[0];

        const starbasePlayerCargoHold = spbCargoHolds.find((item) => item.account.openTokenAccounts > 0)

        //  starbasePlayerCargoHolds =
        //    starbasePlayerCargoHolds.length > 1 ? starbasePlayerCargoHolds[0] : starbasePlayerCargoHolds;

        const program = this._gameHandler.program

        const cargoProgram = this._gameHandler.cargoProgram

        const key = this._gameHandler.funder
        const fundsToKey = this._gameHandler.funder.publicKey()
        const profileFactionKey = this._gameHandler.getProfileFactionAddress(playerProfileKey)
        const fleetKey = fleetPubkey

        // TODO: refactor this and along with `ixWithdrawCargoFromFleet`

        const cargoPodFromKey = starbasePlayerCargoHold.publicKey
        //  const cargoPodFromKey = cargoPodToKey;

        const tokenAccounts = await this._gameHandler.getParsedTokenAccountsByOwner(cargoPodFromKey)
        const tokenAccount = tokenAccounts.find((tokenAccount) => tokenAccount.mint.toBase58() === tokenMint.toBase58())

        if (!tokenAccount) {
            throw "token account not found"
        }
        amount = new BN(amount)

        const cargoType = this._gameHandler.getCargoTypeAddress(tokenMint)

        const cargoStatsDefinition = this._gameHandler.cargoStatsDefinition
        const gameId = this._gameHandler.gameId
        const gameState = this._gameHandler.gameState

        const input = { keyIndex: 0, amount }

        //  const tokenFrom = await getAssociatedTokenAddress(tokenMint, cargoPodFromKey, true);
        const tokenFrom = getAssociatedTokenAddressSync(tokenMint, cargoPodFromKey, true)
        const tokenTo = getAssociatedTokenAddressSync(tokenMint, cargoPodToKey, true)

        const ataTokenTo = createAssociatedTokenAccountIdempotent(tokenMint, cargoPodToKey, true)

        //  const tokenTo = ataTokenTo.address;

        const ix_0 = ataTokenTo.instructions

        ixs.push(ix_0)

        const ix_1 = Fleet.depositCargoToFleet(
            program,
            cargoProgram,
            key,
            playerProfileKey,
            profileFactionKey,
            fundsToKey,
            starbaseKey,
            starbasePlayerKey,
            fleetKey,
            cargoPodFromKey,
            cargoPodToKey,
            cargoType,
            cargoStatsDefinition,
            tokenFrom,
            tokenTo,
            tokenMint,
            gameId,
            gameState,
            input
        )
        //  console.log('ix_1', ix_1);

        ixs.push(ix_1)

        return ixs
    }
    async getCurrentFuelValue(fleetPubkey, tokenMint, cargoItem) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)
        const tokenAccounts = await this._gameHandler.getParsedTokenAccountsByOwner(cargoItem)

        const tokenAccount = tokenAccounts.find((item) => item.mint.toBase58() === tokenMint.toBase58())
        const mintAmount = tokenAccount ? Number(tokenAccount.amount.toString()) : 0
        return mintAmount
    }
    async getCurrentFuelValueInCargo(fleetPubkey, tokenMint) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)
        const playerProfileKey = fleetAccount.data.ownerProfile
        const starbaseKey = fleetAccount.state.StarbaseLoadingBay?.starbase

        const starbaseAccount = await this.getStarbaseAccount(starbaseKey)

        const sagePlayerProfile = this._gameHandler.getSagePlayerProfileAddress(playerProfileKey)
        const starbasePlayerKey = this._gameHandler.getStarbasePlayerAddress(starbaseKey, sagePlayerProfile, starbaseAccount.data.seqId)
        const cargo = this._gameHandler.cargoProgram

        const spbCargoHolds = await cargo.account.cargoPod.all([
            {
                memcmp: {
                    offset: 41,
                    bytes: starbasePlayerKey.toBase58(),
                },
            },
        ])

        let starbasePlayerCargoHolds = spbCargoHolds.find((item) => item.account.openTokenAccounts > 0)

        starbasePlayerCargoHolds = starbasePlayerCargoHolds ? starbasePlayerCargoHolds.publicKey : spbCargoHolds.length > 0 ? spbCargoHolds[0].publicKey : await this.execCreateCargoPod(fleetPubkey)

        const cargoPodFromKey = starbasePlayerCargoHolds

        const tokenAccounts = await this._gameHandler.getParsedTokenAccountsByOwner(fleetAccount.data.cargoHold)
        //  console.log('tokenAccounts', tokenAccounts);
        const tokenAccount = tokenAccounts.find((tokenAccount) => tokenAccount.mint.toBase58() === tokenMint.toBase58())
        if (tokenAccount) {
            const currentFuelAmount = Number(tokenAccount.amount.toString())
            return currentFuelAmount
        }
        return 0
    }
    async ixWarpToCoordinate(fleetPubkey, coordinates) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)

        // TODO: ensure fleet state is "Idle" - is there a better way to do this?
        if (!fleetAccount.state.Idle && !this._gameHandler.game) {
            throw "fleet is not idle (or game is not loaded)"
        }

        const ixs = []

        const _ = this._gameHandler.getSectorAddress(coordinates)

        const gameFuelMint = this._gameHandler.game?.data.mints.fuel

        const program = this._gameHandler.program
        const key = this._gameHandler.funder
        const playerProfile = fleetAccount.data.ownerProfile
        const profileFaction = this._gameHandler.getProfileFactionAddress(playerProfile)
        const fleetKey = fleetPubkey
        const fleetFuelTank = fleetAccount.data.fuelTank
        const fuelCargoType = this._gameHandler.getCargoTypeAddress(gameFuelMint)
        const cargoStatsDefinition = this._gameHandler.cargoStatsDefinition
        const tokenMint = gameFuelMint
        const tokenFrom = await getAssociatedTokenAddress(tokenMint, fleetFuelTank, true)
        const gameState = this._gameHandler.gameState
        const gameId = this._gameHandler.gameId
        const cargoProgram = this._gameHandler.cargoProgram
        const input = {
            keyIndex: 0, // FIXME: This is the index of the wallet used to sign the transaction in the permissions list of the player profile being used.
            toSector: coordinates,
        }

        const ix_1 = Fleet.warpToCoordinate(
            program,
            key,
            playerProfile,
            profileFaction,
            fleetKey,
            fleetFuelTank,
            fuelCargoType,
            cargoStatsDefinition,
            tokenFrom,
            tokenMint,
            gameState,
            gameId,
            cargoProgram,
            input
        )

        ixs.push(ix_1)

        return ixs
    }
    async ixSubWarpToCoordinate(fleetPubkey, coordinates) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)

        // TODO: ensure fleet state is "Idle" - is there a better way to do this?
        if (!fleetAccount.state.Idle && !this._gameHandler.game) {
            throw "fleet is not idle (or game is not loaded)"
        }

        const ixs = []

        const _ = this._gameHandler.getSectorAddress(coordinates)

        const gameFuelMint = this._gameHandler.game?.data.mints.fuel

        const program = this._gameHandler.program
        const key = this._gameHandler.funder
        const playerProfile = fleetAccount.data.ownerProfile
        const profileFaction = this._gameHandler.getProfileFactionAddress(playerProfile)
        const fleetKey = fleetPubkey
        const fleetFuelTank = fleetAccount.data.fuelTank
        const fuelCargoType = this._gameHandler.getCargoTypeAddress(gameFuelMint)
        const cargoStatsDefinition = this._gameHandler.cargoStatsDefinition
        const tokenMint = gameFuelMint
        const tokenFrom = await getAssociatedTokenAddress(tokenMint, fleetFuelTank, true)
        const gameState = this._gameHandler.gameState
        const gameId = this._gameHandler.gameId
        const cargoProgram = this._gameHandler.cargoProgram
        const input = {
            keyIndex: 0, // FIXME: This is the index of the wallet used to sign the transaction in the permissions list of the player profile being used.
            toSector: coordinates,
        }

        const ix_1 = Fleet.startSubwarp(program, key, playerProfile, profileFaction, fleetKey, gameId, gameState, input)

        ixs.push(ix_1)

        return ixs
    }
    async getSubwarpTime(fleetPubkey, coordinatesFrom, coordinatesTo) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)

        const fleetStats = fleetAccount.data.stats

        const time = Fleet.calculateSubwarpTimeWithCoords(fleetStats, coordinatesFrom, coordinatesTo)
        return time
    }
    async ixReadyToExitWarp(fleetPubkey) {
        const ixs = []
        const fleetAccount = await this.getFleetAccount(fleetPubkey)

        const gameId = this._gameHandler.gameId
        const playerProfile = fleetAccount.data.ownerProfile
        const userXpAccounts = {
            userCouncilRankXpAccounts: {},
            userDataRunningXpAccounts: {},
            userPilotingXpAccounts: {},
            userMiningXpAccounts: {},
        }
        const miningXpCategory = new PublicKey("MineMBxARiRdMh7s1wdStSK4Ns3YfnLjBfvF5ZCnzuw")
        const dataRunningXpCategory = new PublicKey("DataJpxFgHhzwu4zYJeHCnAv21YqWtanEBphNxXBHdEY")
        const councilRankXpCategory = new PublicKey("XPneyd1Wvoay3aAa24QiKyPjs8SUbZnGg5xvpKvTgN9")
        const pilotingXpCategory = new PublicKey("PiLotBQoUBUvKxMrrQbuR3qDhqgwLJctWsXj3uR7fGs")

        await this._gameHandler.buildXpAccounts(miningXpCategory, userXpAccounts, "userMiningXpAccounts", playerProfile)
        await this._gameHandler.buildXpAccounts(pilotingXpCategory, userXpAccounts, "userPilotingXpAccounts", playerProfile)
        await this._gameHandler.buildXpAccounts(councilRankXpCategory, userXpAccounts, "userCouncilRankXpAccounts", playerProfile)
        await this._gameHandler.buildXpAccounts(dataRunningXpCategory, userXpAccounts, "userDataRunningXpAccounts", playerProfile)
        const [progressionConfigAcct] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("ProgressionConfig"), gameId.toBuffer()],
            new PublicKey("SAGE2HAwep459SNq61LHvjxPk4pLPEJLoMETef7f7EE")
        )

        const ix_1 = Fleet.fleetStateHandler(this._gameHandler.program, fleetPubkey, [
            {
                pubkey: userXpAccounts.userPilotingXpAccounts.userPointsAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: userXpAccounts.userPilotingXpAccounts.pointsCategory,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: userXpAccounts.userPilotingXpAccounts.pointsModifierAccount,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: userXpAccounts.userCouncilRankXpAccounts.userPointsAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: userXpAccounts.userCouncilRankXpAccounts.pointsCategory,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: userXpAccounts.userCouncilRankXpAccounts.pointsModifierAccount,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: playerProfile,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: progressionConfigAcct,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: gameId,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: new PublicKey("Point2iBvz7j5TMVef8nEgpmz4pDr7tU7v3RjAfkQbM"),
                isSigner: false,
                isWritable: false,
            },
        ])

        ixs.push(ix_1)

        return ixs
    }
    async ixReadyToExitSubwarp(fleetPubkey, from, to) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)
        if (!fleetAccount.state.Idle && !this._gameHandler.game) {
            throw "fleet is not idle (or game is not loaded)"
        }

        const gameId = this._gameHandler.gameId
        const playerProfile = fleetAccount.data.ownerProfile
        const userXpAccounts = {
            userCouncilRankXpAccounts: {},
            userDataRunningXpAccounts: {},
            userPilotingXpAccounts: {},
            userMiningXpAccounts: {},
        }
        const miningXpCategory = new PublicKey("MineMBxARiRdMh7s1wdStSK4Ns3YfnLjBfvF5ZCnzuw")
        const dataRunningXpCategory = new PublicKey("DataJpxFgHhzwu4zYJeHCnAv21YqWtanEBphNxXBHdEY")
        const councilRankXpCategory = new PublicKey("XPneyd1Wvoay3aAa24QiKyPjs8SUbZnGg5xvpKvTgN9")
        const pilotingXpCategory = new PublicKey("PiLotBQoUBUvKxMrrQbuR3qDhqgwLJctWsXj3uR7fGs")

        await this._gameHandler.buildXpAccounts(miningXpCategory, userXpAccounts, "userMiningXpAccounts", playerProfile)
        await this._gameHandler.buildXpAccounts(pilotingXpCategory, userXpAccounts, "userPilotingXpAccounts", playerProfile)
        await this._gameHandler.buildXpAccounts(councilRankXpCategory, userXpAccounts, "userCouncilRankXpAccounts", playerProfile)
        await this._gameHandler.buildXpAccounts(dataRunningXpCategory, userXpAccounts, "userDataRunningXpAccounts", playerProfile)
        const [progressionConfigAcct] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("ProgressionConfig"), gameId.toBuffer()],
            new PublicKey("SAGE2HAwep459SNq61LHvjxPk4pLPEJLoMETef7f7EE")
        )

        const ixs = []

        //  const _ = this._gameHandler.getSectorAddress(coordinates);

        const gameFuelMint = this._gameHandler.game?.data.mints.fuel

        const program = this._gameHandler.program

        //  const playerProfile = fleetAccount.data.ownerProfile;

        const fleetKey = fleetPubkey

        const fleetFuelTank = fleetAccount.data.fuelTank
        const fleetFuelToken = fleetAccount.data
        const fuelCargoType = this._gameHandler.getCargoTypeAddress(gameFuelMint)
        const cargoStatsDefinition = this._gameHandler.cargoStatsDefinition

        //  const gameId = this._gameHandler.account.mints.fuel ;
        const cargoProgram = this._gameHandler.cargoProgram

        //  const input = {
        //    keyIndex: 0, // FIXME: This is the index of the wallet used to sign the transaction in the permissions list of the player profile being used.
        //    toSector: coordinates,
        //  } ;
        //  const gameFuelMint = this._gameHandler.game?.data.mints.fuel ;
        const tokenMint = gameFuelMint
        const tokenFrom = await getAssociatedTokenAddress(tokenMint, fleetFuelTank, true)

        const ix_1 = Fleet.fleetStateHandler(program, fleetKey, [
            {
                pubkey: playerProfile,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: fleetFuelTank,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: fuelCargoType,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: cargoStatsDefinition,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: tokenFrom,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: gameFuelMint,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: userXpAccounts.userPilotingXpAccounts.userPointsAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: userXpAccounts.userPilotingXpAccounts.pointsCategory,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: userXpAccounts.userPilotingXpAccounts.pointsModifierAccount,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: userXpAccounts.userCouncilRankXpAccounts.userPointsAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: userXpAccounts.userCouncilRankXpAccounts.pointsCategory,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: userXpAccounts.userCouncilRankXpAccounts.pointsModifierAccount,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: progressionConfigAcct,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: gameId,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: new PublicKey("Point2iBvz7j5TMVef8nEgpmz4pDr7tU7v3RjAfkQbM"),
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: new PublicKey("Cargo2VNTPPTi9c1vq1Jw5d3BWUNr18MjRtSupAghKEk"),
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: TOKEN_PROGRAM_ID,
                isSigner: false,
                isWritable: false,
            },
        ])
        ixs.push(ix_1)

        return ixs
    }
    async calculateAsteroidMiningAmmoToConsume(fleetPubkey) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)

        const fleetStats = fleetAccount.data.stats
        return Fleet.calculateAsteroidMiningAmmoToConsume(fleetStats, 104, 20)
    }
    async getPlanetName(fleet, resource) {
        const fleetAccount = await this.getFleetAccount(fleet)
        let coords
        if (fleetAccount.state.StarbaseLoadingBay) {
            const starbase = fleetAccount.state.StarbaseLoadingBay.starbase
            // const starbaseAccount = await this.getStarbaseAccount(starbase);
            // is it cheaper to just use the starbase account instead of filtering starbases and find sector?
            // console.log('starbaseAccount', starbaseAccount.data.sector);

            const coordinates = await this._gameHandler.getAllStarbases()
            const filtered = coordinates.find((i) => {
                return i.publicKey.toBase58() === starbase.toBase58()
            })
            coords = filtered.account.sector
        } else {
            coords = fleetAccount.state.Idle.sector.map(Number)
        }

        const planets = await this._gameHandler.getPlanetsFromCoords(coords[0], coords[1])
        const mint = this._gameHandler.getResourceMintAddress(resource)
        const mineItemKey = this._gameHandler.getMineItemAddress(mint)
        let sageResource = null
        let planet = null
        for (const planetCheck of planets) {
            const resourceCheck = await this._gameHandler.program.account.resource.all([
                {
                    memcmp: {
                        offset: 41,
                        bytes: planetCheck.publicKey,
                    },
                },
                {
                    memcmp: {
                        offset: 73,
                        bytes: mineItemKey,
                    },
                },
            ])
            if (sageResource === null && resourceCheck.length > 0) {
                ;[sageResource] = resourceCheck
                planet = planetCheck
            }
        }
        let systemRichness = 0
        if (sageResource && sageResource.account) {
            systemRichness = sageResource.account.systemRichness
        }
        const name = planet.account.name
        const buffer = Buffer.from(name)
        const planetName = buffer.toString("utf8")
        return planetName
    }
    async getMiningDuration(fleetPubkey, resource, planet) {
        const fleetAccount = await this.getFleetAccount(fleetPubkey)

        const tokenAccounts = await this._gameHandler.getParsedTokenAccountsByOwner(fleetAccount.data.cargoHold)

        const cargoCnt = tokenAccounts.reduce((n, account) => n + Number(account.amount.toString()), 0)

        const resKey = this._gameHandler.getResourceMintAddress(resource)
        const { resourceHardness, mineItem } = await this._gameHandler.getMineItem(fleetPubkey, resKey)
        //  const systemRichness = await this._gameHandler.getSystemR();
        const planetName = await this.getPlanetName(fleetPubkey, resource)
        const planets = await this._gameHandler.getPlanetAccount(planetName)
        //  console.log('planets', Number(planets.account.amountMined));
        const systemRichness = await this._gameHandler.getsystemRichness(planets.publicKey, mineItem)

        const cargoStats = fleetAccount.data.stats.cargoStats
        console.log("cargoStats.cargoCapacity", cargoStats.cargoCapacity)
        console.log("cargoCnt", cargoCnt)
        const miningDuration = calculateMiningDuration(cargoStats.cargoCapacity - cargoCnt, cargoStats.miningRate, resourceHardness, systemRichness)
        let ammoForDuration = Math.ceil(miningDuration * (cargoStats.ammoConsumptionRate / 10000))

        ammoForDuration = Math.min(cargoStats.ammoCapacity, ammoForDuration)

        const mineEnd = new Date(Date.now() + miningDuration * 1000)

        const foodForDuration = Math.max(Math.ceil((miningDuration - 10) * (cargoStats.foodConsumptionRate / 10000)), 0)
        const timeForMining = Math.round((miningDuration * 1000) / 60000)

        return { timeForMining, ammoForDuration, foodForDuration }
    }
}
