import Fastify    from "fastify"
import fastifyJwt from '@fastify/jwt';


const app = Fastify( { logger: true } )

app.register( fastifyJwt, {
	// secret: process.env.JWT_SECRET,
	secret: '1546988ced8557a1bab73a6a0be8bf1aaaffda145f0f850d8402894d8b9c6dc3'
} )

app.get( '/v1/jwt', async ( request, reply ) => {
	const token = await reply.jwtSign( { id: '123' } );
} )
app.addHook( "onRequest", async ( request, reply ) => {
	console.log( "\n\n\n request.headers:", request.headers )
	let token = request.headers.authorization
	app.log.info( `Check if token is valid: ${ token }` )
	try {
		console.log( "\n\n\n path: ", request.routerPath )
		if ( request.routerPath === "/v1/check" )
			await request.jwtVerify()
	}
	catch ( err ) {
		reply.send( err )
	}
} )
app.get( '/v1/check', ( request, reply ) => {
	reply.send( {
					code   : 'OK',
					message: 'it works!'
				} )
} )


const start = async () => {
	try {
		await app.listen( {
							  // port: process.env.PORT,
							  port: 3000,
							  host: '0.0.0.0'
						  } )
	}
	catch ( err ) {
		app.log.error( err )
		process.exit( 1 )
	}
}

//---/ Error Handler: used to modify the error message from the schema /---------------
app.setErrorHandler( ( error, request, reply ) => {

	if ( error.validation ) {
		return reply
			.code( 422 )
			.type( 'application/json' )
			.send( {
					   "statusCode": 422,
					   "error"     : "Bad Request",
					   "message"   : error.validation[ 0 ].message
				   } )
	}
	reply.send( error )
} )


start().then( () => {
	app.log.info( 'Server is up.' );
	app.log.info( `environment: ${ process.env.NODE_ENV }` )
} );

app.ready( () => {
	console.log( '\x1b[35m%s\x1b[0m', '//-----/SERVER iS READY//-----------------------------------------------------------------------' );  //cyan
	console.log( app.printRoutes() )
	console.log( '\x1b[35m%s\x1b[0m', '//-----/SERVER iS READY//-----------------------------------------------------------------------' );  //cyan


} );



