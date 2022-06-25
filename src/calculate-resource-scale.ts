// num = min(Screen.width, Screen.height)
// num2 = num / 160
// num3 = min(max(1, floor(num2)), 8)
// if (num3 > 4 && num3 % 2 != 0) { num3 -= 1 }

export const calculateResourceScale = (width: number, height: number) => {
    const minimum = Math.min(width, height);
    const scale = minimum / 160;
    let clamped = Math.min(Math.max(1, Math.floor(scale)), 8);
    if (clamped > 4 && clamped % 2 != 0) clamped -= 1;
    return clamped;
};
