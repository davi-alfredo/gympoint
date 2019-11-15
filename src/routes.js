import Router from 'express';
import StudentController from './app/controllers/StudentController';
import SessioController from './app/controllers/SessionController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import AnswerController from './app/controllers/AnswerController';
import HelpOrderController from './app/controllers/HelpOrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Rotas que não necessitam de autenticação
routes.post('/sessions', SessioController.store);

// Middleware de autenticação
routes.use(authMiddleware);

// Rotas que necessitam de autenticação

// Rotas para estudantes
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

// Rotas para Planos
routes.get('/plains', PlanController.index);
routes.post('/plains', PlanController.store);
routes.put('/plains/:id', PlanController.update);
routes.delete('/plains/:id', PlanController.delete);

// Rotas para Matrículas
routes.get('/enrollments', EnrollmentController.index);
routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments/:id', EnrollmentController.update);
routes.delete('/enrollments/:id', EnrollmentController.delete);

// Rotas para Checkins
routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/:id/checkins', CheckinController.store);

// Rotas para Admin pedidos de ajuda
routes.get('/help-orders', AnswerController.index);
routes.put('/help-orders/:id/answer', AnswerController.update);

// Rotas para pedidos de ajuda
routes.get('/students/:id/help-orders', HelpOrderController.index);
routes.post('/students/:id/help-orders', HelpOrderController.store);

export default routes;
