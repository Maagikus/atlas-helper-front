import { BN } from "@project-serum/anchor"
import { MovementStats } from "@staratlas/sage"
import { getAvailableJumpPoints } from "./pathFinder"

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }

    return true
}

export const parseCoordinates = (input) => {
    const [x, y] = input.split(" ").map(Number)
    return [new BN(x), new BN(y)]
}
export const calcNextWarpPoint = (warpRange, startCoords, endCoord) => {
    const [startX, startY] = startCoords.map(Number)
    const [endX, endY] = endCoords.map(Number)

    const moveDist = calculateMovementDistance(startCoords, endCoords)

    const realWarpRange = Math.floor(warpRange / 100)
    console.log("realWarpRange", realWarpRange)

    const warpCount = realWarpRange > 0 ? moveDist / realWarpRange : 1
    console.log("warpCount", warpCount)
    if (warpCount < 1) return endCoords

    let dx = (endX - startX) / Math.floor(warpCount)
    let dy = (endY - startY) / Math.floor(warpCount)

    dx = dx > 0 ? Math.floor(dx) : Math.ceil(dx)
    dy = dy > 0 ? Math.floor(dy) : Math.ceil(dy)

    const result = [startX + dx, startY + dy].map((item) => new BN(item))
    return result
}
export const getNextWarpPoint = (fleetAccount, sectorFrom, sectorTo, maxWarpDist) => {
    let nextWarpCoord, nextPoint, moveDistToTheMiddle, warpTimeToTheMiddle, fuelNeedForWarpToTheMiddle, middlePoint

    const possibleWariants = []

    const moveDistToTheEnd = calculateMovementDistance(sectorFrom, sectorTo)
    const movementStats = fleetAccount.data.stats.movementStats

    const warpCooldownExpiresAt = fleetAccount.data.warpCooldownExpiresAt.toNumber() * 1000
    const warpCd = movementStats.warpCoolDown

    const subwTimeAllWay = calculateSubwarpTime(movementStats, moveDistToTheEnd)
    const fuelNeedForSubwAllWay = calculateSubwarpFuelBurn(movementStats, moveDistToTheEnd)
    const percent = (Math.floor(maxWarpDist / 100) * 100) / Math.floor(moveDistToTheEnd)
    const warpDist = percent >= 100 ? moveDistToTheEnd - 1 : maxWarpDist / 100
    const possibleWayToWarp = getAvailableJumpPoints(sectorFrom.map(Number)[0], sectorFrom.map(Number)[1], warpDist)

    for (let index = 0; index < possibleWayToWarp.length; index++) {
        const element = possibleWayToWarp[index].map((i) => new BN(i))

        nextPoint = element
        moveDistToTheMiddle = calculateMovementDistance(sectorFrom, nextPoint)
        warpTimeToTheMiddle = calculateWarpTime(movementStats, moveDistToTheMiddle)
        fuelNeedForWarpToTheMiddle = calculateWarpFuelBurn(movementStats, moveDistToTheMiddle)

        const moveDistFromMiddleToTheEnd = calculateMovementDistance(nextPoint, sectorTo)
        const subwTime = calculateSubwarpTime(movementStats, moveDistFromMiddleToTheEnd)
        const fuelNeedForSubw = calculateSubwarpFuelBurn(movementStats, moveDistFromMiddleToTheEnd)
        const diferenceBetweenTime = parseFloat((subwTimeAllWay / 60).toFixed(2)) - parseFloat(((warpTimeToTheMiddle + subwTime) / 60).toFixed(2))
        const profitInTime = Number(((diferenceBetweenTime * 100) / parseFloat((subwTimeAllWay / 60).toFixed(2))).toFixed(2))
        const diferenceBetweenFuel = parseFloat(fuelNeedForSubwAllWay.toFixed(2)) - parseFloat((fuelNeedForWarpToTheMiddle + fuelNeedForSubw).toFixed(2))
        const profitInFuel = (diferenceBetweenFuel * 100) / parseFloat((fuelNeedForWarpToTheMiddle + fuelNeedForSubw).toFixed(2)) + "%"
        const calculateMoving = {
            subwarpOnly: {
                timeForSubwarp: parseFloat((subwTimeAllWay / 60).toFixed(2)),
                fuelNeedForSubwarp: parseFloat(fuelNeedForSubwAllWay.toFixed(2)),
            },
            combinationWarpSubwarp: {
                fuelForWarp: parseFloat(fuelNeedForWarpToTheMiddle.toFixed(2)),
                fuelNeedForSubwarp: parseFloat(fuelNeedForSubw.toFixed(2)),
                generalDistance: parseFloat(moveDistToTheEnd.toFixed(2)),
                timeForWarp: parseFloat(warpTimeToTheMiddle.toFixed(2)),
                timeForSubwarp: parseFloat(subwTime.toFixed(2)),
                generalTime: parseFloat(((warpTimeToTheMiddle + subwTime) / 60).toFixed(2)),
                generalFuelBurn: parseFloat((fuelNeedForWarpToTheMiddle + fuelNeedForSubw).toFixed(2)),
                profitInTime,
                profitInFuel,
                midlePoint: element.map(Number),
            },
        }
        possibleWariants.push(calculateMoving)
    }
    const filtered = (x) => x.combinationWarpSubwarp.timeForSubwarp > warpCd
    const sorted = (a, b) => b.combinationWarpSubwarp.timeForSubwarp - a.combinationWarpSubwarp.timeForSubwarp
    //   console.log('possibleWariants', possibleWariants.sort(sorted));
    const mostInterest = possibleWariants.reduce((max, obj) => {
        return obj.combinationWarpSubwarp.profitInTime > max.combinationWarpSubwarp.profitInTime && obj.combinationWarpSubwarp.timeForSubwarp >= warpCd ? obj : max
    }, possibleWariants[0])
    nextWarpCoord = mostInterest.combinationWarpSubwarp.midlePoint.map((i) => new BN(i))

    return mostInterest
}
export const calculateSubwarpTime = (fleetMovementStats, distance) => {
    return fleetMovementStats.subwarpSpeed > 0 ? distance / (fleetMovementStats.subwarpSpeed / 1e6) : 0
}
export const calculateWarpTime = (fleetMovementStats, distance) => {
    return fleetMovementStats.warpSpeed > 0 ? distance / (fleetMovementStats.warpSpeed / 1e6) : 0
}
export const calculateMovementDistance = (orig, dest) => {
    const originCoord = orig.map(Number)
    const destinationCoord = dest.map(Number)
    return dest ? Math.sqrt((originCoord[0] - destinationCoord[0]) ** 2 + (originCoord[1] - destinationCoord[1]) ** 2) : 0
}
export const calculateSubwarpFuelBurn = (fleet, distance) => {
    return distance * (fleet.subwarpFuelConsumptionRate / 100)
}
export const calculateWarpFuelBurn = (fleet, distance) => {
    return distance * (fleet.warpFuelConsumptionRate / 100)
}
export const calculateMiningDuration = (cargoCapacity, miningRate, resourceHardness, systemRichness) => {
    return resourceHardness > 0 ? Math.ceil(cargoCapacity / (((miningRate / 10000) * (systemRichness / 100)) / (resourceHardness / 100))) : 0
}
export const calculateFuelRequirement = (fuelLevelOnBase, curentFuelLevel, fuelCapacity, fuelRequirement) => {
    let fuelToReturn = null
    const needFuel = fuelRequirement - curentFuelLevel
    if (fuelLevelOnBase === 0) {
        return -1
    }
    if (fuelLevelOnBase < fuelCapacity) {
        fuelToReturn = fuelLevelOnBase
        return fuelToReturn
    }

    fuelToReturn = needFuel < 0 ? 0 : needFuel
    return fuelToReturn
}
