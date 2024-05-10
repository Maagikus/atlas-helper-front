import { computed } from "vue"
import { useAnchorWallet } from "solana-wallets-vue"
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"
import { AnchorProvider, Program } from "@project-serum/anchor"
import { SAGE_IDL } from "@staratlas/sage"
import { CRAFTING_IDL } from "@staratlas/crafting"

const preflightCommitment = "processed"
const commitment = "confirmed"
export const ProgramIds = {
    SAGE_PROGRAM_ID: "SAGE2HAwep459SNq61LHvjxPk4pLPEJLoMETef7f7EE",
    CARGO_PROGRAM_ID: "Cargo2VNTPPTi9c1vq1Jw5d3BWUNr18MjRtSupAghKEk",
    PLAYER_PROFILE_PROGRAM_ID: "pprofELXjL5Kck7Jn5hCpwAL82DpTkSYBENzahVtbc9",
    PROFILE_FACTION_PROGRAM_ID: "pFACSRuobDmvfMKq1bAzwj27t6d2GJhSCHb1VcfnRmq",
    POINTS_PROGRAM_ID: "Point2iBvz7j5TMVef8nEgpmz4pDr7tU7v3RjAfkQbM",
    CRAFTING_PROGRAM_ID: "CRAFT2RPXPJWCEix4WpJST3E7NLf79GTqZUL75wngXo5",
}

let workspace = null
export const useWorkspace = () => workspace

export const initWorkspace = () => {
    const wallet = useAnchorWallet()

    const connection = new Connection("https://autumn-flashy-needle.solana-mainnet.quiknode.pro/3d225ecd01d67ebe2009ab538c3f861ae4b2eb58/", "confirmed")

    const provider = computed(
        () =>
            new AnchorProvider(connection, wallet.value, {
                preflightCommitment,
                commitment,
            })
    )
    const program = computed(() => new Program(SAGE_IDL, ProgramIds.SAGE_PROGRAM_ID, provider.value))
    const craftingProgram = computed(() => new Program(CRAFTING_IDL, ProgramIds.CRAFTING_PROGRAM_ID, provider.value))
    const pointsProgram = computed(() => new Program(POINTS_IDL, ProgramIds.POINTS_PROGRAM_ID, provider.value))
    const cargoProgram = computed(() => new Program(CARGO_IDL, ProgramIds.CARGO_PROGRAM_ID, provider.value))
    const playerProfileProgram = computed(() => new Program(PLAYER_PROFILE_IDL, ProgramIds.PLAYER_PROFILE_PROGRAM_ID, provider.value))
    const profileFactionProgram = computed(() => new Program(PLAYER_PROFILE_IDL, ProgramIds.PROFILE_FACTION_PROGRAM_ID, provider.value))

    workspace = {
        wallet,
        connection,
        provider,
        program,
        craftingProgram,
        pointsProgram,
        cargoProgram,
        playerProfileProgram,
        profileFactionProgram,
    }
}
