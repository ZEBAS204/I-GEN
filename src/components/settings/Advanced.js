import { Component } from 'react'

class ExportLists extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
		}
	}

	// Get the list
	getListData = (typeList) => {}

	downloadTxtFile = (btn) => {
		console.log(btn)
		btn.props.loading = true //! Should be a pointer to the clicked button

		const element = document.createElement('a')
		const listData = new Blob([this.getListData().join('\n')], {
			type: 'text/plain',
		})
		const typeList = 'xxxxxxxxxxxxxxx' // TODO
		element.href = URL.createObjectURL(listData)
		element.download = `${typeList}_list.txt`
		document.body.appendChild(element)
	}

	render() {
		return (
			<div className="Import-Export-Lists">
				<h1>Import/Export Lists</h1>
				<h4>Nouns</h4>
				<div className="p-grid">
					<div className="p-col-fixed">
						<span
							mode="basic"
							name="Import Nouns"
							url="./nouns"
							accept=".txt"
							auto
						/>
					</div>
					<div className="p-col-fixed">
						<span
							label="Export Nouns"
							icon="pi pi-upload"
							iconPos="left"
							// loading
							onClick={(btn) => this.downloadTxtFile(btn)}
						/>
					</div>
				</div>
				<h4>Adjectives</h4>
				<div className="p-grid">
					<div className="p-col-fixed">
						<span
							mode="basic"
							name="Import Adjectives"
							url="./adjectives"
							accept=".txt"
							auto
						/>
					</div>
					<div className="p-col">
						<span
							label="Export Adjectives"
							icon="pi pi-upload"
							iconPos="left"
							// loading
							onClick={(btn) => this.downloadTxtFile.bind(this, btn)}
						/>
					</div>
				</div>
			</div>
		)
	}
}

export default ExportLists
