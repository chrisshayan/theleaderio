JsonRoutes.Middleware.use('/api', JsonRoutes.Middleware.parseBearerToken);
JsonRoutes.Middleware.use('/api', JsonRoutes.Middleware.authenticateMeteorUserByToken);

// Enable cross origin requests for all endpoints
JsonRoutes.setResponseHeaders({
	"Cache-Control": "no-store",
	"Pragma": "no-cache",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
});

SimpleRest.configure({
	collections: []
});