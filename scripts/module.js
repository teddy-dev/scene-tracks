const MODULE_ID = "scene-tracks";

import { registerSettings } from './settings.js';

let playingTrack = null;

const clearNowPlaying = () => {
    playingTrack.stop();
    playingTrack = null;
    return;
}

Hooks.once('setup', () => {
    registerSettings();
    return;
});

Hooks.on("canvasInit", async (canvas) => {
    const path = game.canvas.scene.getFlag(MODULE_ID, "scene-track") || null;
    if (path) await foundry.audio.AudioHelper.preloadSound(path);
    return;
});

Hooks.on('canvasReady', async () => {
    const path = game.canvas.scene.getFlag(MODULE_ID, "scene-track") || null;
    if (path) {
        if (playingTrack && playingTrack.src == path) return;
        if (playingTrack && playingTrack.src !== path) clearNowPlaying();

        playingTrack = await foundry.audio.AudioHelper.play({
            src: path,
            volume: game.settings.get(MODULE_ID, "trackVolume"),
            loop: true,
            autoplay: true,
            channel: "music",
        }, false);
    } else if (playingTrack) clearNowPlaying();
    return;
});

Hooks.on('renderSceneConfig', (app, html, data) => {
    const input = `<fieldset>
        <legend>Scene Tracks</legend>
        <div class="form-group">
            <label for="${MODULE_ID}-file">Background Track</label>
            <div class="form-fields">
                <input type="text" id="${MODULE_ID}-file" name="flags.${MODULE_ID}.scene-track" value="${app.document.getFlag(MODULE_ID, 'scene-track') || ''}" placeholder="path/to/track.ogg" />
                <button type="button" class="file-picker" data-type="file" data-target="${MODULE_ID}-file">
                    <i class="fas fa-file-import fa-fw icon"></i>
                </button>
            </div>
            <p class="hint">
                Track that plays for players on this scene.
            </p>
        </div>
    </fieldset>`;

    const root = html instanceof HTMLElement ? html : html?.[0];
    const target = (game.release.generation === 14 ? 
        root.querySelector('[data-application-part="misc"] > fieldset:last-of-type'):
        root.querySelector('[data-tab="basic"] > fieldset:last-of-type'));
    if (target) target.insertAdjacentHTML('afterend', input);

    const fileButton = root.querySelector(`button[data-target="${MODULE_ID}-file"]`);
    if (fileButton) {
        fileButton.addEventListener('click', async (event) => {
            const fp = new FilePicker({
                type: "audio",
                callback: (path) => {
                    root.querySelector(`#${MODULE_ID}-file`).value = path;
                }
            });
            fp.browse();
        });
    }
    return;
});