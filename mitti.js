var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;
	// super-constructor
	instance_skel.apply(this, arguments);
	self.actions(); // export actions
	self.init_presets();
	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;
	self.init_presets();
	self.config = config;
};

instance.prototype.init = function() {
	var self = this;
	self.status(self.STATE_OK); // status ok!
	self.init_presets();
	debug = self.debug;
	log = self.log;
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			tooltip: 'The IP of the computer running Mitti',
			width: 6,
			regex: self.REGEX_IP
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;
	debug("destory", self.id);;
};

instance.prototype.init_presets = function () {
	var self = this;
	var presets = [];

		presets.push({
			category: 'Main',
			label: 'Play',
			bank: {
				style: 'text',
				text: 'PLAY',
				size: '18',
				color: self.rgb(0,0,0),
				bgcolor: self.rgb(0,255,0)
			},
			actions: [
				{
					action: 'play',
				}
			]
		});


		presets.push({
			category: 'Main',
			label: 'Toggle Play',
			bank: {
				style: 'text',
				text: 'TOGGLE\\nPLAY',
				size: '14',
				color: self.rgb(0,0,0),
				bgcolor: self.rgb(0,255,0),
				latch: true
			},
			actions: [
				{
					action: 'toggle_play',
					options: {
						bol: 1,
					}
				}
			],
			release_actions: [
				{
					action: 'toggle_play',
					options: {
						bol: 0,
					}
				}
			]
		});

		presets.push({
			category: 'Main',
			label: 'Play Selected',
			bank: {
				style: 'text',
				text: 'PLAY\\nSELECT',
				size: '14',
				color: self.rgb(0,0,0),
				bgcolor: self.rgb(0,255,0)
			},
			actions: [
				{
					action: 'play_select',
				}
			]
		});

		presets.push({
			category: 'Main',
			label: 'Jump to specific cue and play',
			bank: {
				style: 'text',
				text: 'JUMP\\nCUE\\nPLAY',
				size: '14',
				color: self.rgb(0,0,0),
				bgcolor: self.rgb(0,255,0)
			},
			actions: [
				{
					action: 'jump_cue',
				},
				{
					action: 'play',
					delay: '100',
				}
			]
		});

		presets.push({
			category: 'Main',
			label: 'Stop',
			bank: {
				style: 'text',
				text: 'STOP',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(255,0,0)
			},
			actions: [
				{
					action: 'stop',
				}
			]
		});



		presets.push({
			category: 'Main',
			label: 'Panic',
			bank: {
				style: 'text',
				text: 'PANIC',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(255,0,0)
			},
			actions: [
				{
					action: 'panic',
				}
			]
		});

		presets.push({
			category: 'Main',
			label: 'Rewind',
			bank: {
				style: 'text',
				text: 'REWIND',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0,0,255)
			},
			actions: [
				{
					action: 'rewind',
				}
			]
		});

		presets.push({
			category: 'Main',
			label: 'Jump to previous',
			bank: {
				style: 'text',
				text: 'JUMP\\nPREV',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,255)
			},
			actions: [
				{
					action: 'jump_prev',
				}
			]
		});

		presets.push({
			category: 'Main',
			label: 'Jump to next',
			bank: {
				style: 'text',
				text: 'JUMP\\nNEXT',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,255)
			},
			actions: [
				{
					action: 'jump_next',
				}
			]
		});

		presets.push({
			category: 'Main',
			label: 'Select previous',
			bank: {
				style: 'text',
				text: 'SELECT\\nPREV',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0,0,255)
			},
			actions: [
				{
					action: 'select_prev',
				}
			]
		});

		presets.push({
			category: 'Main',
			label: 'Select next',
			bank: {
				style: 'text',
				text: 'SELECT\\nNEXT',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0,0,255)
			},
			actions: [
				{
					action: 'select_next',
				}
			]
		});



		presets.push({
			category: 'Main',
			label: 'Goto 30',
			bank: {
				style: 'text',
				text: 'GOTO\\n30',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,255)
			},
			actions: [
				{
					action: 'goto_30',
				}
			]
		});

		presets.push({
			category: 'Main',
			label: 'Goto 20',
			bank: {
				style: 'text',
				text: 'GOTO\\n20',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,255)
			},
			actions: [
				{
					action: 'goto_20',
				}
			]
		});

		presets.push({
			category: 'Main',
			label: 'Goto 10',
			bank: {
				style: 'text',
				text: 'GOTO\\n10',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,255)
			},
			actions: [
				{
					action: 'goto_10',
				}
			]
		});

		presets.push({
			category: 'Main',
			label: 'Loacate',
			bank: {
				style: 'text',
				text: 'LOCATE',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,255)
			},
			actions: [
				{
					action: 'locate',
				}
			]
		});

		presets.push({
			category: 'Main',
			label: 'Jump to specific cue',
			bank: {
				style: 'text',
				text: 'JUMP\\nCUE',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(255,0,100)
			},
			actions: [
				{
					action: 'jump_cue',
				}
			]
		});



		presets.push({
			category: 'Main',
			label: 'Select cue ',
			bank: {
				style: 'text',
				text: 'SELECT\\nCUE',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(255,0,100)
			},
			actions: [
				{
					action: 'select_cue',
				}
			]
		});


		self.setPresetDefinitions(presets);
}



instance.prototype.actions = function(system) {
	var self = this;
	self.system.emit('instance_actions', self.id, {
		'play':         { label: 'Play' },
		'toggle_play':  { label: 'Toggle Play' },
		'stop':         { label: 'Stop' },
		'panic':        { label: 'Panic' },
		'rewind':       { label: 'Rewind' },
		'jump_prev':    { label: 'Jump to previous cue' },
		'jump_next':    { label: 'Jump to next cue' },
		'jump_cue':     {
			label: 'Jump to specific cue',
			options: [{
				type: 'textinput',
				label: 'Cue number',
				id: 'cuenumber',
				default: '1',
				regex: self.REGEX_NUMBER
			}]
		},
		'select_cue':     {
			label: 'Select Cue',
			options: [{
				type: 'textinput',
				label: 'Cue number',
				id: 'cuenumber',
				default: '1',
				regex: self.REGEX_NUMBER
			}]
		},
		'select_prev':  { label: 'Select previous cue' },
		'select_next':  { label: 'Select next cue' },
		'goto_30':      { label: 'Goto 30'},
		'goto_20':      { label: 'Goto 20'},
		'goto_10':      { label: 'Goto 10'},
		'play_select':  { label: 'Play Selected Cue'},
		'locate':       { label: 'locate'}
	});
}

instance.prototype.action = function(action) {
	var self = this;
	var cmd
	var cmd2
	var arg
	var opt = action.options;
	switch(action.action){

		case 'play':
			cmd = '/mitti/play';
			break;

		case 'stop':
			cmd = '/mitti/stop';
			break;

		case 'panic':
			cmd = '/mitti/panic';
			break;

		case 'rewind':
			cmd = '/mitti/rewind';
			break;

		case 'jump_prev':
			cmd = '/mitti/jumpToPrevCue';
			break;

		case 'jump_next':
			cmd = '/mitti/jumpToNextCue';
			break;

		case 'select_prev':
			cmd = '/mitti/selectPrevCue';
			break;

		case 'select_next':
			cmd = '/mitti/selectNextCue';
			break;

		case 'goto_30':
			cmd = '/mitti/goto30';
			break;

		case 'goto_20':
			cmd = '/mitti/goto20';
			break;

		case 'goto_10':
			cmd = '/mitti/goto10';
			break;

		case 'toggle_play':
			arg = {
						type: "i",
						value: opt.bol
			};
			cmd = '/mitti/togglePlay';
			break;

		case 'play_select':
			cmd = '/mitti/playSelectedCue';
			break;

		case 'locate':
			cmd = '/mitti/locate';
			break;

		case 'jump_cue':
			cmd = '/mitti/'+ opt.cuenumber + '/jump';
			break;

		case 'select_cue':
			cmd = '/mitti/'+ opt.cuenumber + '/select';
			break;
	}

	if (cmd !== undefined && arg == undefined ) {
		debug(cmd,arg);
		self.system.emit('osc_send', self.config.host, 51000, cmd, []);
	}

	if (cmd !== undefined && arg !== undefined) {
		debug(cmd,arg);
		self.system.emit('osc_send', self.config.host, 51000, cmd, [arg]);
	}

};

instance.module_info = {
	label: 'Imimot Mitti OSC',
	id: 'mitti',
	version: '1.2.0'
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
