## Mitti

**Basic Configuration**

- In Mitti > Preferences... > OSC/UDP Controls, make sure "Enabled" is selected.
- In the configuration page for the Mitti module in Companion, enter the IP address of the computer running Mitti.

**Enabling Button Variables & Feedback**

- In Mitti > Preferences... > OSC/UDP Controls, select **Custom** from the **Feedback To** dropdown.
- For **IP** enter the IP address for the computer running Companion.
- For **Port** enter the port number that is present on the configuration page for the Mitti module in Companion. By default port 51001 is used.

![Mitti](images/mitti.png?raw=true 'Mitti')

**Available Actions**

- Play
- Toggle Play
- Stop
- Panic
- Rewind
- Jump to previous cue
- Jump to next cue
- Jump to specific cue
- Jump to selected cue
- Jump to cue with name
- Select previous cue
- Select next cue
- Goto 30
- Goto 20
- Goto 10
- Play Selected Cue
- Play cue with number / ID
- Play cue with name
- Toggle Fullscreen
- Fullscreen On
- Fullscreen Off
- Toggle Playlist Loop
- Playlist Loop On
- Playlist Loop Off
- Toggle Playlist Transition on Play
- Transition on Play Off
- Transition on Play On
- Cue Scale
- Cue Position
- Cue Crop
- Cue Rotation
- Cue Hue
- Cue Saturation
- Cue Vibrance
- Cue Brightness
- Cue Contrast
- Cue Opacity
- Cue Volume
- Resend OSC Feedback

**Available Feedback**

- Play/Pause Status

**Available Variables**

- currentCueName
- previousCueName
- nextCueName
- selectedCueName
- playStatus
- cueTimeLeft **_Time remaining for current cue (-HH:MM:SS)_**
- cueTimeLeft_h **_Time remaining for current cue (hours)_**
- cueTimeLeft_m **_Time remaining for current cue (minutes)_**
- cueTimeLeft_s **_Time remaining for current cue (minutes)_**
- currentCueTRT **_Total Runtime (TRT) of Current Cue_**
