export var colors = [
    "#F25C54",
    "#F7B267",
    "#FFEA00",
    "#EFBDEB",
    "#6461A0",
    "#3C91E6",
    "#A2D729",
    "#FA824C",
    "#8661C1",
    "#45CB85",

    "#3066BE",
    "#28C2FF",
    "#B4ADEA",
    "#59FFA0",
    "#9DD9D2",
    "#99B2DD",
];

export function hexToRGB(hex, alpha) {
    try {
        var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

        if (alpha) {
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        } else {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    } catch (error) {
        console.error(error);
        return "rgb(0, 0, 0, 1)";
    }
}