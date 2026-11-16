# Changelog

All notable changes to this module are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0-beta.1] - Unreleased

### Added

- Variables: `cueTimeLeft_total_seconds`, `cueTimeElapsed_total_seconds` and `currentCueTRT_total_seconds` expose the total seconds for calculations and progress displays

### Changed

- Requires Companion v5.0.0 or newer, or Buttons v1.8.0 or newer
- Any action or feedback field can now be driven by an expression
- Redesigned presets
- Config: Feedback Port is now a number field. Existing values are converted automatically.
- Action: Play cue at index now uses a number field for the cue index. Existing values, including variables, are converted automatically.
- Variable: `currentCueAudio` now reports "Muted" / "Unmuted" instead of "Off" / "On"
- Variable and feedback updates from Mitti are now batched, and unchanged values are no longer resent
- Module rewritten in TypeScript

### Fixed

- Deleted or renumbered cues no longer leave stale variables or presets
- Presets: Off buttons no longer highlight before feedback has established their state
- Presets: Register feedback definitions before presets to avoid unknown feedback warnings on startup
- Config: Changing the IP address to an invalid value now disconnects, instead of continuing to use the previous address
- Feedback messages with unexpected cue names can no longer corrupt module state
- Feedback: Time Remaining on Playing Cue was incorrect for cues longer than one hour
- Variable: `cueTimeElapsed` showed the minutes in place of the hours for cues longer than one hour
- Variable: `currentCueName` could be overwritten by the current cue's volume
- Presets: Play Cue by ID no longer lists the "current", "previous" and "next" cues

## [3.10.2] - 2025-12-07

### Fixed

- Possible issues with auto discovery creating multiple instances when more than one network interface is present
- Remove duplicate variables for current, previous, and next cue types
- Prevent "0" cue variable from accidentally showing on import
- Variables no longer provide value until real data is received to avoid confusion

## [3.10.1] - 2025-11-05

### Fixed

- Ensure "current", "next", and "previous" cue values return feedback correctly

## [3.10.0] - 2025-10-18

### Added

- Action: Adjust Current Cue Playback Speed
- Action: Locate Playhead with Timecode
- Variable: Current Cue Playback Speed

## [3.9.2] - 2025-08-31

### Fixed

- Ensure variable values are parsed appropriately in the Scrub Playhead with Timecode action

## [3.9.1] - 2025-06-02

### Fixed

- Prevent non-Mitti OSC endpoints from being suggested in the module configuration dropdown

## [3.9.0] - 2025-03-22

### Added

- Action: Play cue at index
- Action: Toggle Audio Outputs
- Action: Audio Outputs On
- Action: Audio Outputs Off
- Action: Adjust Current Cue Volume
- Action: Scrub Playhead with Timecode
- Feedback: Set In / Out from Playhead Available
- Feedback: Audio Outputs Active
- Variable: `audio_outputs`
- Variable: `currentCueVolume`
- Option to use Force Cut (uses an instant cut, regardless of whether a transition is enabled) for the following actions:
  - Play Selected Cue
  - Play Cue with name
  - Play cue with number / ID
  - Play cue at index

## [3.8.1] - 2025-02-27

### Fixed

- Default to localhost when no Bonjour connections are found
- Prevent crash when feedback port is undefined

## [3.8.0] - 2025-01-18

### Added

- Ability to discover Mitti instances on the network via Bonjour in Companion configuration panel
- Announce the Companion Mitti Module via Bonjour for easy feedback configuration in the Mitti preferences
- Action: Set In from Playhead
- Action: Set Out from Playhead

## [3.7.2] - 2024-11-15

### Changed

- Update default port to new Mitti default for feedback, `51001`. This default will only apply to new installations.

## [3.7.1] - 2024-08-26

### Fixed

- Cleanup development logging

## [3.7.0] - 2024-06-02

### Added

- Feedback: Cue ID - Audio Enabled
- Feedback: Cue ID - Pause at Beginning Enabled
- Feedback: Cue ID - Pause at End Enabled
- Feedback: Cue ID - Fade In Enabled
- Feedback: Cue ID - Fade Out Enabled
- Feedback: Cue ID - Loop Enabled
- Feedback: Cue ID - Transition Enabled
- Feedback: Cue ID - Goto Enabled
- Variable: `cueTimeElapsed`
- Variable: `cueTimeElapsed_hhmmss`
- Variable: `cueTimeElapsed_h`
- Variable: `cueTimeElapsed_m`
- Variable: `cueTimeElapsed_s`

## [3.6.0] - 2024-06-01

### Added

- Ability to select "all" in Cue ID-based actions to apply action to all cues
- Feedback: Cue ID - Audio Status
- Action: Toggle Video Output
- Action: Video Outputs On
- Action: Video Outputs Off
- Variable: `cueTimeLeft_hhmmss`
- Variable: `currentCueTRT_hhmmss`
- Variable: `currentCueTRT_h`
- Variable: `currentCueTRT_m`
- Variable: `currentCueTRT_s`

## [3.5.0] - 2024-05-01

### Added

- Action: Set Cue Playback Speed
- Action: Toggle Video Output
- Action: Video Outputs On
- Action: Video Outputs Off

## [3.4.1] - 2024-01-20

### Fixed

- Prevent error if timecode doesn't match expected format
- Cue time variables showing as undefined

## [3.4.0] - 2023-12-30

### Added

- Action: Adjust Playhead

## [3.3.2] - 2023-08-13

### Fixed

- Feedbacks not updating when variables change

## [3.3.1] - 2023-08-02

### Fixed

- Variables in feedbacks not working

## [3.3.0] - 2023-06-09

### Added

- Variable: `currentCueAudio`
- Variable: `currentCuePauseAtBeginning`
- Variable: `currentCuePauseAtEnd`
- Variable: `currentCueFadeIn`
- Variable: `currentCueFadeOut`
- Variable: `currentCueLoop`
- Variable: `currentCueTransition`
- Variable: `currentCueGoto`

## [3.2.0] - 2023-05-22

### Added

- Ability to set different values for horizontal and vertical scale in Cue Scale action

## [3.1.0] - 2023-01-17

### Added

- Action: Toggle Goto Cue after End
- Action: Goto after End On
- Action: Goto after End Off
- Action: Set Goto after End Cue

## [3.0.0] - 2022-11-25

### Changed

- Rewrite module for Companion v3

## Versions Before 3.0.0

Versions of the module before 3.0.0 are no longer supported.

[4.0.0-beta.1]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.10.2...HEAD
[3.10.2]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.10.1...v3.10.2
[3.10.1]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.10.0...v3.10.1
[3.10.0]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.9.2...v3.10.0
[3.9.2]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.9.1...v3.9.2
[3.9.1]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.9.0...v3.9.1
[3.9.0]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.8.1...v3.9.0
[3.8.1]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.8.0...v3.8.1
[3.8.0]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.7.2...v3.8.0
[3.7.2]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.7.1...v3.7.2
[3.7.1]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.7.0...v3.7.1
[3.7.0]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.6.0...v3.7.0
[3.6.0]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.5.0...v3.6.0
[3.5.0]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.4.1...v3.5.0
[3.4.1]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.4.0...v3.4.1
[3.4.0]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.3.2...v3.4.0
[3.3.2]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.3.1...v3.3.2
[3.3.1]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.3.0...v3.3.1
[3.3.0]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.2.0...v3.3.0
[3.2.0]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/bitfocus/companion-module-imimot-mitti/compare/v3.0.2...v3.1.0
[3.0.0]: https://github.com/bitfocus/companion-module-imimot-mitti/releases/tag/v3.0.0
