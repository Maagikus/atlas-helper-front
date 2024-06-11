import { AnchorProvider, BN, Program, web3 } from "@project-serum/anchor"
import { Connection, Keypair, PublicKey } from "@solana/web3.js"
import bs58 from "bs58"
import { CARGO_IDL, CargoType } from "@staratlas/cargo"
import {
    AsyncSigner,
    getParsedTokenAccountsByOwner,
    InstructionReturn,
    keypairToAsyncSigner,
    readFromRPCOrError,
    sendTransaction,
    byteArrayToString,
    stringToByteArray,
    TransactionReturn,
    readAllFromRPC,
    buildAndSignTransaction,
} from "@staratlas/data-source"
// import { buildAndSignTransaction } from './transactionHelper';
import { PlayerProfileIDL, PLAYER_PROFILE_IDL } from "@staratlas/player-profile"
import { ProfileFactionAccount, PROFILE_FACTION_IDL } from "@staratlas/profile-faction"
import { SAGE_IDL, Fleet, Game, GameState, MineItem, PlanetType, Resource, SagePlayerProfile, Sector, Starbase, StarbasePlayer } from "@staratlas/sage"
import { POINTS_IDL } from "@staratlas/points"
import { CRAFTING_IDL } from "@staratlas/crafting"

const findGame = async (provider, connection) => {
    const program = await sageProgram(provider)
    const game = await program.account.game.all()

    return game
}
export const sageProgram = async (provider) => {
    return new Program(SAGE_IDL, SageGameHandler.SAGE_PROGRAM_ID, provider)
}
function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}
const findAllPlanets = async (provider) => {
    const program = await sageProgram(provider)
    const planets = await program.account.planet.all([
        {
            memcmp: {
                offset: 9,
                bytes: bs58.encode(Buffer.from("UST-1-3")),
            },
        },
    ])

    return planets
}

export class SageGameHandler {
    // https://build.staratlas.com/dev-resources/mainnet-program-ids
    //   static readonly SAGE_PROGRAM_ID = 'SAGEqqFewepDHH6hMDcmWy7yjHPpyKLDnRXKb3Ki8e6';
    //   static readonly CARGO_PROGRAM_ID = 'Cargo8a1e6NkGyrjy4BQEW4ASGKs9KSyDyUrXMfpJoiH';
    //   static readonly PLAYER_PROFILE_PROGRAM_ID = 'pprofELXjL5Kck7Jn5hCpwAL82DpTkSYBENzahVtbc9';
    //   static readonly PROFILE_FACTION_PROGRAM_ID = 'pFACSRuobDmvfMKq1bAzwj27t6d2GJhSCHb1VcfnRmq';

    static SAGE_PROGRAM_ID = "SAGE2HAwep459SNq61LHvjxPk4pLPEJLoMETef7f7EE"
    static CARGO_PROGRAM_ID = "Cargo2VNTPPTi9c1vq1Jw5d3BWUNr18MjRtSupAghKEk"
    static PLAYER_PROFILE_PROGRAM_ID = "pprofELXjL5Kck7Jn5hCpwAL82DpTkSYBENzahVtbc9"
    static PROFILE_FACTION_PROGRAM_ID = "pFACSRuobDmvfMKq1bAzwj27t6d2GJhSCHb1VcfnRmq"
    static POINTS_PROGRAM_ID = "Point2iBvz7j5TMVef8nEgpmz4pDr7tU7v3RjAfkQbM"
    static CRAFTING_PROGRAM_ID = "CRAFT2RPXPJWCEix4WpJST3E7NLf79GTqZUL75wngXo5"

    static SAGE_RESOURCES_MINTS = {
        arco: new PublicKey("ARCoQ9dndpg6wE2rRexzfwgJR3NoWWhpcww3xQcQLukg"),
        biomass: new PublicKey("MASS9GqtJz6ABisAxcUn3FeR4phMqH1XfG6LPKJePog"),
        carbon: new PublicKey("CARBWKWvxEuMcq3MqCxYfi7UoFVpL9c4rsQS99tw6i4X"),
        diamond: new PublicKey("DMNDKqygEN3WXKVrAD4ofkYBc4CKNRhFUbXP4VK7a944"),
        hydrogen: new PublicKey("HYDR4EPHJcDPcaLYUcNCtrXUdt1PnaN4MvE655pevBYp"),
        iron_ore: new PublicKey("FeorejFjRRAfusN9Fg3WjEZ1dRCf74o6xwT5vDt3R34J"),
        lumanite: new PublicKey("LUMACqD5LaKjs1AeuJYToybasTXoYQ7YkxJEc4jowNj"),
        rochinol: new PublicKey("RCH1Zhg4zcSSQK8rw2s6rDMVsgBEWa4kiv1oLFndrN5"),
        fuel: new PublicKey("fueL3hBZjLLLJHiFH9cqZoozTG3XQZ53diwFPwbzNim"),
        food: new PublicKey("foodQJAztMzX1DKpLaiounNe2BDMds5RNuPC6jsNrDG"),
        ammo: new PublicKey("ammoK8AkX2wnebQb35cDAZtTkvsXQbi82cGeTnUvvfK"),
        framework: new PublicKey("FMWKb7YJA5upZHbu5FjVRRoxdDw2FYFAu284VqUGF9C2"),
        polymer: new PublicKey("PoLYs2hbRt5iDibrkPT9e6xWuhSS45yZji5ChgJBvcB"),
        copper_ore: new PublicKey("CUore1tNkiubxSwDEtLc3Ybs1xfWLs8uGjyydUYZ25xc"),
        magnet: new PublicKey("MAGNMDeDJLvGAnriBvzWruZHfXNwWHhxnoNF75AQYM5"),
        copper: new PublicKey("CPPRam7wKuBkYzN5zCffgNU17RKaeMEns4ZD83BqBVNR"),
        graphene: new PublicKey("GRAPHKGoKtXtdPBx17h6fWopdT5tLjfAP8cDJ1SvvDn4"),
        electromagnet: new PublicKey("EMAGoQSP89CJV5focVjrpEuE4CeqJ4k1DouQW7gUu7yX"),
        electronics: new PublicKey("ELECrjC8m9GxCqcm4XCNpFvkS8fHStAvymS6MJbe3XLZ"),
        crystalLattice: new PublicKey("CRYSNnUd7cZvVfrEVtVNKmXiCPYdZ1S5pM5qG2FDVZHF"),
        radiationAbsorber: new PublicKey("RABSXX6RcqJ1L5qsGY64j91pmbQVbsYRQuw1mmxhxFe"),
        particleAccelerator: new PublicKey("PTCLSWbwZ3mqZqHAporphY2ofio8acsastaHfoP87Dc"),
        powerSource: new PublicKey("PoWRYJnw3YDSyXgNtN3mQ3TKUMoUSsLAbvE8Ejade3u"),
        Silica: new PublicKey("SiLiCA4xKGkyymB5XteUVmUeLqE4JGQTyWBpKFESLgh"),
        Nitrogen: new PublicKey("Nitro6idW5JCb2ysUPGUAvVqv3HmUR7NVH7NdybGJ4L"),
        TitaniumOre: new PublicKey("tiorehR1rLfeATZ96YoByUkvNFsBfUUSQWgSH2mizXL"),
        Titanium: new PublicKey("TTNM1SMkM7VKtyPW6CNBZ4cg3An3zzQ8NVLS2HpMaWL"),
        SuperConductor: new PublicKey("CoNDDRCNxXAMGscCdejioDzb6XKxSzonbWb36wzSgp5T"),
        Steel: new PublicKey("STEELXLJ8nfJy3P4aNuGxyNRbWPohqHSwxY75NsJRGG"),
        Aerogel: new PublicKey("aeroBCMu6AX6bCLYd1VQtigqZh8NGSjn54H1YSczHeJ"),
        Toolkit: new PublicKey("tooLsNYLiVqzg8o4m3L2Uetbn62mvMWRqkog6PQeYKL"),
        StrangeEmitter: new PublicKey("EMiTWSLgjDVkBbLFaMcGU6QqFWzX9JX6kqs1UtUjsmJA"),
        PowerSource: new PublicKey("PoWRYJnw3YDSyXgNtN3mQ3TKUMoUSsLAbvE8Ejade3u"),
        Iron: new PublicKey("ironxrUhTEaBiR9Pgp6hy4qWx6V2FirDoXhsFP25GFP"),
        ParticleAccelerator: new PublicKey("PTCLSWbwZ3mqZqHAporphY2ofio8acsastaHfoP87Dc"),
        CrystalLattice: new PublicKey("CRYSNnUd7cZvVfrEVtVNKmXiCPYdZ1S5pM5qG2FDVZHF"),
        CopperWire: new PublicKey("cwirGHLB2heKjCeTy4Mbp4M443fU4V7vy2JouvYbZna"),
        EnergySubstrate: new PublicKey("SUBSVX9LYiPrzHeg2bZrqFSDSKkrQkiCesr6SjtdHaX"),
        SurveyDataUnit: new PublicKey("SDUsgfSZaDhhZ76U3ZgvtFiXsfnHbf2VrzYxjBZ5YbM"),
        FieldStabilizer: new PublicKey("FiELD9fGaCgiNMfzQKKZD78wxwnBHTwjiiJfsieb6VGb"),
    }

    ready

    program
    craftingProgram
    playerProfileProgram
    profileFactionProgram
    cargoProgram

    connection
    provider

    funder
    gameId
    gameState
    cargoStatsDefinition
    cargoStatsDefinitionSeqId
    craftingDomain
    mints
    pointsProgram
    game
    planetLookup

    constructor(connection, provider) {
        this.connection = connection
        this.provider = provider
        this.program = new Program(SAGE_IDL, new PublicKey(SageGameHandler.SAGE_PROGRAM_ID), this.provider)
        this.pointsProgram = new Program(POINTS_IDL, SageGameHandler.POINTS_PROGRAM_ID, this.provider)
        this.cargoProgram = new Program(CARGO_IDL, new PublicKey(SageGameHandler.CARGO_PROGRAM_ID), this.provider)
        this.craftingProgram = new Program(CRAFTING_IDL, new PublicKey(SageGameHandler.CRAFTING_PROGRAM_ID), this.provider)
        this.playerProfileProgram = new Program(PLAYER_PROFILE_IDL, new PublicKey(SageGameHandler.PLAYER_PROFILE_PROGRAM_ID), this.provider)
        this.profileFactionProgram = new Program(PROFILE_FACTION_IDL, new PublicKey(SageGameHandler.PROFILE_FACTION_PROGRAM_ID), this.provider)

        this.ready = Promise.all([findGame(this.provider, this.connection), findAllPlanets(this.provider)]).then((result) => {
            const [game] = result[0]
            const planets = result[1]

            this.gameId = game.publicKey

            this.gameState = game.account.gameState
            this.cargoStatsDefinition = game.account.cargo.statsDefinition
            this.cargoStatsDefinitionSeqId = 0 // TODO: note this could change if updated by team, would need to look-up new value in Cargo program
            this.craftingDomain = game.account.crafting.domain
            this.mints = game.account.mints

            this.planetLookup = planets.reduce((lookup, planetAccount) => {
                const pubkey = planetAccount.publicKey
                const planet = planetAccount.account

                if (planet.planetType === PlanetType.AsteroidBelt) {
                    const sector = planet.sector.toString()
                    lookup[sector] = pubkey
                }

                return lookup
            }, {})

            return Promise.resolve("ready")
        })
    }

    async getPlanetAccount(planetName) {
        const program = await sageProgram(this.provider)

        const [planet] = await program.account.planet.all([
            {
                memcmp: {
                    offset: 9,
                    bytes: bs58.encode(Buffer.from(planetName)),
                },
            },
        ])

        return planet
    }

    async buildXpAccounts(xpCategory, userXpAccounts, userXpAccountGroup, userProfileAcct) {
        const [userXpAccount] = web3.PublicKey.findProgramAddressSync(
            [Buffer.from("UserPointsAccount"), xpCategory.toBuffer(), userProfileAcct.toBuffer()],
            new PublicKey(SageGameHandler.POINTS_PROGRAM_ID)
        )

        const [pointsModifierAccount] = await this.pointsProgram.account.pointsModifier.all([
            {
                memcmp: {
                    offset: 9,
                    bytes: xpCategory.toBase58(),
                },
            },
        ])

        userXpAccounts[userXpAccountGroup] = {
            userPointsAccount: userXpAccount,
            pointsCategory: xpCategory,
            pointsModifierAccount: pointsModifierAccount.publicKey,
        }
        return userXpAccounts[userXpAccountGroup]
    }
    async getPlayerProfileAddress(playerPubkey) {
        const [accountInfo] = await this.connection.getProgramAccounts(new PublicKey(SageGameHandler.PLAYER_PROFILE_PROGRAM_ID), {
            filters: [
                {
                    memcmp: {
                        offset: 30,
                        bytes: playerPubkey.toBase58(),
                    },
                },
            ],
        })

        return accountInfo.pubkey
    }

    getCargoTypeAddress(mint) {
        //  if (!this.cargoStatsDefinition || !this.cargoStatsDefinitionSeqId) {
        //    throw 'this.cargoStatsDefinition not set (or missing SeqId)';
        //  }

        const [cargoType] = CargoType.findAddress(this.cargoProgram, this.cargoStatsDefinition, mint, this.cargoStatsDefinitionSeqId)

        return cargoType
    }

    getFleetAddress(playerProfile, fleetName) {
        if (!this.gameId) {
            throw "this.gameId not set"
        }

        const fleetLabel = stringToByteArray(fleetName, 32)
        const [fleet] = Fleet.findAddress(this.program, this.gameId, playerProfile, fleetLabel)

        return fleet
    }

    getMineItemAddress(mint) {
        if (!this.gameId) {
            throw "this.gameId not set"
        }

        const [mineItem] = MineItem.findAddress(this.program, this.gameId, mint)

        return mineItem
    }

    async getPlanetAddress(coordinates, program, locationName) {
        if (!this.planetLookup) {
            throw "this.planetLookup not set"
        }

        const planetName = locationName // AsteroidBelt (F3cyHZYLmZZMTi1zJMpGigj3ictSTV4UCg8M2X2ur9wJ)
        const planetNameBs58 = bs58.encode(Buffer.from(planetName))
        const [planet] = await program.account.planet.all([
            {
                memcmp: {
                    offset: 9, // 8 (discriminator) + 1 (version)
                    bytes: planetNameBs58, // name
                },
            },
        ])

        return planet.publicKey
    }
    async getPlanetsFromCoords(x, y) {
        return new Promise(async (resolve) => {
            const xBN = new BN(x)
            const xArr = xBN.toTwos(64).toArrayLike(Buffer, "le", 8)
            const x58 = bs58.encode(xArr)
            const yBN = new BN(y)
            const yArr = yBN.toTwos(64).toArrayLike(Buffer, "le", 8)
            const y58 = bs58.encode(yArr)
            const planets = await this.program.account.planet.all([
                {
                    memcmp: {
                        offset: 105,
                        bytes: x58,
                    },
                },
                {
                    memcmp: {
                        offset: 113,
                        bytes: y58,
                    },
                },
            ])
            resolve(planets)
        })
    }
    getResrouceAddress(mineItem, planet) {
        const [resource] = Resource.findAddress(this.program, mineItem, planet)

        return resource
    }

    getResourceMintAddress(resource) {
        return SageGameHandler.SAGE_RESOURCES_MINTS[resource]
    }

    getSectorAddress(coordinates) {
        if (!this.gameId) {
            throw "this.gameId not set"
        }

        const [sector] = Sector.findAddress(this.program, this.gameId, coordinates)

        return sector
    }

    getStarbaseAddress(coordinates) {
        if (!this.gameId) {
            throw "this.gameId not set"
        }

        const [starbase] = Starbase.findAddress(this.program, this.gameId, coordinates)

        return starbase
    }

    getStarbasePlayerAddress(starbase, sagePlayerProfile, starbaseSeqId) {
        if (!this.gameId) {
            throw "this.gameId not set"
        }

        const [starbasePlayer] = StarbasePlayer.findAddress(this.program, starbase, sagePlayerProfile, starbaseSeqId)

        return starbasePlayer
    }

    getSagePlayerProfileAddress(playerProfile) {
        if (!this.gameId) {
            throw "this.gameId not set"
        }

        const [sagePlayerProfile] = SagePlayerProfile.findAddress(this.program, playerProfile, this.gameId)

        return sagePlayerProfile
    }

    getProfileFactionAddress(playerProfile) {
        const [profileFaction] = ProfileFactionAccount.findAddress(this.profileFactionProgram, playerProfile)

        return profileFaction
    }

    async loadPlayerProfileFleets(playerProfile) {
        if (!this.gameId) {
            throw "this.gameId not set"
        }

        const program = await sageProgram(this.provider)
        const fleets = await program.account.fleet.all([
            {
                memcmp: {
                    offset: 41,
                    bytes: playerProfile.toBase58(),
                },
            },
        ])

        return fleets
    }

    async loadGame() {
        if (!this.gameId) {
            throw "this.gameId not set"
        }

        this.game = await readFromRPCOrError(this.connection, this.program, this.gameId, Game, "confirmed")

        return this.game
    }

    async loadGameState() {
        if (!this.gameState) {
            throw "this.gameState not set"
        }
        return await readFromRPCOrError(this.connection, this.program, this.gameState, GameState, "confirmed")
    }

    async getParsedTokenAccountsByOwner(owner) {
        return await getParsedTokenAccountsByOwner(this.connection, owner)
    }

    //  async buildAndSignTransaction(priorityFee, instructions) {
    //      const lastBlockHash = await this.connection.getLatestBlockhash({
    //          commitment: "confirmed",
    //      })

    //      return await buildAndSignTransaction(instructions, this.funder, {
    //          commitment: "confirmed",
    //          rbh: {
    //              blockhash: lastBlockHash.blockhash,
    //              lastValidBlockHeight: lastBlockHash.lastValidBlockHeight,
    //          },
    //      })
    //  }

    //   async sendTransaction(tx: TransactionReturn) {
    //     try {
    //       console.log('Trying to send transaction');
    //       return await sendTransaction(tx, this.connection, {
    //         commitment: 'confirmed',
    //         sendOptions: { skipPreflight: true },
    //       });
    //     } catch (error) {
    //       throw new Error(error);
    //     }
    //   }
    //   async sendTransaction(tx: TransactionReturn) {
    //     const lastBlockHash = await this.connection.getLatestBlockhash({
    //       commitment: "confirmed",
    //     });

    //     let blockHeight = await this.connection.getBlockHeight();
    //     let maxRetries = 10;

    //     while (blockHeight < lastBlockHash.lastValidBlockHeight && maxRetries > 0) {
    //       let release;
    //       try {
    //         console.log("Trying to send transaction");
    //         return await sendTransaction(
    //           tx,
    //           this.connection,
    //           {
    //             commitment: "confirmed",
    //             sendOptions: { skipPreflight: true },
    //           },
    //           3500,
    //           15
    //         );
    //       } catch (error) {
    //         console.log("Error in sendTransaction", error);
    //       }

    //       // try {
    //       //   console.log("Retrying to send transaction");
    //       //   const result = await sendTransaction(
    //       //     tx,
    //       //     this.connection,
    //       //     {
    //       //       commitment: "confirmed",
    //       //       sendOptions: { skipPreflight: true },
    //       //     },
    //       //     3500,
    //       //     15
    //       //   );

    //       //   return result;
    //       // } catch (retryError) {
    //       //   throw new Error(retryError);
    //       // }

    //       // await new Promise((resolve) => setTimeout(resolve, 500));

    //       // blockHeight = await this.connection.getBlockHeight();
    //       // maxRetries--;
    //     }

    //     throw new Error("Failed to send transaction after retries");
    //   }
    //  async sendTransaction(tx) {
    //      const lastBlockHash = await this.connection.getLatestBlockhash({
    //          commitment: "confirmed",
    //      })

    //      let maxRetries = 10

    //      while (maxRetries > 0) {
    //          try {
    //              console.log("Trying to send transaction")
    //              const result = await sendTransaction(
    //                  tx,
    //                  this.connection,
    //                  {
    //                      commitment: "confirmed",
    //                      sendOptions: { skipPreflight: true },
    //                  },

    //                  3500,
    //                  15
    //              )
    //              return result
    //          } catch (error) {
    //              console.log("Error in sendTransaction", error)
    //              maxRetries-- // Уменьшить количество попыток
    //          }
    //      }

    //      throw new Error("Failed to send transaction after retries")
    //  }

    //  async createBuildAndSendTransaction(priorityFee, instructions) {
    //      let result = null

    //      while (true) {
    //          try {
    //              if (Array.isArray(instructions)) {
    //                  for (let i = 0; i < instructions.length; i++) {
    //                      const element = instructions[i]
    //                      const tx = await this.buildAndSignTransaction(priorityFee, element)
    //                      result = await this.sendTransaction(tx)
    //                  }
    //              } else {
    //                  const tx = await this.buildAndSignTransaction(priorityFee, instructions)
    //                  result = await this.sendTransaction(tx)
    //              }
    //              if (result.value.isErr()) {
    //                  console.log("result", result)
    //                  console.log("error>>>>", result.value.error)
    //              }
    //              return result // Возвращаем результат, если транзакция успешна
    //          } catch (error) {
    //              console.log(`Error in createBuildAndSendTransaction: ${error}`)
    //              if ((error.name = "TransactionExpiredBlockheightExceededError")) {
    //                  console.log("Retrying transaction...")

    //                  try {
    //                      if (Array.isArray(instructions)) {
    //                          for (let i = 0; i < instructions.length; i++) {
    //                              const element = instructions[i]
    //                              const newTx = await this.buildAndSignTransaction(priorityFee, element)
    //                              result = await this.sendTransaction(newTx)
    //                          }
    //                      } else {
    //                          const newTx = await this.buildAndSignTransaction(priorityFee, instructions)
    //                          result = await this.sendTransaction(newTx)
    //                      }
    //                      return result
    //                  } catch (retryError) {
    //                      console.error("Failed to send transaction after retry:", retryError)
    //                  }
    //              } else {
    //                  console.error("Failed to send transaction:", error)
    //                  throw error
    //              }
    //          }
    //      }
    //  }

    async getAllPl(playerPubkey) {
        try {
            const playerProfileId = await this.getPlayerProfileAddress(playerPubkey)
            const program = await sageProgram(this.provider)

            const fleets = await readAllFromRPC(this.connection, program, Fleet, "processed", [
                {
                    memcmp: {
                        offset: 41, // 8 (discriminator) + 1 (version) + 32 (gameId)
                        bytes: playerProfileId.toBase58(), // ownerProfile
                    },
                },
            ])
            const result = await Promise.all(
                fleets.map(async (item) => {
                    if (item.type == "ok") {
                        const account = item.data
                        const accountInfo = await this.connection.getAccountInfo(item.key)
                        let remainingData = accountInfo.data.subarray(439)
                        let fleetState = "Unknown"
                        let extra = null
                        switch (remainingData[0]) {
                            case 0:
                                fleetState = "StarbaseLoadingBay"
                                extra = this.program.coder.types.decode("StarbaseLoadingBay", remainingData.subarray(1))
                                break
                            case 1: {
                                fleetState = "Idle"
                                let sector = this.program.coder.types.decode("Idle", remainingData.subarray(1))
                                extra = [sector.sector[0].toNumber(), sector.sector[1].toNumber()]
                                break
                            }
                            case 2:
                                fleetState = "MineAsteroid"
                                extra = this.program.coder.types.decode("MineAsteroid", remainingData.subarray(1))
                                break
                            case 3:
                                fleetState = "MoveWarp"
                                extra = this.program.coder.types.decode("MoveWarp", remainingData.subarray(1))
                                break
                            case 4:
                                fleetState = "MoveSubwarp"
                                extra = this.program.coder.types.decode("MoveSubwarp", remainingData.subarray(1))
                                break
                            case 5:
                                fleetState = "Respawn"
                                break
                            case 6:
                                fleetState = "StarbaseUpgrade"
                                break
                            case 7:
                                fleetState = "ReadyToExitWarp"
                                break
                        }
                        const fleetName = byteArrayToString(account.data.fleetLabel)
                        return { fleetState, extra, fleetName }
                    }
                })
            )

            return result
        } catch (error) {
            console.log(error)
        }
    }
    async getAllStatus(playerPubkey) {
        try {
            const playerProfileId = await this.getPlayerProfileAddress(playerPubkey)
            const program = await sageProgram(this.provider)

            const fleets = await readAllFromRPC(this.connection, program, Fleet, "processed", [
                {
                    memcmp: {
                        offset: 41, // 8 (discriminator) + 1 (version) + 32 (gameId)
                        bytes: playerProfileId.toBase58(), // ownerProfile
                    },
                },
            ])
            const result = fleets.map(async (item) => {
                if (item.type == "ok") {
                    const account = item.data
                    //  const fleetPubkey = this.getFleetAddress(playerProfilePubkey, fleet);

                    const accountInfo = await this.connection.getAccountInfo(item.key)
                    //  console.log('accountInfo', accountInfo);
                    let remainingData = accountInfo.data.subarray(439)
                    let fleetState = "Unknown"
                    let extra = null
                    switch (remainingData[0]) {
                        case 0:
                            fleetState = "StarbaseLoadingBay"
                            extra = this.program.coder.types.decode("StarbaseLoadingBay", remainingData.subarray(1))
                            break
                        case 1: {
                            fleetState = "Idle"
                            let sector = this.program.coder.types.decode("Idle", remainingData.subarray(1))
                            extra = [sector.sector[0].toNumber(), sector.sector[1].toNumber()]
                            break
                        }
                        case 2:
                            fleetState = "MineAsteroid"
                            extra = this.program.coder.types.decode("MineAsteroid", remainingData.subarray(1))
                            break
                        case 3:
                            fleetState = "MoveWarp"
                            extra = this.program.coder.types.decode("MoveWarp", remainingData.subarray(1))
                            break
                        case 4:
                            fleetState = "MoveSubwarp"
                            extra = this.program.coder.types.decode("MoveSubwarp", remainingData.subarray(1))
                            break
                        case 5:
                            fleetState = "Respawn"
                            break
                        case 6:
                            fleetState = "StarbaseUpgrade"
                            break
                        case 7:
                            fleetState = "ReadyToExitWarp"
                            break
                    }
                    console.log("fleetState", fleetState)
                    //  console.log('extra', extra);

                    return [fleetState, extra]

                    //  console.log('account.data', account);
                    return byteArrayToString(account.data.fleetLabel)
                }
            })
            return result
        } catch (error) {
            console.log(error)
        }
    }
    async getSystemR() {
        const game = await findGame(this.provider, this.connection)

        return game[0].account.systemRichness
    }
    async getMineItem(fleetPubkey, resource) {
        const program = await sageProgram(this.provider)
        const fleetAccount = await readFromRPCOrError(this.provider.connection, this.program, fleetPubkey, Fleet, "confirmed")

        const [mineItem] = await program.account.mineItem.all([
            {
                memcmp: {
                    offset: 105,
                    bytes: resource.toBase58(),
                },
            },
        ])
        const resourceHardness = mineItem.account.resourceHardness
        return { resourceHardness, mineItem }
    }
    async getsystemRichness(planetCheck, mineItem) {
        const resourceCheck = await this.program.account.resource.all([
            {
                memcmp: {
                    offset: 41,
                    bytes: planetCheck,
                },
            },
            {
                memcmp: {
                    offset: 73,
                    bytes: mineItem.publicKey,
                },
            },
        ])
        return resourceCheck[0].account.systemRichness
    }
    getResource() {
        return Object.keys(SageGameHandler.SAGE_RESOURCES_MINTS)
    }
    async getAllStarbases() {
        try {
            return await this.program.account.starbase.all()
        } catch (error) {
            console.log(error)
        }
    }
    async getAllFleetInGame() {
        try {
            return await this.program.account.fleet.all()
        } catch (e) {
            console.log(e)
        }
    }
    async getAllPlanet() {
        try {
            const res = await this.program.account.planet.all()
            return res
        } catch (error) {
            console.log(error)
        }
    }
    async getStarbasePlayer(userProfile, starbase) {
        return new Promise(async (resolve) => {
            const [starbasePlayer] = await this.program.account.starbasePlayer.all([
                {
                    memcmp: {
                        offset: 9,
                        bytes: userProfile.toBase58(),
                    },
                },
                {
                    memcmp: {
                        offset: 73,
                        bytes: starbase.toBase58(),
                    },
                },
            ])
            resolve(starbasePlayer)
        })
    }
    async getResources() {
        //getting recources and craftables for mining and transport
        const resource = await this.program.account.mineItem.all()
        const craftables = await this.craftingProgram.account.craftableItem.all()

        const craftablesNames = craftables.map((item) => {
            const name = item.account.namespace
            const buffer = Buffer.from(name)
            const craftableName = buffer.toString("utf8")
            return {
                resourceName: {
                    name: craftableName.replace(/\0/g, ""),
                    address: item.publicKey,
                    mint: item.account.mint,
                },
            }
        })
        const recourcesNames = resource.map((item) => {
            const name = item.account.name
            const buffer = Buffer.from(name)
            const resourceName = buffer.toString("utf8")
            return {
                resourceName: {
                    name: resourceName.replace(/\0/g, ""),
                    address: item.publicKey,
                    mint: item.account.mint,
                },
            }
        })
        return [...craftablesNames, ...recourcesNames]

        //  console.log('names', recourcesNames);
    }
    async sendAndConfirmTx(txSerialized, lastValidBlockHeight, txHash, fleet, opName) {
        let { blockHeight: curBlockHeight } = await this.connection.getEpochInfo({ commitment: "confirmed" })
        let interimBlockHeight = curBlockHeight
        if (curBlockHeight > lastValidBlockHeight) return { txHash, confirmation: { name: "TransactionExpiredBlockheightExceededError" } }
        txHash = await this.connection.sendRawTransaction(txSerialized, { skipPreflight: true, maxRetries: 0, preflightCommitment: "confirmed" })
        console.log(3, `${fleet} <${opName}> txHash`, txHash)

        while (curBlockHeight - interimBlockHeight < 10) {
            const signatureStatus = await this.connection.getSignatureStatus(txHash)
            if (signatureStatus.value && ["confirmed", "finalized"].includes(signatureStatus.value.confirmationStatus)) {
                return { txHash, confirmation: signatureStatus }
            } else if (signatureStatus.err) {
                console.log(3, `${fleet} <${opName}> Err`, signatureStatus.err)
                return { txHash, confirmation: signatureStatus }
            }

            await wait(Math.max(200, 2000))
            let epochInfo = await this.connection.getEpochInfo({ commitment: "confirmed" })
            curBlockHeight = epochInfo.blockHeight
        }

        console.log(3, `${fleet} <${opName}> TRYING 🌐`)
        return await this.sendAndConfirmTx(txSerialized, lastValidBlockHeight, txHash, fleet, opName)
    }
    txSignAndSend(ix, fleet, opName, priorityFeeMultiplier = 0, userPublicKey, wallet) {
        return new Promise(async (resolve) => {
            // console.log("lookupTableAddress", lookupTableInst)
            const fleetName = fleet ? fleet : "unknown"
            let macroOpStart = Date.now()
            console.log("ix", ix)
            let confirmed = false
            while (!confirmed) {
                //let tx = new solanaWeb3.Transaction();
                const priorityFee = 0 //Convert Lamports to microLamports ?
                console.log(4, `${fleetName} <${opName}> 💳 Fee ${Math.ceil(priorityFee / 5)} lamp`)
                let instructions = []
                if (priorityFee > 0) instructions.push(web3.ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityFee }))
                console.log("ix", ix)
                if (ix.constructor === Array) {
                    ix.forEach((item) => instructions.push(item.instruction))
                } else {
                    instructions.push(ix.instruction)
                }
                let latestBH = await this.connection.getLatestBlockhash("confirmed")
                let messageV0 = new web3.TransactionMessage({
                    payerKey: wallet.publicKey,
                    recentBlockhash: latestBH.blockhash,
                    instructions,
                }).compileToV0Message()
                console.log("messageV0", messageV0)

                let tx = new web3.VersionedTransaction(messageV0)
                let txSigned = await wallet.signAllTransactions([tx])
                let txSerialized = await txSigned[0].serialize()

                let microOpStart = Date.now()
                console.log(2, `${fleetName} <${opName}> SEND ➡️`)
                let response = await this.sendAndConfirmTx(txSerialized, latestBH.lastValidBlockHeight, null, fleet, opName)
                let txHash = response.txHash
                let confirmation = response.confirmation
                let txResult = txHash ? await this.connection.getTransaction(txHash, { commitment: "confirmed", preflightCommitment: "confirmed", maxSupportedTransactionVersion: 1 }) : undefined
                if (
                    (confirmation.value && confirmation.value.err && confirmation.value.err.InstructionError) ||
                    (txResult && txResult.meta && txResult.meta.err && txResult.meta.err.InstructionError)
                ) {
                    console.log(2, `${fleetName} <${opName}> ERROR ❌ The instruction resulted in an error.`)
                    let ixError = txResult && txResult.meta && txResult.meta.logMessages ? txResult.meta.logMessages : "Unknown"
                    console.log("txResult.logMessages: ", ixError)
                }

                const confirmationTimeStr = `${Date.now() - microOpStart}ms`

                if (confirmation && confirmation.name == "TransactionExpiredBlockheightExceededError" && !txResult) {
                    console.log(2, `${fleetName} <${opName}> CONFIRM ❌ ${confirmationTimeStr}`)
                    console.log(2, `${fleetName} <${opName}> RESEND 🔂`)
                    continue //restart loop to try again
                }

                let tryCount = 1
                if (!confirmation.name) {
                    while (!txResult) {
                        tryCount++
                        txResult = await this.connection.getTransaction(txHash, { commitment: "confirmed", preflightCommitment: "confirmed", maxSupportedTransactionVersion: 1 })
                        if (!txResult) await wait(1000)
                    }
                }

                if (tryCount > 1) console.log(3, `${fleetName} Got txResult in ${tryCount} tries`, txResult)
                console.log(2, `${fleetName} <${opName}> CONFIRM ✅ ${confirmationTimeStr}`)
                confirmed = true

                const fullMsTaken = Date.now() - macroOpStart
                const secondsTaken = Math.round(fullMsTaken / 1000)
                console.log(1, `${fleetName} <${opName}> Completed 🏁 ${secondsTaken}s`)
                resolve(txResult)
            }
        })
    }
}
