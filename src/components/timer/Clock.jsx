import { useEffect, useState } from 'react'
import { chakra, useColorModeValue, Text } from '@chakra-ui/react'
import { useColorScheme } from 'src/utils/theme'

export default function Clock({ totalTime = 0, remainingTime = 0 }) {
	const currentColor = useColorScheme()
	const fillColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.50')
	const strokeColor = useColorModeValue('gray.400', 'gray.600')

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

	const ClockText = (props) => (
		<Text
			as="text"
			x={50}
			fill="currentcolor"
			textAnchor="middle"
			fontFamily="consolas"
			{...props}
		>
			{props.children}
		</Text>
	)

	return (
		<chakra.svg
			className="base-timer"
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
			width="clamp(1vw, 45vw, 20em)"
			fill="none"
			sx={{ transformBox: 'fill-box' }}
		>
			{
				//* Util: Center lines
				// <line x1="0" y1="50" x2="100" y2="50" stroke="red" />
				// <line x1="50" y1="0" x2="50" y2="100" stroke="red" />
			}
			<GlowBlurFilter />
			<chakra.circle
				fill={fillColor}
				stroke={strokeColor}
				strokeWidth={1}
				strokeLinecap="round"
				strokeDasharray="0.1 0.9"
				strokeDashoffset="0.04"
				pathLength={60}
				r={41}
				{...circlePosition}
			/>
			<chakra.circle
				stroke={strokeColor}
				strokeWidth={1}
				pathLength={10}
				r={45}
				{...circlePosition}
			/>
			<chakra.circle
				filter="url(#base-timer__dropshadow)"
				stroke={`${currentColor}.300`}
				strokeWidth={4}
				strokeLinecap="round"
				strokeLinejoin="round"
				// Makes sure the animation starts at the top center of the circle
				transform="rotate(-89.9deg)"
				transformOrigin="center"
				transition="stroke-dasharray 1s linear"
				pathLength={total}
				r={45}
				strokeDasharray={
					// Plus 1 to prevent a strange offset in the stroke
					// in chromium based browsers
					`${remaining} ${total + 1}`
				}
				{...circlePosition}
			/>
			<ClockText y={50} fontSize="1em" fontWeight="bold">
				{hours}:{minutes}:{seconds}
			</ClockText>
			<ClockText y={60} fontSize="0.5em" fontWeight="200">
				Total 1min 31s
			</ClockText>
		</chakra.svg>
	)
}
