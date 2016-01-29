LeftNav = ({ menuItems, currentUser, profile }) => (
	<aside id="aside" className="app-aside modal fade " role="menu">
		<div className="left">
			<div className="box bg-white">
				<div className="navbar md-whiteframe-z1 no-radius indigo-600">
					<a className="navbar-brand">
						<span className="hidden-folded m-l inline">theLeader.io</span>
					</a>
				</div>

				<div className="box-row">
					<div className="box-cell scrollable hover">
						<div className="box-inner">
							<LeftNavProfile currentUser={currentUser}/>

							<div id="nav">
								<nav ui-nav="">
									<ul className="nav">
										{menuItems.map((item, key) => (
											<li key={key} className={item.className}>
												<a className="waves-effect" href={item.link}>
													<i className={item.iconClass}></i>
													<span className="font-normal">{item.label}</span>
												</a>
											</li>
										))}
									</ul>
								</nav>
							</div>

							<div id="account" className="hide m-v-xs">
								<nav>
									<ul className="nav">
										<li>
											<a md-ink-ripple="" href="/app/profile"
											   className=" waves-effect">
												<i className="icon mdi-action-perm-contact-cal i-20"></i>
												<span>My Profile</span>
											</a>
										</li>
										<li>
											<a md-ink-ripple="" href="/logout"
											   className=" waves-effect">
												<i className="icon mdi-action-exit-to-app i-20"></i>
												<span>Logout</span>
											</a>
										</li>
										<li className="m-v-sm b-b b"></li>
										<li>
											<div className="nav-item" ui-toggle-className="folded" target="#aside">
												<label className="md-check">
													<input type="checkbox"/>
													<i className="purple no-icon"></i>
													<span className="hidden-folded">Folded aside</span>
												</label>
											</div>
										</li>
									</ul>
								</nav>
							</div>
						</div>
					</div>
				</div>
				<nav>
					<ul className="nav b-t b">
						<li>
							<a href="/app/help" className=" waves-effect">
								<i className="icon mdi-action-help i-20"></i>
								<span>Help &amp; Q/A</span>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	</aside>
);