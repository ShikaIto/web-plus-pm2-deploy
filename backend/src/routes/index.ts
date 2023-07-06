import { Request, Response, Router } from 'express';
import userRoutes from './user';
import cardRoutes from './card';

const routes = Router();

routes.use('/users', userRoutes);

routes.use('/cards', cardRoutes);

routes.use('*', (req: Request, res: Response) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

export default routes;
