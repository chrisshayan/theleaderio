LeftNavProfile = ({ currentUser }) => (
	<div className="p hidden-folded blue-50 left-nav-bg-cover">
		<div className="rounded w-64 bg-white inline pos-rlt">
			<img src="/images/a0.jpg" className="img-responsive rounded"/>
		</div>
		<div className="block m-t-sm">
			<a href="/app/profile" className="btn-link small">
				<span className="block font-bold">{currentUser && currentUser.fullname()}</span>
			</a>
			<span>{ currentUser && (currentUser.profile.headline) }</span>
		</div>
	</div>
);