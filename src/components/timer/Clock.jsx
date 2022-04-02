import { useEffect, useState } from 'react'
import '../../assets/scss/components/Clock.scss'

export default function Clock({ totalTime = 0, remainingTime = 0 }) {
	const [total, setTotal] = useState(totalTime)
	const [remaining, setRemaining] = useState(totalTime - remainingTime)

	const { seconds, minutes, hours } = {
		seconds: Math.floor((total % 3600) % 60),
		minutes: Math.floor(Math.floor((total % 3600) / 60)),
		hours: Math.floor(total / 3600),
	}

	// Ignores the first invocation
	// Prevents a weird effect of strokes
	useEffect(() => {
		setTotal(totalTime)
		setRemaining(totalTime - remainingTime)
	}, [totalTime, remainingTime])

	const circlePosition = {
		cx: 50,
		cy: 50,
	}

	const GlowBlurFilter = () => (
		<defs>
			<filter id="base-timer__dropshadow">
				<feOffset result="offOut" in="SourceGraphic" dx="0" dy="0" />
				<feGaussianBlur result="blurOut" in="offOut" stdDeviation="1" />
				<feBlend in2="blurOut" mode="normal" in="SourceGraphic" />
			</filter>
		</defs>
	)

	return (
		<svg
			className="base-timer"
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
		>
			{
				//* Util: Center lines
				// <line x1="0" y1="50" x2="100" y2="50" stroke="red" />
				// <line x1="50" y1="0" x2="50" y2="100" stroke="red" />
			}
			<GlowBlurFilter />
			<circle
				className="base-timer__path-remaining-dots"
				pathLength={60}
				r={41}
				{...circlePosition}
			/>
			<circle
				className="base-timer__path-remaining"
				pathLength={10}
				r={45}
				{...circlePosition}
			/>
			<circle
				filter="url(#base-timer__dropshadow)"
				className="base-timer__path-progress"
				pathLength={total}
				r={45}
				strokeDasharray={
					// Plus 1 to prevent a strange offset in the stroke
					// in chromium based browsers
					`${remaining} ${total + 1}`
				}
				{...circlePosition}
			/>
			<text className="base-timer__text remaining" x={50} y={50}>
				{hours}:{minutes}:{seconds}
			</text>
			<text className="base-timer__text total" x={50} y={60}>
				Total 1min 31s
			</text>
		</svg>
	)
}
