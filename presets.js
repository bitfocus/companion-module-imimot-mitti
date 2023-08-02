import { combineRgb } from '@companion-module/base'

export function getPresets() {
	const ColorWhite = combineRgb(255, 255, 255)
	const ColorBlack = combineRgb(0, 0, 0)
	const ColorRed = combineRgb(200, 0, 0)
	const ColorGreen = combineRgb(0, 200, 0)
	const ColorOrange = combineRgb(255, 102, 0)

	const playIcon =
		'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFgklEQVR4nO2be2wURRzHvzOzO1tKuttCqQpIoEYeVYto4j8m6h8mGo0haKIJaiAqgmKURFsKhNBARI3xEaP8ocZA0OgfAkZoUw2kJhoeVoFSCyRi1fDoPfZKw9GW7tzM+AdeJVpou/fYvZPP5ZLL7e3Mbz/3m53H7hKtNa5yeWjQAYSdq4JGwPC7o2mamDp1KqIfRushsUCVqwnsLNtXsaRisdYaWmswxsAYgxACjDForSGlBCEEhBAopWAYBrTWUEqBEAKtNSilQ781TRMAIIQY+iylRPrUQCkFpRRSyqE6tNYQQsB1XUgpgxFECEFsU+wHMUvcmZqWuhhsD53p7nQXaKW3Tnxo4gsZRRYSfDcxsoNsEXP+kQMAaoLC4LxBW12nlvds7+k8035mYVaiDBD/56BpeExMF8NuSk1OwZvn1RgRY3NkW+RL33WEAN+CRLWwrrRdWxpejWeKavGI2+ye7t7bvdJvXUHiP4NGuaeqUPDmepPhYWN8W7wVAApp7OVfEMGYjjJVnaJijrgn0ZLoiX8ff6NQJPkX5OP4VJmCV+tV6PG63m1yO33XnUcCGSjKayW8W70a9zu3L7oz+lmYsynQkbSYKUrlFLkw3hw/ETkSWR5kLJcj8KmGrJTwar0bWIK9G98V3x62bApcUBoxUxip6akFiaZEtPtA99qwiAqNIABQ5QrePK8KGo3xb+IHgo4HCJmgNHKKpOJmcUeiNdEb2R35IMhYQikojZgtHOWo56O7okfTM/18E2pBACCvkfBqvTluq9sfa4ptzbek0AtKI2aJcXKKfCK2K9YVPRzN21JKwQgCADlRwpvrzaC99J1EU+IrIPfzuoISlEbcKIzUjNT8RHMiFv0xui6XdRG//wAdoEqP0yTL8YwZdoZplmCHKu+vvD0XS64FmUGXIidL4t3i3RbfE++N7I68n/UK0sbH+ib9REGH68W6mebt/BeksHjSpElDi/+ZvAu+iQ0HP84HtdCbRa1YlulJvOCb2HB4sz0LpVjK9rPGTMsqSkEAIKoF+AW+ItNyirKJXYpGZjEWbQZli+IVpIDSltJkpsX4vvQcZohHwNs5SJI0ZlpW0WUQPUtR0loyaB431zsrnLczLa9oMogIAvOYCaPT2CdqxUtVS6vaUiQ18o4jUBSCWJyBt/Meco685bzsbKSUZu3ICloQ6SPgHRzGCWNPeUP5vVpfnHNkk8IUJAGzywTfz09pS9c5K50vCM3NkmzBCaJJCqvNUuwk+6RsVdkSACA0d+PVwhGUAsxfTfBDvEOX6gZ7td2soUFIbgfzBSGI9lBYh61+epp+5DQ4KyilUFB5qTvUgsgAAe/kMI+aB/of6F9a9XhVO2H5nf6FU5ACjD8MlOwtcUmSbLBftd+zV9nQJP/XxUIniPZR8J85zGPmDnuD/TAhJOtd91gIjyAJmL+bsPZbpzTT9WXryz7PZe80WkIhiCYpeBtXxkljs7PGeVrr3PdOoyVYQZd03cpW9c4apwVAaOQAAQqiZymsg9YAPUk/tlfbL1JKEdQNClci74JI6uKsm3fwtoG7BpZVPVl1MN8xjAX/gny0AuYy8EP8HAbwml1nv27DDrSHGg3+BY1hIEv6CKwOC6yLfWu/Yt+XftonbM1pOPw/7XOBEF06wgH+Peu22qw/tdRr7ZX2ViBcJ+GR8P+82G+mNzhhkF9uO01S8J+4MrqMT8sbyxdlehNBUPhfk46hhbnsP1+TFAE/xjHu63GduIAHnXXOokLKmH/jO4Ocp5z5yS3JTjFL1MjrJaABFmPg7byfJugmu8GuA3K7VpMPfAtSSqHy2cqbks8l62gfvVuZajzrZUfOP3r+TecZ55SfXi6M+L70/H+h6K6LZZurgkbgL2eb8eCICuUqAAAAAElFTkSuQmCC'
	const playPlaylistIcon =
		'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAADGklEQVR4nO2bv2sUQRTHPxuiCFGiIipCQEsjEcFCEUQEFcHSQkhpAv4FRokpVPyBgrWNoIWCioiFUSRNiKCFIhixMAbUdBHRoOYXhjyLTQgkl3tv797t7d3OZ1g47t7M2/nuzNuZt7eRiBBYnoZqn0DWCQIpNFqMIiKAvcBVoA3iLzLIOHAXuABMWyoISogREfVA2IswjtRMeYzQiIB2aH2PLEE6IhoA9luuSIY4CPRrRtoIssagnUa7LHHAoxGrQLMezlJmyqMRq0AvPJylTJ9HI1aBzgKfPRymRA/wzqMha5AG2Ax0APuAVR7OK8AX4Anw1FpBC9JJBKpLvO5iuSUIpBAEUggCKQSBFIJACqZ0xxwbgJPEe5ysroO+AvdxWkUD5nRHC8Knqicx7KXLkurwTHfcA9rdrko67ALea0ZeC8WjRrssccSjEatASWJVVmjyaMQq0KCHs5QZ8GjEKtAZYMbDYUr0Ai89Gkqymz8MdJPtpxq/gYfA5bnPKpVId6y3OK4SU8BEkgohH6QQ8kFlEgRSCAIpBIEUgkAKSbcQe4DtVHYdNEq8yPtTQR92jOmOlQi3U0xXfETYYUxZbERosqY3kqY7rAL1pCjOfBlEWKN0sBvhJ8IwQns1BRqpgkCCcKxI57Yi/Ftk34ew21Mga5Bea7TzZlOR31az9CZzCHgNXAeaPU7AKtB3D2cl8K3Ib7MU/lvOCuA08BY4UfYZGKdYZxWmVx/xzWG56dFaYIoVKs8R2kqdYlaBIoRzCGMpCDOD0IuwpYg4SQQShL8I1xCakwqUdDffAmyjcilYAX4AHwy2rcRJ+STnMkz836EHCw6V/htHUBaPJCNocXnE3DrL6y5WbxwHXgGnNMNaTpiVMsUWMybIumIGeR1B86j9z7NAk8BFzSivAj0jfnPghmZYi09My2GI+IWcO9YKeRFoErgJXAJ+JamYB4H6WdibJaaeY9AI0En81k9J4kBtj6AGCl/gaeAWcJ5421IWtSzQBCzZSPUDXcAbNy81vBcD4QrCKMIQQkcpbbjs5vNMPQdpF4JACv8BuE1Hc5jPTUQAAAAASUVORK5CYII='
	const pauseIcon =
		'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEGklEQVR4nO2bT2hcRRjAf293k22Shka6CaVUbLwURGwg9Nxjz2oLevJaD7npJRja5lYQcvBei4eCQtDqwZ5y8SJLt8WkUNvNZkvYvGjLmrgx2X3/5vOQCFET583uhO3K/GDZy7xvvvm9ebNvlm88EcFxOJluJ/Cyk7Mf0ssdEFeABCS2ED8DeED+H/EBFBDvflt6NESk489uHAZFuLS0xPfPntHY3kaFIbK9japW+e3RI74U4aIIx9rPlYwIZx8/ZvbpU1Y3N4njGAlDxPdpFYv8WK3yvggjInhWxmYjiAjHRLjq+/wSBKiDmjSbJL5PVYQPROhvU86blQrf1usESv27jzBEraywUavxiQgnbUiyJehircavaZqurbEswlsi6dc/ETIbG4z4Pl80GsS6PlZX2VxZ4aoNQRYWaS9XLvNhocBomtYjI4z7Pm9jtv5lkoQLnsfl4WGyusanT3Oi0WAa6DPo4+COOw0A5Pr6uJTP46VpPDBAZmuL90ql9IJKJYZ8n3dGRxlI0z6bhfPneRX0MnXYECRjY5xI29jzoFDg9a2t9OtQpcKgUlzIdjxcc6y8Bw0MpJs9fzE4aPZ6EUXkh4Y4aZaVHawI8oz0ACBxTOr3lFwO8TyUUQeWNghWHjHTZJLErH0+j0B6ofvoWFNXthpxjIqi9MknCRLHGGq1Q1dmUBQhpoLCkHa2Kb05g6IIFQTpkw9DVBAQmPTR02tQGCKtlpmgZpPINDEbdGsNMlLaaqGCgLCNrnrzEdvbvKZOfmcHoqh3F2lj2lnUlTJ7D7JFTwgCUKrzx6UdeuYvV1u/Sqb0jKBu4QRpcII0OEEanCANTpAGJ0iDE6TBCdLgBGlwgjQ4QRqcIA1OkAYnSIMTpMEJ0uAEaXCCNDhBGpwgDU6QBidIgxOkoSsleG2U7LV1jQ26JcjoijDEEzG7xhZWBIWGhSntDFbErObZtA7yMKwIajTMKi9MKzX6+0mUYsfkmmYTeFnqg5484UXatpub8OABpfX19AVRx4/zR7PJD6ur6XMqFtuujP0bNgQlvs9X1Wq6WXH/Pk0RPrt+PX1B1NQU4ZkzfF0s8vvezPhPlpeRhQV+snI+zdJpn7N37vDz+vrBR6H2jirJw4dE164x306eV66QvXWLjxYW2Gk2D0+lXEZmZymfOsUbNsZmRRDAxgYTt2+zuLhIvH8ASiH1OnLvHq2ZGb7p9IbevMmnd++y9fw5av+ZsSBASiWS6WkqhQKTtm6+Z1yiegDe3u+8CK/MzPDx2BiXJyd5bXycvkqFoFikXKvx+dwccx13Bty4wbvDw0xNTDB57hxDtRpJsciLpSW+m59ntl5nbTcfC2OzEeSQ0Bl21zgFcgT1hZ63Fz+72wfJUdShHaGg/wduL6bBCdLwJ2gdQLcfM6oxAAAAAElFTkSuQmCC'
	const skipForwardIcon =
		'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'
	const skipBackwardIcon =
		'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'
	const playPauseIcon =
		'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAYAAAATBx+NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEpklEQVR4nO2aT28bRRjGn5mddYydP1aICFRJLVe0UaSoUosEB07wDbgg8QF6ipB6QUgcuHAAiRNfgIoDQhx6I1WhEKtpSxWQogYiAk0ICYHUponrTepkbc/My4EiJf63HnvXa9D+rD1k993nfffxeDIzO4yIENEcHnYB/U5kkAeRQR5EBnkQGeRBZJAHkUEeRAZ58J8w6OFDdlAuswOtGbkuc/J59qgbvVyO5V2XOQCjSoU5uRzbbhbLakfSdt7+TI7LlwAkQNjhDndUSr3STUGdUiiwpeFhTAkBDWDw2KX9SgUiFqOkqebjx2xvcBACwPBxvXIZ+wMDNFl3AxGdOEDYAJ34lCBxW2yJW7WxQR7b23i3VMJei5Cq4yBvolko4BERjppcLheLeFB7stFPLFPzdwIWXpan5aR1YN02/cY6JZHAxXgciRYhIpnEgYlmKoUcgHiTy7GREYzWnjTpg9J6SL/ANNsWD8RNk8I6IZXCIOdNHwYAYFkYMtFkzPN5Y7UnTDvpODgm1HNqipf5or1lf2N4f9twDrudMEPZOgP8TvAv4zRAL8q0zFj71vcdarSkzVUYGUTu43T7bz6jh/UMr/JlkRO3fKnIjLJhvLGhfoyD4mTTefWsOmsVrSUf9AAARGinDbmGsi3jG7VaYZigFeM6pYeYZEu8yKHG1EUftRtCBJcxo1sOTXP4PZJOQOCCHtNnmGLL9pb9pc/6JyAy/smYtrjAphojsHBepuVZsSsC6cQBgDFjgyqmOYKei2XUmDrDXf6jvWnP+S3ewfsGbXpDLyaroxSnGZmW0/yA+9aJd0hfGvQPDBkaohle5Uv2lv11z/J2Sa+XO2yy6YJMyzPWvrXW49wdEdZ6UEYP6wlGbMP6y7+xUxCEuWAWB0NGP6PTvMqXYpsx3ztxP/BzoNgpo2TTqJyU7UxOe07fLLmSRdNh19CIvjEIgBV2AY3oJ4O2wi6gEf1gkAJwV/wuAlt864awO+kdfsTvqKfU6zgdciVNCMugQwALYkesV09V3wyphrYIw6AV7vDrakS9hVMhZDeklwY5TLEFsS5WKlOVd3qYtyt6ZdAPfJdn1Zi6jKkeZfSJoA36AxJz9prtVqYrlwPOFQhBGaRAuGH9aS3ICfk++nKM3B5BGLTKSuyOTupLmAhAvcf4OVCsApiz1+2rOqkv+agbKn61oFVe4lmVVLN43ifFPqHbFuSwKrsr7ovrKqlmfakoWIyft5sWtGLtWQvyaTmLc12oNKGdF4Jt7NaoxXjRvhOD8kyzrFgThcpUJbBWc3SEXDwOcH+n0y0N0hquVbPoYpJeAfjKylkfa67fCNIcANjcxK6U+KVFyGGh0PJ6HXt70Gj++tl1HNRvEGuwBa9YswWPQNhgJfZpL7fgLS7itXv38B0Rfm4UojXmO9FVCtkml240OtnIoJsn9icSvhCb4r1emnP8WF7Gt0S4SoT1J/sLfzo8xJVr1/B2J3rz8/jAdfE5EX59oreqFD7JZvFqo/i6Xa6x+7EPq+eqvwHgvMgtlVIfmTTj/xt1BkWcpB+WXPuayCAPIoM8iAzyIDLIg8ggDyKDPIgM8uBvpT6a+TZm4bEAAAAASUVORK5CYII='

	let presets = {
		playSelected: {
			type: 'button',
			category: 'Playlist',
			name: 'Play Selected',
			options: {},
			style: {
				png64: playIcon,
				pngalignment: 'center:center',
				size: '18',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [{ actionId: 'play_select' }],
					up: [],
				},
			],
			feedbacks: [],
		},
		playPlaylist: {
			type: 'button',
			category: 'Playlist',
			name: 'Play Playlist',
			options: {},
			style: {
				png64: playPlaylistIcon,
				pngalignment: 'center:center',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'play',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		pause: {
			type: 'button',
			category: 'Playlist',
			name: 'Pause',
			options: {},
			style: {
				png64: pauseIcon,
				pngalignment: 'center:center',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'stop',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		jumpPrevious: {
			type: 'button',
			category: 'Playlist',
			name: 'Jump to previous',
			options: {},
			style: {
				png64: skipBackwardIcon,
				pngalignment: 'center:center',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jump_prev',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		jumpNext: {
			type: 'button',
			category: 'Playlist',
			name: 'Jump to next',
			options: {},
			style: {
				png64: skipForwardIcon,
				pngalignment: 'center:center',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jump_next',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		pauseResume: {
			type: 'button',
			category: 'Playlist',
			name: 'Pause / Resume',
			options: {},
			style: {
				png64: playPauseIcon,
				pngalignment: 'center:center',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'toggle_play',
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'playStatus',
					options: {
						playPause: 'Playing',
					},
					style: {
						bgcolor: combineRgb(0, 255, 0),
					},
				},
				{
					feedbackId: 'playStatus',
					options: {
						playPause: 'Paused',
					},
					style: {
						bgcolor: combineRgb(255, 255, 0),
					},
				},
			],
		},
		panic: {
			type: 'button',
			category: 'Playlist',
			name: 'Panic',
			options: {},
			style: {
				text: 'Panic',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorRed,
			},
			steps: [
				{
					down: [
						{
							actionId: 'panic',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		playSelectedText: {
			type: 'button',
			category: 'Playlist',
			name: 'Play Selected',
			options: {},
			style: {
				text: 'Play Selected',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorGreen,
			},
			steps: [
				{
					down: [
						{
							actionId: 'play_select',
						},
					],
				},
			],
			feedbacks: [],
		},
		playPlaylistText: {
			type: 'button',
			category: 'Playlist',
			name: 'Play Playlist',
			options: {},
			style: {
				text: 'Play Playlist',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'play',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		pauseText: {
			type: 'button',
			category: 'Playlist',
			name: 'Pause',
			options: {},
			style: {
				text: 'Pause',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'stop',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		jumpPreviousText: {
			type: 'button',
			category: 'Playlist',
			name: 'Jump to previous',
			options: {},
			style: {
				text: 'Jump to previous',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jump_prev',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		jumpNextText: {
			type: 'button',
			category: 'Playlist',
			name: 'Jump to next',
			options: {},
			style: {
				text: 'Jump to next',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jump_next',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		pauseResumeText: {
			type: 'button',
			category: 'Playlist',
			name: 'Pause / Resume',
			options: {},
			style: {
				text: 'Pause / Resume',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'toggle_play',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		rewindText: {
			type: 'button',
			category: 'Playlist',
			name: 'Rewind',
			options: {},
			style: {
				text: 'Rewind',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'rewind',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		jumpSelected: {
			type: 'button',
			category: 'Playlist',
			name: 'Jump to selected',
			options: {},
			style: {
				text: 'Jump\\nSelected',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jump_selected',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		selectPrevious: {
			type: 'button',
			category: 'Playlist',
			name: 'Select previous',
			options: {},
			style: {
				text: 'Select\\nPrevious',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'select_prev',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		selectNext: {
			type: 'button',
			category: 'Playlist',
			name: 'Select next',
			options: {},
			style: {
				text: 'Select\\nNext',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'select_next',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		goTo30: {
			type: 'button',
			category: 'Playlist',
			name: 'Goto 30',
			options: {},
			style: {
				text: 'Goto\\n30',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'goto_30',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		goTo20: {
			type: 'button',
			category: 'Playlist',
			name: 'Goto 20',
			options: {},
			style: {
				text: 'Goto\\n20',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'goto_20',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		goTo10: {
			type: 'button',
			category: 'Playlist',
			name: 'Goto 10',
			options: {},
			style: {
				text: 'Goto\\n10',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'goto_10',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		toggleFullscreen: {
			type: 'button',
			category: 'Playlist',
			name: 'Toggle Fullscreen',
			options: {},
			style: {
				text: 'Toggle\\nFullscreen',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'fullscreenToggle',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		fullscreenOn: {
			type: 'button',
			category: 'Playlist',
			name: 'Fullscreen On',
			options: {},
			style: {
				text: 'Fullscreen\\nOn',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'fullscreenOn',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		fullscreenOff: {
			type: 'button',
			category: 'Playlist',
			name: 'Fullscreen Off',
			options: {},
			style: {
				text: 'Fullscreen\\nOff',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'fullscreenOff',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		togglePlaylistLoop: {
			type: 'button',
			category: 'Playlist',
			name: 'Toggle Playlist Loop',
			options: {},
			style: {
				text: 'Toggle\\nPlaylist\\nLoop',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'plLoopToggle',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		playlistLoopOn: {
			type: 'button',
			category: 'Playlist',
			name: 'Playlist Loop On',
			options: {},
			style: {
				text: 'Playlist\\nLoop\\nOn',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'plLoopOn',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		playlsitLoopOff: {
			type: 'button',
			category: 'Playlist',
			name: 'Playlist Loop Off',
			options: {},
			style: {
				text: 'Playlist\\nLoop\\nOff',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'plLoopOff',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		toggleTransitionOnPlay: {
			type: 'button',
			category: 'Playlist',
			name: 'Toggle Transition on Play',
			options: {},
			style: {
				text: 'Toggle\\nTransition',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'plTransToggle',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		transitionOnPlayOff: {
			type: 'button',
			category: 'Playlist',
			name: 'Transition on Play Off',
			options: {},
			style: {
				text: 'Playlist\\nTransition\\nOff',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'plTransOff',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		transitionOnPlayOn: {
			type: 'button',
			category: 'Playlist',
			name: 'Transition on Play On',
			options: {},
			style: {
				text: 'Playlist\\nTransition\\nOn',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'plTransOn',
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		playCue: {
			type: 'button',
			category: 'Cue',
			name: 'Play Cue',
			options: {},
			style: {
				text: 'Play\\nCue\\n(Number)',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorGreen,
			},
			steps: [
				{
					down: [
						{
							actionId: 'play_cue',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		jumpToCueWithNamePlay: {
			type: 'button',
			category: 'Cue',
			name: 'Jump to cue with (name) and Play',
			options: {},
			style: {
				text: 'Play\\nCue\\n(Name)',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorGreen,
			},
			steps: [
				{
					down: [
						{
							actionId: 'playCueName',
							options: {
								string: '',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		jumpToCueWithName: {
			type: 'button',
			category: 'Cue',
			name: 'Jump to cue with name',
			options: {},
			style: {
				text: 'Jump\\nCue\\n(Name)',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jumpCueName',
							options: {
								string: '',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		jumpToSpecificCue: {
			type: 'button',
			category: 'Cue',
			name: 'Jump to specific cue',
			options: {},
			style: {
				text: 'Jump\\nCue\\n(Number)',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'jump_cue',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		selectCue: {
			type: 'button',
			category: 'Cue',
			name: 'Select cue ',
			options: {},
			style: {
				text: 'Select\\nCue\\n(Number)',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'select_cue',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		toggleFadeIn: {
			type: 'button',
			category: 'Cue',
			name: 'Toggle Fade In',
			options: {},
			style: {
				text: 'Toggle\\nFade\\nIn',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'toggleFadeIn',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		fadeInOn: {
			type: 'button',
			category: 'Cue',
			name: 'Fade In On',
			options: {},
			style: {
				text: 'Fade\\nIn\\nOn',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'fadeInOn',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		fadeInOff: {
			type: 'button',
			category: 'Cue',
			name: 'Fade In Off',
			options: {},
			style: {
				text: 'Fade\\nIn\\nOff',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'fadeInOff',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		toggleFadeOut: {
			type: 'button',
			category: 'Cue',
			name: 'Toggle Fade Out',
			options: {},
			style: {
				text: 'Toggle\\nFade\\nOut',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'toggleFadeOut',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		fadeOutOn: {
			type: 'button',
			category: 'Cue',
			name: 'Fade Out On',
			options: {},
			style: {
				text: 'Fade\\nOut\\nOn',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'fadeOutOn',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		fadeOutOff: {
			type: 'button',
			category: 'Cue',
			name: 'Fade Out Off',
			options: {},
			style: {
				text: 'Fade\\nOut\\nOff',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'fadeOutOff',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		toggleAudio: {
			type: 'button',
			category: 'Cue',
			name: 'Toggle Audio',
			options: {},
			style: {
				text: 'Toggle\\nAudio',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'toggleAudio',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		audioOn: {
			type: 'button',
			category: 'Cue',
			name: 'Audio On',
			options: {},
			style: {
				text: 'Audio\\nOn',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'audioOn',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		audioOff: {
			type: 'button',
			category: 'Cue',
			name: 'Audio Off',
			options: {},
			style: {
				text: 'Audio\\nOff',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'audioOff',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		toggleLoop: {
			type: 'button',
			category: 'Cue',
			name: 'Toggle Loop',
			options: {},
			style: {
				text: 'Toggle\\nLoop',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'toggleLoop',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		loopOn: {
			type: 'button',
			category: 'Cue',
			name: 'Loop On',
			options: {},
			style: {
				text: 'Loop\\nOn',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'loopOn',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		loopOff: {
			type: 'button',
			category: 'Cue',
			name: 'Loop Off',
			options: {},
			style: {
				text: 'Loop\\nOff',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'loopOff',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		togglePauseAtBeginning: {
			type: 'button',
			category: 'Cue',
			name: 'Toggle Pause at Beginning',
			options: {},
			style: {
				text: 'Toggle\\nPause\\nBeginning',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'togglePauseAtBeginning',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		pauseAtBeginningOn: {
			type: 'button',
			category: 'Cue',
			name: 'Pause At Beginning On',
			options: {},
			style: {
				text: 'Pause\\nBeginning\\nOn',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'pauseAtBeginningOn',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		pauseAtBeginningOff: {
			type: 'button',
			category: 'Cue',
			name: 'Pause At Beginning Off',
			options: {},
			style: {
				text: 'Pause\\nBeginning\\nOff',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'pauseAtBeginningOff',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		togglePauseAtEnd: {
			type: 'button',
			category: 'Cue',
			name: 'Toggle Pause at End',
			options: {},
			style: {
				text: 'Toggle\\nPause\\nEnd',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'togglePauseAtEnd',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		pauseAtEndOn: {
			type: 'button',
			category: 'Cue',
			name: 'Pause At End On',
			options: {},
			style: {
				text: 'Pause\\nEnd\\nOn',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'pauseAtEndOn',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		pauseAtEndOff: {
			type: 'button',
			category: 'Cue',
			name: 'Pause At End Off',
			options: {},
			style: {
				text: 'Pause\\nEnd\\nOff',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'pauseAtEndOff',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		toggleTransition: {
			type: 'button',
			category: 'Cue',
			name: 'Toggle Transition',
			options: {},
			style: {
				text: 'Toggle\\nTransition',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'toggleTransition',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		transitionOn: {
			type: 'button',
			category: 'Cue',
			name: 'Transition On',
			options: {},
			style: {
				text: 'Transition\\nOn',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'transitionOn',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		transitionOff: {
			type: 'button',
			category: 'Cue',
			name: 'Transition Off',
			options: {},
			style: {
				text: 'Transition\\nOff',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'transitionOff',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		toggleVideoFX: {
			type: 'button',
			category: 'Cue',
			name: 'Toggle VideoFx',
			options: {},
			style: {
				text: 'Toggle\\nVideoFx',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'toggleVideoFx',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		videoFXOn: {
			type: 'button',
			category: 'Cue',
			name: 'VideoFx On',
			options: {},
			style: {
				text: 'VideoFx\\nOn',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'videoFxOn',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		videoFXOff: {
			type: 'button',
			category: 'Cue',
			name: 'VideoFx Off',
			options: {},
			style: {
				text: 'VideoFx\\nOff',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'videoFxOff',
							options: {
								cuenumber: 'current',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		currentCueStatus: {
			type: 'button',
			category: 'Status',
			name: 'Current Cue',
			options: {},
			style: {
				text: 'Current:\\n$(mitti:currentCueName)',
				size: 'auto',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [{}],
			feedbacks: [],
		},
		previousCueStatus: {
			type: 'button',
			category: 'Status',
			name: 'Previous Cue',
			options: {},
			style: {
				text: 'Prev:\\n$(mitti:previousCueName)',
				size: 'auto',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [{}],
			feedbacks: [],
		},
		nextCueStatus: {
			type: 'button',
			category: 'Status',
			name: 'Next Cue',
			options: {},
			style: {
				text: 'Next:\\n$(mitti:nextCueName)',
				size: 'auto',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [{}],
			feedbacks: [],
		},
		playStauts: {
			type: 'button',
			category: 'Status',
			name: 'Play Status',
			options: {},
			style: {
				text: '$(mitti:playStatus)',
				size: '18',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [{}],
			feedbacks: [
				{
					feedbackId: 'playStatus',
					options: {
						playPause: 'Playing',
					},
					style: {
						bgcolor: ColorGreen,
						color: ColorWhite,
					},
				},
			],
		},
		currentCueTRT: {
			type: 'button',
			category: 'Status',
			name: 'Current Cue - Total Run Time',
			options: {},
			style: {
				text: 'TRT:\\n$(mitti:currentCueTRT)',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [{}],
			feedbacks: [],
		},
		currentCueTimeRemaining: {
			type: 'button',
			category: 'Status',
			name: 'Current Cue - Time Remaining',
			options: {},
			style: {
				text: 'Remaining$(mitti:cueTimeLeft)',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [{}],
			feedbacks: [
				{
					feedbackId: 'timeRemaining',
					options: {
						time: 10,
					},
					style: {
						bgcolor: ColorOrange,
					},
				},
				{
					feedbackId: 'timeRemaining',
					options: {
						time: 5,
					},
					style: {
						bgcolor: ColorRed,
					},
				},
				{
					feedbackId: 'timeRemaining',
					options: {
						time: 4,
					},
					style: {
						bgcolor: ColorBlack,
					},
				},
				{
					feedbackId: 'timeRemaining',
					options: {
						time: 3,
					},
					style: {
						bgcolor: ColorRed,
					},
				},
				{
					feedbackId: 'timeRemaining',
					options: {
						time: 2,
					},
					style: {
						bgcolor: ColorBlack,
					},
				},
				{
					feedbackId: 'timeRemaining',
					options: {
						time: 1,
					},
					style: {
						bgcolor: ColorRed,
					},
				},
				{
					feedbackId: 'timeRemaining',
					options: {
						time: 0,
					},
					style: {
						bgcolor: ColorBlack,
					},
				},
			],
		},
	}

	for (let cueID in this.cues) {
		presets[`playCueID_${cueID}`] = {
			type: 'button',
			category: 'Play Cue by ID',
			name: `Play Cue ${cueID}`,
			options: {},
			style: {
				text: `Play\\n$(mitti:cue_${cueID}_cueName)`,
				size: 'auto',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'play_cue',
							options: {
								cuenumber: `${cueID}`,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'selectedCueID',
					options: {
						cueID: `${cueID}`,
					},
					style: {
						bgcolor: ColorOrange,
					},
				},
				{
					feedbackId: 'playingCueID',
					options: {
						cueID: `${cueID}`,
					},
					style: {
						bgcolor: ColorGreen,
					},
				},
			],
		}
	}

	return presets
}
