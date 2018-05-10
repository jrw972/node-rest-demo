// @flow

import bodyParser from 'body-parser';
import express from 'express';
import healthCheck from 'express-healthcheck';
import morgan from 'morgan';

import {setupAuthentication} from './authentication';
import {setupAuthorization} from './authorization';
import {getRouter as getPeopleRouter} from './people-router';
import {getRouter as getUserRouter} from './user-router';
import actions from '../actions.json';

const app = express();

// This causes logging of all HTTP requests to be written to stdout.
// The provided options are combined, common, dev, short, and tiny.
// For more details, browse https://github.com/expressjs/morgan.
app.use(morgan('dev'));

// Enable cross-origin resource sharing
// so the web server on another port can send
// requests to this REST server on a different port.
//import cors from 'cors';
//app.use(cors());

// This is only needed to serve static files.
//app.use('/', express.static('public'));

const auth = setupAuthentication(app);
const can = setupAuthorization(app, actions);

const peopleRouter = getPeopleRouter(can);
const userRouter = getUserRouter(can);

// Parse JSON request bodGies to JavaScript objects.
app.use(bodyParser.json());

// Parse text request bodies to JavaScript strings.
app.use(bodyParser.text());

// $FlowFixMe
app.post('/login', auth, (req: express$Request, res: express$Response) => {
  // This is called when authentication is successful.

  // `req.user` contains the authenticated user.
  //TODO: How does this differ from successRedirect above?
  //res.redirect('/pid');

  //TODO: Probably don't want redirect instead of this.
  res.send('success');
});

app.get('/logout', (req: express$Request, res: express$Response) => {
  // $FlowFixMe - Passport adds the logout method to the request object.
  req.logout();
  //res.redirect('/');
  res.send('success');
});

// This route is not protected.
app.get('/pid', (req: express$Request, res: express$Response) =>
  res.send(String(process.pid))
);

app.use('/people', peopleRouter);
app.use('/user', userRouter);

// This route is not protected.
// To get uptime of server, browse localhost:3001.
app.use(/^\//, healthCheck());

const PORT = 3001;
app.listen(PORT, () => console.info('listening on', PORT));
