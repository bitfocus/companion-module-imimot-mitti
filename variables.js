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
		name: 'Time remaining for current cue (-HH:MM:SS)',
		variableId: 'cueTimeLeft',
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
		name: 'Total run time (TRT) for current cue',
		variableId: 'currentCueTRT',
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
		cueTimeLeft_h: '00',
		cueTimeLeft_m: '00',
		cueTimeLeft_s: '00',
		currentCueTRT: '00:00:00',
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
