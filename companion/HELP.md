# Imimot Mitti

This module will allow you to control [Mitti](https://imimot.com/mitti), a modern, feature-packed but easy-to-use pro video playback solution for live events and exhibitions.

## Requirements

- Mitti with OSC control enabled
- Bitfocus Buttons: v1.8.0 or newer
- Bitfocus Companion: v5.0.0 or newer
- Some features require specific a version of Mitti. The action or feedback description will contain information about version requirements if applicable.

## Basic Configuration

- In Mitti > Settings... > OSC/UDP Controls, select "Enable"
- In the configuration page for the Mitti module, choose your Mitti from the **Mitti Connection** dropdown. Mitti instances on the network are discovered automatically.
- If your Mitti isn't listed or you wish to manually setup the connection, select **Manual** and enter the IP address of the computer running Mitti in **IP Address**

## Enabling Button Variables & Feedbacks

- In Mitti > Settings... > OSC/UDP Controls, select **Bitfocus-Mitti-Module** from the **Feedback To** dropdown
- If **Bitfocus-Mitti-Module** is not an option, select **Custom** then follow the next steps:
  - For **IP** enter the IP address of the computer running Companion or Buttons
  - For **Port** enter the port number that is present on the configuration page for the Mitti module. By default port `51001` is used
- _Optional: Enable **Feedback Alert** in the module settings. This will show an error when the module does not receive feedback from Mitti. Disable this feature if you do not plan on using the Feedback features._

![Mitti](images/mitti.png?raw=true 'Mitti')

## What's Included

- **Actions** for playlist transport (play, pause, rewind, panic, goto), cue selection and navigation, playing cues by number / ID, name or index, playlist settings, fullscreen, video and audio outputs, the master fader and playhead
- **Cue actions** that change a cue's audio, volume, fades, loop, transition, goto, pause at beginning / end, playback speed, scale, position, crop, rotation and colour. Cue fields accept a cue number or ID, or `current`, `selected`, `previous`, `next` or `all`
- **Feedbacks** for play / pause status, the playing, active and selected cue, per-cue settings, time remaining on the playing cue, video and audio outputs, and whether Set In / Out from Playhead is available
- **Variables** for the current, previous, next and selected cue, play status, time remaining, time elapsed and total run time of the current cue, the current cue's settings, video and audio outputs, and a name variable for every cue in the playlist (`cue_<number>_cueName`)
- **Presets** for all of the above, including a "Play Cue by ID" button for every cue in the playlist
