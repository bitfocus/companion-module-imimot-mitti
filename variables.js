export function getVariables() {
	const variables = []

	//Standard Variables
	variables.push({
		name: 'Name of the playing cue',
		variableId: 'currentCueName',
	})

	variables.push({
		name: 'Cue ID of the playing cue',
		variableId: 'currentCueID',
	})

	variables.push({
		name: 'Previous cue in playlist',
		variableId: 'previousCueName',
	})

	variables.push({
		name: 'Next cue in playlist',
		variableId: 'nextCueName',
	})

	variables.push({
		name: 'Name of currently selected cue',
		variableId: 'selectedCueName',
	})

	variables.push({
		name: 'Cue ID of the currently selected cue',
		variableId: 'selectedCueID',
	})

	variables.push({
		name: 'Play/ Pause Status',
		variableId: 'playStatus',
	})

	variables.push({
		name: 'Time remaining for current cue, will shorten to -MM:SS if less than 1 hour',
		variableId: 'cueTimeLeft',
	})

	variables.push({
		name: 'Time remaining for current cue, will always show full -HH:MM:SS timecode',
		variableId: 'cueTimeLeft_hhmmss',
	})

	variables.push({
		name: 'Time remaining for current cue (hours)',
		variableId: 'cueTimeLeft_h',
	})

	variables.push({
		name: 'Time remaining for current cue (minutes)',
		variableId: 'cueTimeLeft_m',
	})

	variables.push({
		name: 'Time remaining for current cue (seconds)',
		variableId: 'cueTimeLeft_s',
	})

	variables.push({
		name: 'Total run time (TRT) for current cue, will shorten to MM:SS if less than 1 hour',
		variableId: 'currentCueTRT',
	})

	variables.push({
		name: 'Total run time (TRT) for current cue, will always show full HH:MM:SS timecode',
		variableId: 'currentCueTRT_hhmmss',
	})

	variables.push({
		name: 'Total run time (TRT) for current cue (hours)',
		variableId: 'currentCueTRT_h',
	})

	variables.push({
		name: 'Total run time (TRT) for current cue (minutes)',
		variableId: 'currentCueTRT_m',
	})

	variables.push({
		name: 'Total run time (TRT) for current cue (seconds)',
		variableId: 'currentCueTRT_s',
	})

	variables.push({
		name: 'Audio mute status for current cue',
		variableId: 'currentCueAudio',
	})

	variables.push({
		name: 'Pause At Beginning status for current cue',
		variableId: 'currentCuePauseAtBeginning',
	})

	variables.push({
		name: 'Pause At End status for current cue',
		variableId: 'currentCuePauseAtEnd',
	})

	variables.push({
		name: 'Fade In status for current cue',
		variableId: 'currentCueFadeIn',
	})

	variables.push({
		name: 'Fade Out status for current cue',
		variableId: 'currentCueFadeOut',
	})

	variables.push({
		name: 'Loop status for current cue',
		variableId: 'currentCueLoop',
	})

	variables.push({
		name: 'Transition status for current cue',
		variableId: 'currentCueTransition',
	})

	variables.push({
		name: 'Goto status for current cue',
		variableId: 'currentCueGoto',
	})

	variables.push({
		name: 'Current status of video outputs',
		variableId: 'video_outputs',
	})

	this.setVariableValues({
		currentCueName: 'None',
		currentCueID: 'None',
		previousCueName: 'None',
		nextCueName: 'None',
		selectedCueName: 'None',
		selectedCueID: 'None',
		playStatus: 'Paused',
		cueTimeLeft: '-00:00:00',
		cueTimeLeft_hhmmss: '-00:00:00',
		cueTimeLeft_h: '00',
		cueTimeLeft_m: '00',
		cueTimeLeft_s: '00',
		currentCueTRT: '00:00:00',
		currentCueTRT_hhmmss: '00:00:00',
		currentCueTRT_h: '00',
		currentCueTRT_m: '00',
		currentCueTRT_s: '00',
		currentCueAudio: '',
		currentCuePauseAtBeginning: '',
		currentCuePauseAtEnd: '',
		currentCueFadeIn: '',
		currentCueFadeOut: '',
		currentCueLoop: '',
		currentCueTransition: '',
		currentCueGoto: '',
		video_outputs: this.states?.videoOutputs ? 'Active' : 'Off',
	})

	//Cue Variables
	for (let cueID in this.cues) {
		let cue = this.cues[cueID]
		variables.push({
			name: `Cue ${cueID} - Name`,
			variableId: `cue_${cueID}_cueName`,
		})
		this.setVariableValues({ [`cue_${cueID}_cueName`]: cue?.cueName })
	}

	return variables
}
