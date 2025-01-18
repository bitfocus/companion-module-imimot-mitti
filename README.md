# companion-module-imimot-mitti

This module will allow you to control Mitti, a modern, feature-packed but easy-to-use pro video playback solution for live events and exhibitions.

## Getting Started

See [HELP.md](./companion/HELP.md) and [LICENSE](./LICENSE)

## Changelog

### v3.8.0

- New
  - Ability to discover Mitti instances on the network via Bonjour in Companion configuration panel
  - Announce the Companion Mitti Module via Bonjour for easy feedback configuration in the Mitti preferences
  - Action: Set In from Playhead
  - Action: Set Out from Playhead

### v3.7.2

- New
  - Update default port to new Mitti default for feedback, `51001`. This default will only apply to new installations.

### v3.7.1

- Fix
  - Cleanup development logging

### v3.7.0

- New
  - Feedback: Cue ID - Audio Enabled
  - Feedback: Cue ID - Pause at Beginning Enabled
  - Feedback: Cue ID - Pause at End Enabled
  - Feedback: Cue ID - Fade In Enabled
  - Feedback: Cue ID - Fade Out Enabled
  - Feedback: Cue ID - Loop Enabled
- Feedback: Cue ID - Transition Enabled
  - Feedback: Cue ID - Goto Enabled
  - Variable: cueTimeElapsed
  - Variable: cueTimeElapsed_hhmmss
  - Variable: cueTimeElapsed_h
  - Variable: cueTimeElapsed_m
  - Variable: cueTimeElapsed_s

### v3.6.0

- New
  - Ability to select "all" in Cue ID-based actions to apply action to all cues
  - Feedback: Cue ID - Audio Status
  - Action: Toggle Video Output
  - Action: Video Outputs On
  - Action: Video Outputs Off
  - Variable: cueTimeLeft_hhmmss
  - Variable: currentCueTRT_hhmmss
  - Variable: currentCueTRT_h
  - Variable: currentCueTRT_m
  - Variable: currentCueTRT_s

### v3.5.0

- New
  - Action: Set Cue Playback Speed
  - Action: Toggle Video Output
  - Action: Video Outputs On
  - Action: Video Outputs Off

### v3.4.1

- Fix
  - Prevent error if timecode doesn't match expected format
  - Cue time variables showing as undefined

### v3.4.0

- New
  - Action: Adjust Playhead

### v3.3.2

- Fix
  - Feedbacks not updating when variables change

### v3.3.1

- Fix
  - Variables in feedbacks not working

### v3.3.0

- New
  - Variable: currentCueAudio
  - Variable: currentCuePauseAtBeginning
  - Variable: currentCuePauseAtEnd
  - Variable: currentCueFadeIn
  - Variable: currentCueFadeOut
  - Variable: currentCueLoop
  - Variable: currentCueTransition
  - Variable: currentCueGoto

### v3.2.0

- New
  - Ability to set different values for horizontal and vertical scale in Cue Scale action

### v3.1.0

- New
  - Action: Toggle Goto Cue after End
  - Action: Goto after End On
  - Action: Goto after End Off
  - Action: Set Goto after End Cue

### v3.0.0

- New
  - Rewrite module for Companion v3

### Versions Before v3.0.0

Versions of the module before v3.0.0 are no longer supported.
