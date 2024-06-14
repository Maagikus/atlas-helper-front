import { BN } from "@project-serum/anchor"
import { socket } from "@/socket.js"
import { defineStore } from "pinia"
import { useAuthStore } from "./authStore"
import { useUserStore } from "./userStore"
import { useWorkspace } from "@/helpers/provider"
import { Fleet } from "@staratlas/sage"
import { byteArrayToString, readAllFromRPC } from "@staratlas/data-source"
import { PublicKey } from "@solana/web3.js"
import { SageGameHandler } from "@/helpers/sageGameHandler"
import { SageFleetHandler } from "@/helpers/sageFleetHandler"
export const useGameStore = defineStore("game", {
    state: () => ({
        miningDashboard: [],
        movementDashboard: [],
        actions: [],
        provider: null,
        serverPlay: true,
    }),
    getters: {
        getMiningDashboard: (state) => state.miningDashboard,
        getMovementDashboard: (state) => state.movementDashboard,
        getUserActions: (state) => state.actions,
    },
    actions: {
        initSocketListeners() {
            socket.on("dock", (mess) => {
                const res = JSON.parse(mess)
                useUserStore().updateFleetState(res.fleet, res.state)
            })
            socket.on("undock", (mess) => {
                const res = JSON.parse(mess)
                useUserStore().updateFleetState(res.fleet, res.state)
            })
            socket.on("updateFleetState", (mess) => {
                const res = JSON.parse(mess)
                useUserStore().updateFleetState(res.fleet, res.state)
            })
            socket.on("updateFleetHistory", (mess) => {
                const newItem = JSON.parse(mess)

                useUserStore().updateUserHistory(newItem)
            })
            socket.on("warp", (mess) => {
                const res = JSON.parse(mess)
                useUserStore().updateFleetState(res.fleet, res.state)

                //  console.log("dock", res)
            })
            socket.on("connect_error", (error) => {
                useUserStore().setError({ status: 500, text: error.message })
            })
            socket.on("subwarp", (mess) => {
                const res = JSON.parse(mess)
                //  console.log("dock", res)
            })
            socket.on("error", (mess) => {
                const error = JSON.parse(mess)
                console.log(error)

                useUserStore().setError(error)
            })
            socket.on("initGame", (mess) => {
                const { isInited } = mess
                if (!isInited) {
                    const user = useAuthStore().getUser
                    if (user) {
                        const dataForInitGame = JSON.stringify({ key: user.walletPublicKey })
                        socket.emit("initGame", dataForInitGame)
                    }
                }
            })
        },
        addProvider(provider) {
            this.provider = provider
        },
        changePlayLogic(type) {
            this.serverPlay = type
        },
        async getPlayerProfileAddress(playerPubkey, connection) {
            console.log("connection", connection)
            const [accountInfo] = await connection.getProgramAccounts(new PublicKey("pprofELXjL5Kck7Jn5hCpwAL82DpTkSYBENzahVtbc9"), {
                filters: [
                    {
                        memcmp: {
                            offset: 30,
                            bytes: playerPubkey,
                        },
                    },
                ],
            })

            return accountInfo.pubkey
        },
        async setupSageGameHandlerReadyAndLoadGame(connection, provider) {
            const sageGameHandler = new SageGameHandler(connection, provider)
            await sageGameHandler.ready
            await sageGameHandler.loadGame()

            // const playerPubkey = new PublicKey(walletKeypair.publicKey)

            return { sageGameHandler }
        },
        async getUserFleets() {
            const { program, craftingProgram, wallet, connection, provider } = useWorkspace()
            const data = JSON.stringify(wallet.value)
            // console.log("connection", connection)

            const playerPubkey = wallet.value.publicKey.toBase58()
            // console.log("playerPubkey", playerPubkey)
            const { sageGameHandler } = await this.setupSageGameHandlerReadyAndLoadGame(connection, provider.value)
            // console.log("sageGameHandler", sageGameHandler)
            const fleets = await sageGameHandler.getAllPl(new PublicKey(playerPubkey))
            console.log("fleets", fleets)
            // try {
            //     const playerProfileId = await this.getPlayerProfileAddress(playerPubkey, connection)

            //     const fleets = await readAllFromRPC(connection, program.value, Fleet, "processed", [
            //         {
            //             memcmp: {
            //                 offset: 41, // 8 (discriminator) + 1 (version) + 32 (gameId)
            //                 bytes: playerProfileId.toBase58(), // ownerProfile
            //             },
            //         },
            //     ])
            //     const result = await Promise.all(
            //         fleets.map(async (item) => {
            //             if (item.type == "ok") {
            //                 const account = item.data
            //                 const accountInfo = await connection.getAccountInfo(item.key)
            //                 let remainingData = accountInfo.data.subarray(439)
            //                 let fleetState = "Unknown"
            //                 let extra = null
            //                 switch (remainingData[0]) {
            //                     case 0:
            //                         fleetState = "StarbaseLoadingBay"
            //                         extra = program.value.coder.types.decode("StarbaseLoadingBay", remainingData.subarray(1))
            //                         break
            //                     case 1: {
            //                         fleetState = "Idle"
            //                         let sector = program.value.coder.types.decode("Idle", remainingData.subarray(1))
            //                         extra = [sector.sector[0].toNumber(), sector.sector[1].toNumber()]
            //                         break
            //                     }
            //                     case 2:
            //                         fleetState = "MineAsteroid"
            //                         extra = program.value.coder.types.decode("MineAsteroid", remainingData.subarray(1))
            //                         break
            //                     case 3:
            //                         fleetState = "MoveWarp"
            //                         extra = program.value.coder.types.decode("MoveWarp", remainingData.subarray(1))
            //                         break
            //                     case 4:
            //                         fleetState = "MoveSubwarp"
            //                         extra = program.value.coder.types.decode("MoveSubwarp", remainingData.subarray(1))
            //                         break
            //                     case 5:
            //                         fleetState = "Respawn"
            //                         break
            //                     case 6:
            //                         fleetState = "StarbaseUpgrade"
            //                         break
            //                     case 7:
            //                         fleetState = "ReadyToExitWarp"
            //                         break
            //                 }
            //                 const fleetName = byteArrayToString(account.data.fleetLabel)
            //                 console.log("fleetName", fleetName, "fleetState", fleetState)
            //                 return { fleetState, extra, fleetName }
            //             }
            //         })
            //     )

            //     return result
            // } catch (error) {
            //     console.log(error)
            // }
        },
        async dockFleet(data) {
            //HERE WAS DATA
            // const data = {
            //     key: useAuthStore().getUser.walletPublicKey,
            //     fleet: fleet,
            //     priorityFee: 1,
            // }

            if (this.serverPlay) {
                try {
                    socket.emit("dock", JSON.stringify(data))
                } catch (e) {
                    console.log("dockError", e)
                }
            }
            // else {
            //     const { program, craftingProgram, wallet, connection, provider } = useWorkspace()
            //     const { sageGameHandler } = await this.setupSageGameHandlerReadyAndLoadGame(connection, provider.value)
            //     const sageFleetHandler = new SageFleetHandler(sageGameHandler)
            //     let ix
            //     let rx
            //     const playerPubkey = new PublicKey(wallet.value.publicKey.toBase58())
            //     const playerProfilePubkey = await sageGameHandler.getPlayerProfileAddress(playerPubkey)
            //     const fleetPubkey = sageGameHandler.getFleetAddress(playerProfilePubkey, data.fleet)
            //     const fleetAccount = await sageFleetHandler.getFleetAccount(fleetPubkey)
            //     ix = await sageFleetHandler.ixDockToStarbase(fleetPubkey, playerPubkey)
            //     rx = await sageGameHandler.txSignAndSend(ix, data.fleet, "DOCK", 0, playerPubkey, wallet.value)
            //     console.log("rx", rx)
            //     socket.emit("updateFleetState", JSON.stringify({ fleetName: data.fleet }))
            // }
        },
        async undockFleet(data) {
            // const data = {
            //     key: useAuthStore().getUser.walletPublicKey,
            //     fleet: fleet,
            //     priorityFee: 1,
            // }

            if (this.serverPlay) {
                socket.emit("undock", JSON.stringify(data))
            } else {
                const { program, craftingProgram, wallet, connection, provider } = useWorkspace()
                const { sageGameHandler } = await this.setupSageGameHandlerReadyAndLoadGame(connection, provider.value)
                const sageFleetHandler = new SageFleetHandler(sageGameHandler)
                let ix
                let rx
                const playerPubkey = new PublicKey(wallet.value.publicKey.toBase58())
                const playerProfilePubkey = await sageGameHandler.getPlayerProfileAddress(playerPubkey)
                const fleetPubkey = sageGameHandler.getFleetAddress(playerProfilePubkey, data.fleet)
                const fleetAccount = await sageFleetHandler.getFleetAccount(fleetPubkey)
                ix = await sageFleetHandler.ixUndockFromStarbase(fleetPubkey, playerPubkey)
                rx = await sageGameHandler.txSignAndSend(ix, data.fleet, "DOCK", 0, playerPubkey, wallet.value)
                socket.emit("updateFleetState", JSON.stringify({ fleetName: data.fleet }))
            }
        },
        async warp(fleet, coord) {
            const data = {
                key: useAuthStore().getUser.walletPublicKey,
                fleet: fleet,
                priorityFee: 1,
                forwardCoordForWarp: coord,
            }
            console.log(data.key)
            socket.emit("warp", JSON.stringify(data))
        },
        async subWarp(data) {
            // const data = {
            //     key: useAuthStore().getUser.walletPublicKey,
            //     fleet: fleet,
            //     priorityFee: 1,
            //     forwardCoordForWarp: coord,
            // }
            // console.log(data.key)
            console.log("data", data)
            socket.emit("subwarp", JSON.stringify(data))
        },
        async moveTo(fleet, coord) {
            const data = {
                key: useAuthStore().getUser.walletPublicKey,
                fleet: fleet,
                priorityFee: 1,
                forwardCoordForWarp: coord,
                startCoord: "0 -39",
                //   loop: 3,
                //   resourceValueAtDestination: 0,
                //   resourceValueAtStartingPoint: 700,
                //   resource: 'fuel',
            }
            socket.emit("moveTo", JSON.stringify(data))
        },
        async transferSmth(data) {
            // const dataForSending = {
            //     key: useAuthStore().getUser.walletPublicKey,
            //     fleet: data.fleet,
            //     priorityFee: 1,
            //     forwardCoordForWarp: data.forwardCoordForWarp,
            //     startCoord: data.startCoord,
            //     loop: data.loop,
            //     resourceValueAtDestination: data.resourceValueAtDestination,
            //     resourceValueAtStartingPoint: data.resourceValueAtStartingPoint,
            //     resource: data.resource,
            // }
            console.log("data", data)
            socket.emit("transferSmth", JSON.stringify(data))
        },
        async wait(minutes) {
            const endTime = new Date(Date.now() + minutes * 60000 + 10)

            console.log(`Waiting for ${minutes} minutes...`)
            console.log(`End Time ${endTime} minutes...`)

            await new Promise((resolve) => {
                const timer = setInterval(() => {
                    const currentTime = new Date()
                    if (currentTime >= endTime) {
                        clearInterval(timer)
                        resolve()
                    }
                }, 60000)
            })

            console.log(`Ожидание завершено.`)
        },
        async startMining(data) {
            if (this.serverPlay) {
                socket.emit("message", JSON.stringify([data]))
            }
            // else {
            //     console.log("data", data)
            //     const { program, craftingProgram, wallet, connection, provider } = useWorkspace()
            //     const { sageGameHandler } = await this.setupSageGameHandlerReadyAndLoadGame(connection, provider.value)
            //     const sageFleetHandler = new SageFleetHandler(sageGameHandler)
            //     let ix
            //     let rx
            //     const playerPubkey = new PublicKey(wallet.value.publicKey.toBase58())
            //     const playerProfilePubkey = await sageGameHandler.getPlayerProfileAddress(playerPubkey)
            //     const fleetPubkey = sageGameHandler.getFleetAddress(playerProfilePubkey, data.fleet)
            //     //  const fleetAccount = await sageFleetHandler.getFleetAccount(fleetPubkey)

            //     //  ix = await sageFleetHandler.ixDockToStarbase(fleetPubkey, playerPubkey)
            //     //  rx = await sageGameHandler.txSignAndSend(ix, data.fleet, "DOCK", 0, playerPubkey, wallet.value)
            //     //  console.log("rx", rx)
            //     //  socket.emit("updateFleetState", JSON.stringify({ fleetName: data.fleet }))

            //     for (let i = 0; i < data.loop; i++) {
            //         console.log(data.priorityFee)
            //         console.log(`${i}<!-- Start Mining (${data.resource}) with ${data.fleet} -->`)
            //         socket.send(
            //             JSON.stringify({
            //                 program: "mining",
            //                 fleet: data.fleet,
            //                 status: "success",
            //                 mess: `Start Mining (${data.resource}) with ${data.fleet}`,
            //                 action: "Mining",
            //                 dataForRepeating: data,
            //             })
            //         )

            //         const fleetPubkey = sageGameHandler.getFleetAddress(playerProfilePubkey, data.fleet)

            //         let fleetAccount = await sageFleetHandler.getFleetAccount(fleetPubkey)
            //         const resourceTokenAmmo = sageGameHandler.getResourceMintAddress("ammo")

            //         const { timeForMining, ammoForDuration, foodForDuration } = await sageFleetHandler.getMiningDuration(fleetPubkey, data.resource, data.planet)
            //         console.log("timeForMining", timeForMining)
            //         console.log("ammoForDuration", ammoForDuration)
            //         console.log("foodForDuration", foodForDuration)

            //         const currentAmmo = await sageFleetHandler.getCurrentFuelValue(fleetPubkey, resourceTokenAmmo, fleetAccount.data.ammoBank)
            //         const cargoStats = fleetAccount.data.stats.cargoStats

            //         if (currentAmmo < ammoForDuration) {
            //             ix = await sageFleetHandler.ixDepositCargoToFleet(fleetPubkey, fleetAccount.data.ammoBank, resourceTokenAmmo, new BN(cargoStats.ammoCapacity - currentAmmo), playerPubkey)
            //             // console.log("fleetPubkey", fleetPubkey);
            //             rx = await sageGameHandler.txSignAndSend(ix, data.fleet, "FILL AMMO", 0, playerPubkey, wallet.value)
            //             // if (!rx.value.isOk()) {
            //             //     throw "fleet failed to fill ammo to bank"
            //             // }
            //             socket.send(
            //                 JSON.stringify({
            //                     fleet: data.fleet,
            //                     status: "success",
            //                     mess: "Fill ammo tank",
            //                     action: "End fill ammo",
            //                 })
            //             )
            //         }

            //         const mintToken = sageGameHandler.mints?.food
            //         const cargoPodToKey = fleetAccount.data.cargoHold
            //         console.log("")
            //         ix = await sageFleetHandler.ixDepositCargoToFleet(fleetPubkey, cargoPodToKey, mintToken, new BN(foodForDuration), playerPubkey)
            //         //   rx = await sageGameHandler.txSignAndSend(ix, data.fleet, "FILL FOOD", 0, playerPubkey, wallet.value)
            //         socket.send(
            //             JSON.stringify({
            //                 fleet: data.fleet,
            //                 status: "success",
            //                 mess: "Fill with Food",
            //                 action: "Filling Food",
            //             })
            //         )
            //         //   if (!rx.value.isOk()) {
            //         //       throw "fleet failed to fill with food"
            //         //   }
            //         //   if (!fleetAccount.state.Idle) {
            //         //       ix = await sageFleetHandler.ixUndockFromStarbase(fleetPubkey, playerPubkey)
            //         //       rx = await sageGameHandler.txSignAndSend(ix, data.fleet, "UNDOCK", 0, playerPubkey, wallet.value)
            //         //       socket.send(
            //         //           JSON.stringify({
            //         //               fleet: data.fleet,
            //         //               status: "success",
            //         //               mess: "Undocking",
            //         //               action: "Undocking",
            //         //           })
            //         //       )
            //         //   }
            //         //========================================================================================================================================================
            //         //TEST TO HERE
            //         //   //  console.log("miningDuration", miningDuration);
            //         //   //  console.log("ammoForDuration", ammoForDuration);
            //         //   await new Promise((resolve) => setTimeout(resolve, 10000))
            //         //   ix = await sageFleetHandler.ixStartMining(fleetPubkey, data.resource, data.planet)
            //         //   rx = await sageGameHandler.txSignAndSend(ix, data.fleet, "START MINING", 0, playerPubkey, wallet.value)
            //         //   socket.send(
            //         //       JSON.stringify({
            //         //           fleet: data.fleet,
            //         //           status: "success",
            //         //           mess: "Start Mining",
            //         //           action: "Mining",
            //         //       })
            //         //   )
            //         //   //   if (!rx.value.isOk()) {
            //         //   //       // await bot.sendMessage(msg.chat.id, 'fleet failed to start mining')
            //         //   //       throw "fleet failed to start mining"
            //         //   //   }
            //         //   fleetAccount = await sageFleetHandler.getFleetAccount(fleetPubkey)
            //         //   console.log(`${index}Fleet state: ${JSON.stringify(fleetAccount.state)}`)
            //         //   console.log(`${index}Waiting for ${timeForMining} minutes...`)
            //         //   socket.send(
            //         //       JSON.stringify({
            //         //           fleet: data.fleet,
            //         //           status: "success",
            //         //           mess: `Waiting for ${timeForMining} minutes...`,
            //         //           action: "Mining",
            //         //       })
            //         //   )

            //         //   //  await new Promise((resolve) => setTimeout(resolve, time * 60 * 1000));
            //         //   await this.wait(timeForMining)

            //         //   console.log("Prepare to stopping mining...")
            //         //   await new Promise((resolve) => setTimeout(resolve, 10000))
            //         //   ix = await sageFleetHandler.ixStopMining(fleetPubkey)
            //         //   rx = await sageGameHandler.txSignAndSend(ix, data.fleet, "STOP MINING", 0, playerPubkey, wallet.value)
            //         //   socket.send(
            //         //       JSON.stringify({
            //         //           fleet: data.fleet,
            //         //           status: "success",
            //         //           mess: `Prepare to stopping mining`,
            //         //           action: "Stopping",
            //         //       })
            //         //   )
            //         //   //   if (!rx.value.isOk()) {
            //         //   //       throw "fleet failed to stop mining"
            //         //   //   }
            //         //   console.log("Prepare to dock to starbase...")

            //         //   await new Promise((resolve) => setTimeout(resolve, 10000))

            //         //   ix = await sageFleetHandler.ixDockToStarbase(fleetPubkey)
            //         //   rx = await sageGameHandler.txSignAndSend(ix, data.fleet, "DOCK", 0, playerPubkey, wallet.value)
            //         //   socket.send(
            //         //       JSON.stringify({
            //         //           fleet: data.fleet,
            //         //           status: "success",
            //         //           mess: `Prepare to dock to starbase`,
            //         //           action: "docking",
            //         //       })
            //         //   )
            //         //   //   if (!rx.value.isOk()) {
            //         //   //       throw "fleet failed to dock to starbase"
            //         //   //   }
            //         //   console.log("Prepare to deposit mined resources...")
            //         //   const food = sageGameHandler.mints?.food
            //         //   const currentFood = await sageFleetHandler.getCurrentFuelValue(fleetPubkey, food, fleetAccount.data.cargoHold)
            //         //   console.log("food at the end>>>>", currentFood)
            //         //   await new Promise((resolve) => setTimeout(resolve, 10000))
            //         //   const resourceToken = sageGameHandler.getResourceMintAddress(resource)
            //         //   ix = await sageFleetHandler.ixWithdrawCargoFromFleet(fleetPubkey, resourceToken, new BN(0), fleetAccount.data.cargoHold)
            //         //   rx = await sageGameHandler.txSignAndSend(ix, data.fleet, "WITHDRAW RESOURCE", 0, playerPubkey, wallet.value)
            //         //   socket.send(
            //         //       JSON.stringify({
            //         //           fleet: data.fleet,
            //         //           status: "success",
            //         //           mess: `Withdraw mined recource`,
            //         //           action: "Withdrawing",
            //         //       })
            //         //   )
            //         //   //   if (!rx.value.isOk()) {
            //         //   //       throw "fleet failed to deposit mined resources"
            //         //   //   }

            //         //   console.log(`${index}<!-- Stop Mining (${data.resource}) with ${data.fleet} -->`)
            //         //   await new Promise((resolve) => setTimeout(resolve, 10000))
            //     }
            // }
        },
    },
})
