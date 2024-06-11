export const getAvailableJumpPoints = (startX, startY, maxDistance) => {
    const availablePoints = []
    const intDistance = Math.floor(maxDistance)
    const realDist = Number(maxDistance.toFixed(2))
    //   console.log('realDist', realDist);
    for (let i = startX - intDistance; i <= startX + intDistance; i++) {
        for (let j = startY - intDistance; j <= startY + intDistance; j++) {
            const distance = Math.sqrt((i - startX) ** 2 + (j - startY) ** 2)
            const floatedDistance = parseFloat(distance.toFixed(2))
            if (floatedDistance <= realDist) {
                availablePoints.push([i, j])
            }
        }
    }

    return availablePoints
}
