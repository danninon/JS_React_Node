class MessageItem extends React.Component {
	constructor(props) {
		super(props);
		//this.handle_click = this.handle_click.bind( this );
		//this.state = { messageAuthorName: '', messageText: '', messageTime: '' };
	}

	render() {
		return React.createElement(
			'div',
			{ className: 'MessageItem ' },
			React.createElement(
				'div',
				{ className: 'container' },
				React.createElement(
					'label',
					null,
					React.createElement(
						'strong',
						null,
						'From:'
					)
				),
				React.createElement(
					'label',
					{ className: 'messageAuthorName' },
					this.props.message.from.name
				)
			),
			React.createElement(
				'div',
				{ className: 'container' },
				React.createElement(
					'label',
					null,
					React.createElement(
						'strong',
						null,
						'Text:'
					)
				),
				React.createElement('textarea', { value: this.props.message.text, disabled: true, className: 'messageText' })
			),
			React.createElement(
				'div',
				{ className: 'container' },
				React.createElement(
					'label',
					null,
					React.createElement(
						'strong',
						null,
						'Time:'
					)
				),
				React.createElement(
					'label',
					{ className: 'messageTime' },
					this.props.message.date
				)
			)
		);
	}
}

//insert add button
class MessageListBox extends React.Component {

	constructor(props) {
		super(props);

		this.hande_message_input_box = this.hande_message_input_box.bind(this);
		this.handle_message_submit = this.handle_message_submit.bind(this);
		this.state = { messages: [], messageText: '', messageRecipientId: '' };
	}

	//initial fetch
	async componentDidMount() {
		const messages = await this.fetch_messages();
		this.update_message_list(messages);
	}

	//should filter by time


	render() {
		return React.createElement(
			'div',
			{ className: 'formcontainer' },
			React.createElement(
				'div',
				{ className: 'main-block' },
				React.createElement(
					'div',
					{ className: 'container' },
					React.createElement(
						'h2',
						null,
						'Message'
					),
					React.createElement('textarea', {
						type: 'name',
						name: 'messageText',
						placeholder: 'write message here: when finished, press the submit button to upload the message.',
						value: this.state.messageText,
						onChange: this.hande_message_input_box,
						required: true
					}),
					React.createElement('hr', null),
					React.createElement(
						'h2',
						null,
						'Recipient'
					),
					React.createElement('input', {
						type: 'id',
						name: 'messageRecipientId',
						placeholder: 'write recipient\'s id here.',
						value: this.state.messageRecipientId,
						onChange: this.hande_message_input_box,
						required: true
					}),
					React.createElement(
						'button',
						{
							className: 'button',
							type: 'submit',
							name: 'Submit',
							onClick: this.handle_message_submit
						},
						'Send Message'
					),
					React.createElement(
						'div',
						{ className: 'container' },
						React.createElement(
							'div',
							null,
							this.state.messages.map((item, index) => {
								return React.createElement(MessageItem, { message: item, key: index });
							}),
							' '
						)
					)
				)
			)
		);
	}

	update_message_list(updated_messages) {
		this.setState({ messages: updated_messages });
	}

	async fetch_messages() {
		const response = await fetch('/api/users/message/all', {
			headers: { 'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken') }
		});
		if (response.status == 200) {
			const data = await response.json();
			return data;
		} else if (response.status == 403) {
			sessionStorage.removeItem('accessToken');
			window.location.href = '/login/login.html';
		} else {
			const err = await response.text();
			alert(err);
		}
	}

	async handle_message_submit() {
		const response = await fetch('/api/users/sendMessageToUser/', {
			method: 'POST',
			body: JSON.stringify({ messageText: this.state.messageText, messageRecipientId: this.state.messageRecipientId }),
			headers: {
				'Authorization': 'BEARER ' + sessionStorage.getItem('accessToken'),
				'Content-Type': 'application/json'
			}

		});

		if (response.status == 200) {
			this.update_message_list((await this.fetch_messages()));
			//const postItem = await response.json();
			//const res =  this.update_message_list(postItem);	
			//alert ("Success! Res: " + res)	  ;
		} else if (response.status == 403) {
			sessionStorage.removeItem('accessToken');
			window.location.href = '/login/login.html';
		} else {
			const err = await response.text();
			alert(err);
		}
	}
	async hande_message_input_box(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

};