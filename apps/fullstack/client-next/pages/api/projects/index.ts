import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
// import { all } from '../../../middlewares';
// import { list } from '../../../utils/methods';

// import Model from '../../../models/User';

// const handler = nc().use(all);
const handler = nc();

handler.get((req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ ok: 'next api' });
});

export default handler;
