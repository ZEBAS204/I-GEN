import { Component } from 'react'
import { Box, Flex, Spacer, Icon, Text, Stack } from '@chakra-ui/react'
import { IoAdd } from 'react-icons/io5' // + Icon

import TTS from '../utils/tts' // TTS

class WordGenerator extends Component {
	constructor(props) {
		super(props)
		this.state = {
			number: 1,
			words: {
				noun: 'postcard',
				adjective: 'thinking',
			},
			// TODO: Add user preference validation and TTS
		}

		this.regenerateWord = this.regenerateWord.bind(this)
	}

	// Get a random word from both lists: nouns and adjectives
	regenerateWord() {
		//! Hardcoded but do the work for debugging purposes
		if (this.state.number === 1) {
			this.setState({
				number: 2,
				words: { noun: 'zzzzzzzzzzz', adjective: 'zzzzzzzzzzz' },
			})
		}
		if (this.state.number === 2) {
			this.setState({
				number: 3,
				words: { noun: 'xxxxxcfzv', adjective: 'zdvzdsbhszjnx' },
			})
		}
		if (this.state.number === 3) {
			this.setState({
				number: 4,
				words: {
					noun: 'egad564ad56h4ad6h',
					adjective: 'gjmz4556<h4w6efaaax :3',
				},
			})
		}
		if (this.state.number === 4) {
			this.setState({
				number: 1,
				words: {
					noun: 'asasasas',
					adjective: 'pppppppppppppppppppp',
				},
			})
		}

		// Todo: read user setting
		new TTS(`${this.state.words.adjective} ${this.state.words.noun}`).say()
	}

	render() {
		return (
			<Stack>
				<Flex align="center">
					<Box boxShadow="md" p="6" rounded="md">
						<Text>{this.state.words.adjective}</Text>
					</Box>
					<Spacer />
					<Box rounded="md">
						<Icon as={IoAdd} fontSize="20px" />
					</Box>
					<Spacer />
					<Box boxShadow="md" p="6" maxW="3xl" rounded="md">
						<Text>{this.state.words.noun}</Text>
					</Box>
				</Flex>
			</Stack>
		)
	}
}

export default WordGenerator
