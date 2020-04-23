/**
 * External dependencies
 */
const express = require( 'express' );
const path = require( 'path' );
const axios = require( 'axios' );
const bodyParser = require( 'body-parser' );
const session = require( 'express-session' );
const randomString = require( 'randomstring' );
const { Octokit } = require( '@octokit/rest' );
require( 'dotenv' ).config();

const app = express();
const jsonParser = bodyParser.json();
const wrapAsync = fn => ( req, res, next ) => fn( req, res, next ).catch( next );

app.use( express.static( 'public/static' ) );

app.use(
	session( {
		secret: randomString.generate(),
		cookie: { maxAge: 60000 },
		resave: false,
		saveUninitialized: false,
	} )
);

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.get( '/', ( request, response ) => {
	response.sendFile( path.resolve( __dirname, 'public', 'index.html' ) );
} );

app.get( '/api/auth', ( request, response ) => {
	if ( undefined === request.session.accessToken ) {
		request.session.csrf_string = randomString.generate();
		response.send( { auth: false, clientId, state: request.session.csrf_string } );
	} else {
		response.send( { auth: true } );
	}
} );

app.get( '/api/redirect', ( request, response ) => {
	const returnedState = request.query.state;
	if ( request.session.csrf_string === returnedState ) {
		const body = {
			client_id: clientId,
			client_secret: clientSecret,
			code: request.query.code,
			state: request.session.csrf_string,
		};
		const opts = { headers: { accept: 'application/json' } };
		axios
			.post( `https://github.com/login/oauth/access_token`, body, opts )
			.then( authResponse => authResponse.data.access_token )
			.then( async accessToken => {
				request.session.accessToken = accessToken;
				request.session.github = new Octokit( {
					auth: request.session.accessToken,
					userAgent: 'Fast Issues 0.0.5',
				} );
				request.session.user = await request.session.github.users.getAuthenticated();
				request.session.repos = await request.session.github.repos.list();
				response.redirect( '/' );
			} )
			.catch( error => response.status( 500 ).json( { message: error.message } ) );
	}
} );

app.get( '/api/user', ( request, response ) => {
	response.send( { repos: request.session.repos, user: request.session.user } );
} );

app.post(
	'/api/issues',
	jsonParser,
	wrapAsync( async ( request, response ) => {
		const { issues, owner, repo } = request.body;
		const github = new Octokit( {
			auth: request.session.accessToken,
			userAgent: 'Fast Issues 0.0.5',
		} );
		const toSend = [];
		let index = 0;
		let loop = null;

		loop = setInterval( async () => {
			const { title, assignees, body, labels } = issues[ index ];
			const issue = Object.assign(
				{},
				{
					owner,
					repo,
					title,
				},
				assignees && { assignees },
				body && { body },
				labels && { labels }
			);
			let newIssue;
			try {
				newIssue = await github.issues.create( issue );
			} catch ( error ) {
				clearInterval( loop );
				response.json( { error: error.message } );
				return;
			}
			toSend.push( {
				title,
				url: newIssue.data.html_url,
				assignees,
				issueId: newIssue.data.id,
				newIssue,
			} );
			if ( issues.length - 1 === index ) {
				response.send( toSend );
				clearInterval( loop );
			} else {
				index++;
			}
		}, 1500 );
	} )
);

app.use( ( error, req, res, next ) => {
	res.json( { error: error.message } );
} );

app.listen( process.env.PORT || 8080, () =>
	console.log( `🚀  Server listening on port ${ process.env.PORT || 8080 }` )
);
