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
                console.log("dock", res)
            })
            socket.on("undock", (mess) => {
                const res = JSON.parse(mess)
                useUserStore().updateFleetState(res.fleet, res.state)
                console.log("undock", res)
            })
            socket.on("warp", (mess) => {
                const res = JSON.parse(mess)
                useUserStore().updateFleetState(res.fleet, res.state)
                console.log("warp", res)
                //  console.log("dock", res)
            })
            socket.on("subwarp", (mess) => {
                const res = JSON.parse(mess)
                //  console.log("dock", res)
            })
        },
        addProvider(provider) {
            this.provider = provider
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
        async dockFleet(fleet) {
            //HERE WAS DATA
            // const data = {
            //     key: useAuthStore().getUser.walletPublicKey,
            //     fleet: fleet,
            //     priorityFee: 1,
            // }
            // socket.emit("dock", JSON.stringify(data))
            console.log("fleet", fleet)
            const { program, craftingProgram, wallet, connection, provider } = useWorkspace()
            const { sageGameHandler } = await this.setupSageGameHandlerReadyAndLoadGame(connection, provider.value)
            const sageFleetHandler = new SageFleetHandler(sageGameHandler)
            let ix
            let rx
            const playerPubkey = new PublicKey(wallet.value.publicKey.toBase58())
            const playerProfilePubkey = await sageGameHandler.getPlayerProfileAddress(playerPubkey)
            const fleetPubkey = sageGameHandler.getFleetAddress(playerProfilePubkey, fleet)
            const fleetAccount = await sageFleetHandler.getFleetAccount(fleetPubkey)
            ix = await sageFleetHandler.ixDockToStarbase(fleetPubkey, playerPubkey)
            rx = await sageGameHandler.txSignAndSend(ix, fleet, "DOCK", 0, playerPubkey, wallet.value)
            console.log("rx", rx)
            if (!rx.value.isOk()) {
                throw "fleet failed to undock"
            }
        },
        async undockFleet(data) {
            // const data = {
            //     key: useAuthStore().getUser.walletPublicKey,
            //     fleet: fleet,
            //     priorityFee: 1,
            // }
            console.log("data", data)

            socket.emit("undock", JSON.stringify(data))
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
        async startMining(data) {
            socket.emit("message", JSON.stringify([data]))
        },
    },
})
