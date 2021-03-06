// @flow

import express from 'express';
import {
  createPerson,
  deletePerson,
  disablePerson,
  enablePerson,
  getAllDisabled,
  getAllEnabled,
  getAllPeople,
  getPersonById,
  report
} from './people-service';
import {wrap} from './util/error-util';
import {castObject} from './util/flow-util';

import type {CanFnType} from './authorization';

/**
 * This returns an Express Router that defines routes
 * for the "people" services.
 */
export function getRouter(can: CanFnType) {
  const router = express.Router();

  /**
   * This greatly simplifies route configuration.  It ensures that
   * all routes check for authorization using the "can" function
   * and handles errors consistently.
   */
  function route(method: string, path: string, action: string, handler) {
    // $FlowFixMe - doesn't like calling a computed method
    router[method](path, can(action), wrap(handler));
  }

  route('get', '/', 'get all people', () => getAllPeople());

  route('get', '/report', 'email all people', report);

  route('delete', '/:id', 'delete person', req => deletePerson(req.params.id));

  route('get', '/disabled', 'get all disabled', () => getAllDisabled());

  route('get', '/enabled', 'get all enabled', () => getAllEnabled());

  // This route must follow the previous two or those won't work
  // because it will treat "disabled" and "enabled" as ids.
  route('get', '/:id', 'get specific person', req =>
    getPersonById(req.params.id)
  );

  route('post', '/', 'create new person', async (req, res) => {
    const inPerson = castObject(req.body);
    const outPerson = await createPerson(inPerson);
    res.send(outPerson);
  });

  route('put', '/:id/disable', 'disable person', req =>
    disablePerson(req.params.id)
  );

  route('put', '/:id/enable', 'enable person', req =>
    enablePerson(req.params.id)
  );

  return router;
}
