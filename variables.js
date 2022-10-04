exports.updateVariableDefinitions = function () {
	const variables = []

	variables.push({
		label: 'Name of the playing cue',
		name: 'currentCueName',
	})
	this.setVariable('currentCueName', 'None')

	variables.push({
		label: 'Cue ID of the playing cue',
		name: 'currentCueID',
	})
	this.setVariable('currentCueID', 'None')

	variables.push({
		label: 'Previous cue in playlist',
		name: 'previousCueName',
	})
	this.setVariable('previousCueName', 'None')

	variables.push({
		label: 'Next cue in playlist',
		name: 'nextCueName',
	})
	this.setVariable('nextCueName', 'None')

	variables.push({
		label: 'Name of currently selected cue',
		name: 'selectedCueName',
	})
	this.setVariable('selectedCueName', 'None')

	variables.push({
		label: 'Cue ID of the currently selected cue',
		name: 'selectedCueID',
	})
	this.setVariable('selectedCueID', 'None')

	variables.push({
		label: 'Play/ Pause Status',
		name: 'playStatus',
	})
	this.setVariable('playStatus', 'Paused')

	variables.push({
		label: 'Time remaining for current cue (-HH:MM:SS)',
		name: 'cueTimeLeft',
	})
	this.setVariable('cueTimeLeft', '-00:00:00')

	variables.push({
		label: 'Time remaining for current cue (hours)',
		name: 'cueTimeLeft_h',
	})
	this.setVariable('cueTimeLeft_h', '00')

	variables.push({
		label: 'Time remaining for current cue (minutes)',
		name: 'cueTimeLeft_m',
	})
	this.setVariable('cueTimeLeft_m', '00')

	variables.push({
		label: 'Time remaining for current cue (seconds)',
		name: 'cueTimeLeft_s',
	})
	this.setVariable('cueTimeLeft_s', '00')

	variables.push({
		label: 'Total run time (TRT) for current cue',
		name: 'currentCueTRT',
	})
	this.setVariable('currentCueTRT', '00:00:00')

	for (let cueID in this.cues) {
		let cue = this.cues[cueID]
		variables.push({
			label: `Cue ${cueID} - Name`,
			name: `cue_${cueID}_cueName`,
		})
		this.setVariable(`cue_${cueID}_cueName`, cue?.cueName)
	}

	this.setVariableDefinitions(variables)
}
