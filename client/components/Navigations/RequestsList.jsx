RequestsList = ({requests = []}) => (
	<div>
		{requests.length > 0 ? (
			<div className="streamline b-l b-accent m-b">
				{requests.map((request, key) => <RequestsListItem request={request} key={key} />)}
			</div>
		) : (
			<h5 className="text-muted text-center">There is no request.</h5>
		)}
	</div>
);