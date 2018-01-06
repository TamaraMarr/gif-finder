import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import TextField from "material-ui/TextField";
import IconButton from "material-ui/IconButton";

import { fetchService } from "../services/fetchService";

import "./Search.css";

const muiTheme = getMuiTheme({
	textField: {
		focusColor: "#2196F3"
	}
});

export default class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			searchedGif: "",
			isThereError: false,
			noSearchString: false,
			noResultsError: false,
			searchEntered: false
		};

		this.bindInit();
	}

	bindInit() {
		this.getQuery = this.getQuery.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	getQuery(event) {
		this.setState({
			searchedGif: event.target.value
		});
	}

	resetErrors() {
		this.setState({
			isThereError: false,
			noSearchString: false,
			noResultsError: false
		});
	}

	handleClick() {
		this.resetErrors();

		this.setState({
			searchEntered: true
		});

		const searchedGif = this.state.searchedGif;

		if (!searchedGif) {
			this.setState({
				noSearchString: true
			});
		} else {
			fetchService.getGif(
				searchedGif,
				response => {
					this.setState({
						noSearchString: false,
						searchedGif: ""
					});
					if (response.length === 0) {
						this.setState({
							noResultsError: true
						});
					} else {
						this.props.getGif(response);
					}
				},
				error => {
					this.setState({
						isThereError: true
					});
				}
			);
		}
	}

	handleEnterBtn = event => {
		if (event.key === "Enter") {
			this.handleClick();
		}
	};

	reloadPage() {
		window.location.reload(false);
	}

	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div>
					<div className="wrapper">
						<h1
							className="Search_headerStyle flexElement headerFlex"
							onClick={this.reloadPage}
						>
							GifGenerator
						</h1>
						{this.state.searchEntered ? (
							""
						) : (
							<img
								className="Search_defaultGifStyle flexElement"
								src="https://media.giphy.com/media/xP5kh2WPIhqhy/giphy.gif"
								alt="Default gif"
							/>
						)}
					</div>
					<div
						className="wrapper"
						style={{ marginTop: this.state.searchEntered ? "" : "15%" }}
					>
						<TextField
							hintText="Search"
							value={this.state.searchedGif}
							onChange={this.getQuery}
							onKeyPress={this.handleEnterBtn}
							className="flexItem inputFlex"
						/>

						<IconButton className="flexItem" onClick={this.handleClick}>
							<i
								className="material-icons"
								style={{ color: "white", verticalAlign: "middle" }}
							>
								search
							</i>
						</IconButton>
					</div>
				</div>

				{this.state.isThereError ? (
					<p className="Search_errorStyle">
						There's been an error, please reload the page
					</p>
				) : (
					""
				)}
				{this.state.noSearchString ? (
					<p className="Search_errorStyle">Please enter a search term</p>
				) : (
					""
				)}
				{this.state.noResultsError ? (
					<p className="Search_errorStyle">No results found</p>
				) : (
					""
				)}
			</MuiThemeProvider>
		);
	}
}