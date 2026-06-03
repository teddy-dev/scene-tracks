const MODULE_ID = "scene-tracks";


export function registerSettings() {
    game.settings.register(MODULE_ID, "trackVolume", {
        name: "Volume",
        hint: "What volume Scene Tracks play at.",
        scope: "client",
        config: true,
        type: Number,
        default: 0.5,
        range: {
            min: 0.0,
            max: 1.0,
            step: 0.1
        }
    });
}

