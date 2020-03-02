## Mitti
Sends OSC commands to port 51000.

In Mitti > Preferences... > OSC/UDP Controls, make sure "Enabled" is selected.
![Mitti](images/mitti.jpg?raw=true "Mitti")

**Available Actions**

* Play
* Toggle Play
* Stop
* Panic
* Rewind
* Jump to previous cue
* Jump to next cue
* Jump to specific cue (number)
* Select previous cue
* Select next cue
* Goto 30
* Goto 20
* Goto 10
* Play Selected Cue
* Toggle Fullscreen
* Fullscreen On
* Fullscreen Off
* Toggle Playlist Loop
* Playlist Loop On
* Playlist Loop Off
* Toggle Playlist Transition on Play
* Transition on Play Off
* Transition on Play On

**Available Feedback**

* Play/Pause Status

**Available Variables**

* Current Cue Name
* Previous Cue Name
* Next Cue Name
* Time Left in Current Cue
* Play/Pause Status

**Enabling Button Variables & Feedback**
* In Mitti > Preferences... > OSC/UDP Controls, select "Custom" from the "Feedback To:" dropdown.
* For "IP:" enter the IP address for the computer running Companion.
* For "Port:" enter the port number that is present on the configuration page for the Mitti module in Companion. By default, it's 51001.
![Mitti](images/mitti_feedback.jpg?raw=true "Mitti")